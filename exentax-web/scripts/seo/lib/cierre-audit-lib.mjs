/*
 * scripts/seo/lib/cierre-audit-lib.mjs
 * ----------------------------------------------------------------------------
 * Pure helpers used by scripts/seo/seo-cierre-audit.mjs and exercised by
 * tests/seo-cierre-audit.test.mjs. Kept dependency-free so the test suite
 * can import and run them without a live server.
 *
 * Public API (all pure functions):
 *
 *   parseUrls(xml)
 *     Returns [{ loc, alternates: [{ lang, href }] }] from a <urlset> XML
 *     payload. Tolerant of mixed whitespace and self-closing tags.
 *
 *   validateUrlEntry(entry, expectedHreflangs)
 *     Returns string[] of error messages for a single <url> block.
 *     Checks: 6 hreflang langs present (using BCP-47 codes), no extras,
 *     a self-hreflang exists (alternate.href === <loc>), x-default exists.
 *
 *   computeReciprocity(allUrls, expectedHreflangs)
 *     Returns { groups, errors[] }. A "group" is identified by the
 *     canonical alternate set keyed by the sorted (lang,href) pairs
 *     (excluding x-default). For every group the function asserts:
 *       (a) exactly N=expectedHreflangs.length members,
 *       (b) every expected lang present once and only once,
 *       (c) every member's <loc> is one of the expected hrefs,
 *       (d) every alternate href that is itself a localized URL must
 *           appear as a <loc> in the same group's member set,
 *       (e) every group member's full alternate set is byte-equal to
 *           the canonical set (so two members can't disagree).
 *     This catches asymmetric or fragmented mappings that a per-entry
 *     check would miss.
 *
 *   validateRobotsTxt(body, opts)
 *     Returns { sitemapsFound, aiBotsFound, disallowsFound, errors[] }
 *     given a robots.txt body and required {sitemaps, aiBots, disallows}
 *     lists. Errors enumerate every missing required directive.
 *
 *   validateHeaderRoute({ path, status, xRobotsTag, linkHeader }, opts)
 *     Returns string[] of error messages for one route's headers.
 *     opts.expect = "public"  → must contain "index" + "follow"
 *                              + Link rel=canonical
 *     opts.expect = "private" → must contain "noindex" + "nofollow"
 * ----------------------------------------------------------------------------
 */

export function parseUrls(xml) {
  return [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => {
    const block = m[0];
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? null;
    const alternates = [...block.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)]
      .map((a) => ({ lang: a[1], href: a[2] }));
    return { loc, alternates };
  });
}

export function validateUrlEntry(entry, expectedHreflangs) {
  const errors = [];
  if (!entry.loc) return ["<url> without <loc>"];
  const langs = entry.alternates.filter((a) => a.lang !== "x-default").map((a) => a.lang);
  // Cardinality + uniqueness.
  if (langs.length !== expectedHreflangs.length) {
    errors.push(`${entry.loc}: expected ${expectedHreflangs.length} hreflang, got ${langs.length} (${langs.join(",")})`);
  }
  const seen = new Set();
  for (const l of langs) {
    if (seen.has(l)) errors.push(`${entry.loc}: duplicate hreflang ${l}`);
    seen.add(l);
  }
  // Membership: every expected lang present, no extras.
  for (const required of expectedHreflangs) {
    if (!seen.has(required)) errors.push(`${entry.loc}: missing hreflang ${required}`);
  }
  for (const l of seen) {
    if (!expectedHreflangs.includes(l)) errors.push(`${entry.loc}: unexpected hreflang ${l}`);
  }
  // x-default + self.
  const xdef = entry.alternates.find((a) => a.lang === "x-default");
  if (!xdef) {
    errors.push(`${entry.loc}: missing x-default`);
  } else {
    // x-default must point at the group's Spanish (es-ES) canonical, as
    // declared in 06-seo-cierre.md. We treat es-ES as the spoke that
    // anchors the group; any other target would split signal between
    // the two URLs.
    const esES = entry.alternates.find((a) => a.lang === "es-ES");
    if (esES && xdef.href !== esES.href) {
      errors.push(
        `${entry.loc}: x-default points to ${xdef.href}, expected es-ES (${esES.href})`,
      );
    }
  }
  const self = entry.alternates.find((a) => a.href === entry.loc && a.lang !== "x-default");
  if (!self) errors.push(`${entry.loc}: missing self-hreflang`);
  return errors;
}

function canonicalKey(entry) {
  return entry.alternates
    .filter((a) => a.lang !== "x-default")
    .map((a) => [a.lang, a.href])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
    .map(([l, h]) => `${l}=${h}`)
    .join("|");
}

