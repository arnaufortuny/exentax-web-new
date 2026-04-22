import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "a", "b", "i", "em", "strong", "p", "br", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "h5", "h6", "span", "div", "table",
  "thead", "tbody", "tr", "th", "td", "blockquote", "code", "pre",
  "img", "figure", "figcaption", "hr", "sup", "sub", "mark", "aside",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "class", "id", "style", "src", "alt",
  "width", "height", "loading", "data-testid", "aria-label",
];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ["target"],
  });
}

