import { and, asc, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { applications, companyProfiles, conversations, InsertUser, internships, messages, studentProfiles, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) { values.role = user.role ?? "admin"; updateSet.role = values.role; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listInternships(filters?: { search?: string; city?: string; modality?: "presencial" | "hibrido" | "remoto"; area?: string; targetCourse?: string }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [eq(internships.status, "open")];
  if (filters?.city) conditions.push(like(internships.city, `%${filters.city}%`));
  if (filters?.modality) conditions.push(eq(internships.modality, filters.modality));
  if (filters?.area) conditions.push(like(internships.area, `%${filters.area}%`));
  if (filters?.targetCourse) conditions.push(like(internships.targetCourses, `%${filters.targetCourse}%`));
  if (filters?.search) conditions.push(or(like(internships.title, `%${filters.search}%`), like(internships.description, `%${filters.search}%`))!);
  return db.select({ internship: internships, company: companyProfiles }).from(internships).leftJoin(companyProfiles, eq(internships.companyId, companyProfiles.id)).where(and(...conditions)).orderBy(desc(internships.createdAt));
}

export async function listStudents(filters?: { course?: string; semester?: string; city?: string; skills?: string }) {
  const db = await getDb(); if (!db) return [];
  const conditions = [eq(studentProfiles.university, "UNITAU")];
  if (filters?.course) conditions.push(like(studentProfiles.course, `%${filters.course}%`));
  if (filters?.semester) conditions.push(like(studentProfiles.semester, `%${filters.semester}%`));
  if (filters?.city) conditions.push(like(studentProfiles.universityCity, `%${filters.city}%`));
  if (filters?.skills) conditions.push(like(studentProfiles.skills, `%${filters.skills}%`));
  return db.select({ student: studentProfiles, user: users }).from(studentProfiles).innerJoin(users, eq(studentProfiles.userId, users.id)).where(and(...conditions)).orderBy(desc(studentProfiles.updatedAt));
}

export async function getStudentProfile(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId)).limit(1); return result[0];
}

export async function getCompanyProfile(userId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(companyProfiles).where(eq(companyProfiles.userId, userId)).limit(1); return result[0];
}

export async function listCompanyInternships(userId: number) {
  const db = await getDb(); if (!db) return [];
  const company = await getCompanyProfile(userId); if (!company) return [];
  return db.select().from(internships).where(eq(internships.companyId, company.id)).orderBy(desc(internships.createdAt));
}

export async function getApplicationByStudentAndInternship(studentId: number, internshipId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(applications).where(and(eq(applications.studentId, studentId), eq(applications.internshipId, internshipId))).limit(1); return result[0];
}

export async function listStudentConversations(studentId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ conversation: conversations, company: companyProfiles }).from(conversations).innerJoin(companyProfiles, eq(conversations.companyId, companyProfiles.id)).where(eq(conversations.studentId, studentId)).orderBy(desc(conversations.updatedAt));
}

export async function listCompanyConversations(companyId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select({ conversation: conversations, student: studentProfiles }).from(conversations).innerJoin(studentProfiles, eq(conversations.studentId, studentProfiles.id)).where(eq(conversations.companyId, companyId)).orderBy(desc(conversations.updatedAt));
}

export async function getConversation(conversationId: number) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1); return result[0];
}

export async function listMessages(conversationId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(asc(messages.createdAt));
}