export function computeReciprocity(allUrls, expectedHreflangs) {
  const errors = [];
  const expectedN = expectedHreflangs.length;
  const groups = new Map(); // canonicalKey → { members: [loc], expectedHrefs: Set, langPairs: [[lang,href]] }
  for (const u of allUrls) {
    if (!u.loc) continue;
    const key = canonicalKey(u);
    if (!groups.has(key)) {
      const langPairs = u.alternates
        .filter((a) => a.lang !== "x-default")
        .map((a) => [a.lang, a.href]);
      groups.set(key, {
        members: [],
        langPairs,
        expectedHrefs: new Set(langPairs.map(([, h]) => h)),
      });
    }
    groups.get(key).members.push(u.loc);
  }
  let i = 0;
  for (const group of groups.values()) {
    i += 1;
    const langs = group.langPairs.map(([l]) => l).sort();
    const expectedLangs = [...expectedHreflangs].sort();
    // (a) cardinality
    if (group.members.length !== expectedN) {
      errors.push(`reciprocity[group#${i}]: expected ${expectedN} members, got ${group.members.length} (${group.members.join(", ")})`);
    }
    // (b) every expected lang present once
    if (langs.join(",") !== expectedLangs.join(",")) {
      errors.push(`reciprocity[group#${i}]: langs [${langs.join(",")}] !== expected [${expectedLangs.join(",")}]`);
    }
    // (c) every member's <loc> is one of the expected hrefs
    for (const m of group.members) {
      if (!group.expectedHrefs.has(m)) {
        errors.push(`reciprocity[group#${i}]: member ${m} is not listed in its own group's alternates`);
      }
    }
    // (d) every group has all expected hrefs covered by an actual member
    for (const h of group.expectedHrefs) {
      if (!group.members.includes(h)) {
        errors.push(`reciprocity[group#${i}]: expected member ${h} is missing from the group (asymmetric mapping)`);
      }
    }
  }
  // (e) cross-group consistency: a single URL must not appear in more than one group
  const seen = new Map();
  let g = 0;
  for (const group of groups.values()) {
    g += 1;
    for (const m of group.members) {
      if (seen.has(m) && seen.get(m) !== g) {
        errors.push(`reciprocity: URL ${m} appears in groups #${seen.get(m)} and #${g} (fragmented alternate sets)`);
      }
      seen.set(m, g);
    }
  }
  return { groups, errors };
}

export function validateRobotsTxt(body, { sitemaps, aiBots, disallows }) {
  const errors = [];
  const sitemapLines = [...body.matchAll(/^Sitemap:\s*(\S+)\s*$/gm)].map((m) => m[1]);
  const userAgents = [...body.matchAll(/^User-agent:\s*([^\s#]+)/gm)].map((m) => m[1]);
  const disallowLines = [...body.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);
  const sitemapsFound = sitemapLines;
  const aiBotsFound = userAgents.filter((ua) => aiBots.includes(ua));
  const disallowsFound = [...new Set(disallowLines)];
  // Build per-bot blocks: each "User-agent: X" starts a block that owns
  // the directive lines until the next "User-agent" or end-of-file. We
  // need this to verify that an explicit Allow directive accompanies
  // every AI bot we allow-list (an empty block, or one with only
  // Disallow rules, would silently fail-closed for that bot).
  const aiBotsAllowed = [];
  const aiBotsAllowOk = new Set();
  const lines = body.split(/\r?\n/);
  let currentBots = [];
  const blocks = new Map(); // bot → list of directive lines in that block
  for (const raw of lines) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) { currentBots = []; continue; }
    const ua = line.match(/^User-agent:\s*(\S+)/i);
    if (ua) {
      currentBots.push(ua[1]);
      if (!blocks.has(ua[1])) blocks.set(ua[1], []);
      continue;
    }
    if (/^Sitemap:/i.test(line)) { currentBots = []; continue; }
    for (const bot of currentBots) blocks.get(bot).push(line);
  }
  for (const bot of aiBots) {
    const blockLines = blocks.get(bot);
    if (blockLines && blockLines.some((l) => /^Allow:\s*\/\s*$/i.test(l))) {
      aiBotsAllowOk.add(bot);
      aiBotsAllowed.push(bot);
    }
  }
  for (const required of sitemaps) {
    if (!sitemapLines.includes(required)) errors.push(`robots.txt: missing Sitemap directive for ${required}`);
  }
  for (const bot of aiBots) {
    if (!userAgents.includes(bot)) {
      errors.push(`robots.txt: missing AI-bot allow block for ${bot}`);
    } else if (!aiBotsAllowOk.has(bot)) {
      errors.push(`robots.txt: AI-bot ${bot} is declared but its block is missing 'Allow: /'`);
    }
  }
  for (const required of disallows) {
    if (!disallowLines.includes(required)) errors.push(`robots.txt: missing Disallow ${required}`);
  }
  return { sitemapsFound, aiBotsFound, aiBotsAllowed, disallowsFound, errors };
}

export function validateHeaderRoute({ path, status, xRobotsTag, linkHeader }, opts) {
  const errors = [];
  const xrt = xRobotsTag || "";
  const link = linkHeader || "";
  // Tokenise the header so "noindex, follow" doesn't accidentally match
  // /index/ via a substring of "noindex".
  const tokens = xrt.split(/[\s,]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
  const has = (t) => tokens.includes(t);
  if (opts.expect === "public") {
    // A public route that 404s but still emits index/canonical would be
    // an indexable broken page — we explicitly reject that.
    if (status !== undefined && status !== 200) {
      errors.push(`${path}: expected HTTP 200 for a public route, got ${status}`);
    }
    if (!has("index") || !has("follow") || has("noindex") || has("nofollow")) {
      errors.push(`${path}: expected 'index, follow' X-Robots-Tag, got "${xrt}"`);
    }
    if (!/rel="canonical"/i.test(link)) {
      errors.push(`${path}: missing rel=canonical Link header`);
    }
  } else if (opts.expect === "private") {
    if (!has("noindex") || !has("nofollow")) {
      errors.push(`${path}: expected 'noindex, nofollow' X-Robots-Tag, got "${xrt}"`);
    }
  } else {
    throw new Error(`validateHeaderRoute: unknown expect "${opts.expect}"`);
  }
  return errors;
}
