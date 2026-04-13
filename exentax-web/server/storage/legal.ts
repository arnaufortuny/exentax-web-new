import { db } from "../db";
import { desc, and, lte } from "drizzle-orm";
import * as s from "../../shared/schema";
import { generateId, wrapStorageError } from "./core";
import { todayMadridISO } from "../server-constants";

export async function insertLegalDocVersion(data: Omit<s.InsertLegalDocVersion, "id">) {
  try {
    const id = generateId("LDV");
    await db.insert(s.legalDocumentVersions).values({ ...data, id });
    return id;
  } catch (err) { throw wrapStorageError("insertLegalDocVersion", err); }
}

export async function getActiveLegalDocVersion(docType: string): Promise<s.LegalDocVersion | null> {
  try {
    const today = todayMadridISO();
    const rows = await db.select().from(s.legalDocumentVersions)
      .where(and(
        lte(s.legalDocumentVersions.effectiveDate, today),
      ))
      .orderBy(desc(s.legalDocumentVersions.effectiveDate), desc(s.legalDocumentVersions.createdAt))
      .limit(1);
    return rows[0] ?? null;
  } catch (err) { throw wrapStorageError("getActiveLegalDocVersion", err); }
}

export async function getActiveVersionsByType(): Promise<Record<string, s.LegalDocVersion>> {
  try {
    const today = todayMadridISO();
    const all = await db.select().from(s.legalDocumentVersions)
      .where(lte(s.legalDocumentVersions.effectiveDate, today))
      .orderBy(desc(s.legalDocumentVersions.effectiveDate), desc(s.legalDocumentVersions.createdAt));
    const map: Record<string, s.LegalDocVersion> = {};
    for (const row of all) {
      if (!map[row.docType]) map[row.docType] = row;
    }
    return map;
  } catch (err) { throw wrapStorageError("getActiveVersionsByType", err); }
}

export async function seedInitialLegalVersions() {
  try {
    for (const docType of s.LEGAL_DOC_TYPES) {
      const existing = await getActiveLegalDocVersion(docType);
      if (!existing) {
        await insertLegalDocVersion({
          docType,
          version: "1.0",
          effectiveDate: "2025-01-01",
          contentHash: null,
          changelog: "Initial version",
        });
      }
    }
  } catch (err) { throw wrapStorageError("seedInitialLegalVersions", err); }
}
