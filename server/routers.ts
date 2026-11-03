import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { applications, companyProfiles, conversations, internships, messages, studentProfiles, users } from "../drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import {
  getApplicationByStudentAndInternship,
  getCompanyProfile,
  getConversation,
  getDb,
  getStudentProfile,
  listCompanyConversations,
  listCompanyInternships,
  listInternships,
  listMessages,
  listStudentConversations,
  listStudents,
} from "./db";

const modality = z.enum(["presencial", "hibrido", "remoto"]);
const applicationStatus = z.enum(["sent", "viewed", "shortlisted", "rejected", "accepted"]);
const unitauStudent = z.object({
  university: z.literal("UNITAU").default("UNITAU"),
  universityCity: z.string().min(2),
  course: z.string().min(2),
  semester: z.string().min(1),
  skills: z.string().min(2),
  objective: z.string().min(10),
  bio: z.string().max(1500).optional(),
  resumeUrl: z.string().url().optional().or(z.literal("")),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  internships: router({
    list: publicProcedure.input(z.object({ search: z.string().optional(), city: z.string().optional(), modality: modality.optional(), area: z.string().optional(), targetCourse: z.string().optional() }).optional()).query(({ input }) => listInternships(input)),
    mine: protectedProcedure.query(({ ctx }) => listCompanyInternships(ctx.user.id)),
    create: protectedProcedure.input(z.object({ title: z.string().min(3), description: z.string().min(10), area: z.string().min(2), city: z.string().min(2), modality, requirements: z.string().min(3), targetCourses: z.string().min(2), deadline: z.coerce.date() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const company = await getCompanyProfile(ctx.user.id); if (!company) throw new Error("Cadastre o perfil da empresa antes de publicar uma vaga");
      if (ctx.user.profileType && ctx.user.profileType !== "company") throw new Error("Apenas perfis de empresa podem publicar vagas");
      const result = await db.insert(internships).values({ ...input, companyId: company.id });
      return { id: result[0].insertId };
    }),
    close: protectedProcedure.input(z.object({ internshipId: z.number().int() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const company = await getCompanyProfile(ctx.user.id); if (!company) throw new Error("Cadastre o perfil da empresa antes de encerrar vagas");
      const owned = await db.select().from(internships).where(and(eq(internships.id, input.internshipId), eq(internships.companyId, company.id))).limit(1);
      if (!owned[0]) throw new Error("Vaga não encontrada para esta empresa");
      await db.update(internships).set({ status: "closed" }).where(eq(internships.id, input.internshipId));
      return { success: true } as const;
    }),
  }),
  profiles: router({
    me: protectedProcedure.query(async ({ ctx }) => ({ account: { profileType: ctx.user.profileType }, student: await getStudentProfile(ctx.user.id), company: await getCompanyProfile(ctx.user.id) })),
    saveStudent: protectedProcedure.input(unitauStudent).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const existing = await getStudentProfile(ctx.user.id);
      await db.update(users).set({ profileType: "student" }).where(eq(users.id, ctx.user.id));
      if (existing) { await db.update(studentProfiles).set(input).where(eq(studentProfiles.userId, ctx.user.id)); return existing.id; }
      const result = await db.insert(studentProfiles).values({ ...input, userId: ctx.user.id }); return result[0].insertId;
    }),
    saveCompany: protectedProcedure.input(z.object({ legalName: z.string().min(2), description: z.string().min(10), city: z.string().min(2), industry: z.string().min(2), website: z.string().url().optional().or(z.literal("")) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const existing = await getCompanyProfile(ctx.user.id);
      await db.update(users).set({ profileType: "company" }).where(eq(users.id, ctx.user.id));
      if (existing) { await db.update(companyProfiles).set(input).where(eq(companyProfiles.userId, ctx.user.id)); return existing.id; }
      const result = await db.insert(companyProfiles).values({ ...input, userId: ctx.user.id }); return result[0].insertId;
    }),
  }),
  students: router({
    directory: protectedProcedure.input(z.object({ course: z.string().optional(), semester: z.string().optional(), city: z.string().optional(), skills: z.string().optional() }).optional()).query(async ({ ctx, input }) => {
      if (ctx.user.profileType !== "company") throw new Error("Apenas empresas podem consultar o diretório de estudantes");
      return listStudents(input);
    }),
  }),
  applications: router({
    mine: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb(); if (!db) return [];
      const student = await getStudentProfile(ctx.user.id); if (!student) return [];
      return db.select({ application: applications, internship: internships, company: companyProfiles }).from(applications).innerJoin(internships, eq(applications.internshipId, internships.id)).innerJoin(companyProfiles, eq(internships.companyId, companyProfiles.id)).where(eq(applications.studentId, student.id)).orderBy(desc(applications.createdAt));
    }),
    forCompany: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb(); if (!db) return [];
      const company = await getCompanyProfile(ctx.user.id); if (!company) return [];
      return db.select({ application: applications, internship: internships, student: studentProfiles }).from(applications).innerJoin(internships, eq(applications.internshipId, internships.id)).innerJoin(studentProfiles, eq(applications.studentId, studentProfiles.id)).where(eq(internships.companyId, company.id)).orderBy(desc(applications.createdAt));
    }),
    submit: protectedProcedure.input(z.object({ internshipId: z.number().int(), coverLetter: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      if (ctx.user.profileType && ctx.user.profileType !== "student") throw new Error("Apenas perfis de estudante podem se candidatar");
      const student = await getStudentProfile(ctx.user.id); if (!student) throw new Error("Cadastre o perfil de estudante antes de se candidatar");
      const existing = await getApplicationByStudentAndInternship(student.id, input.internshipId); if (existing) return existing.id;
      const result = await db.insert(applications).values({ ...input, studentId: student.id }); return result[0].insertId;
    }),
    updateStatus: protectedProcedure.input(z.object({ applicationId: z.number().int(), status: applicationStatus })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const company = await getCompanyProfile(ctx.user.id); if (!company) throw new Error("Apenas empresas podem revisar candidaturas");
      const owned = await db.select({ application: applications }).from(applications).innerJoin(internships, eq(applications.internshipId, internships.id)).where(and(eq(applications.id, input.applicationId), eq(internships.companyId, company.id))).limit(1);
      if (!owned[0]) throw new Error("Candidatura não encontrada para esta empresa");
      await db.update(applications).set({ status: input.status }).where(eq(applications.id, input.applicationId));
      return { success: true } as const;
    }),
  }),
  messages: router({
    conversations: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.profileType === "student") {
        const student = await getStudentProfile(ctx.user.id); return student ? listStudentConversations(student.id) : [];
      }
      if (ctx.user.profileType === "company") {
        const company = await getCompanyProfile(ctx.user.id); return company ? listCompanyConversations(company.id) : [];
      }
      return [];
    }),
    thread: protectedProcedure.input(z.object({ conversationId: z.number().int() })).query(async ({ ctx, input }) => {
      const conversation = await getConversation(input.conversationId); if (!conversation) throw new Error("Conversa não encontrada");
      const student = await getStudentProfile(ctx.user.id); const company = await getCompanyProfile(ctx.user.id);
      const participant = (student && conversation.studentId === student.id) || (company && conversation.companyId === company.id);
      if (!participant) throw new Error("Você não participa desta conversa");
      return listMessages(input.conversationId);
    }),
    start: protectedProcedure.input(z.object({ studentId: z.number().int() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      if (ctx.user.profileType !== "company") throw new Error("Apenas empresas podem iniciar conversas com estudantes");
      const company = await getCompanyProfile(ctx.user.id); if (!company) throw new Error("Cadastre o perfil da empresa antes de enviar mensagens");
      const student = await db.select().from(studentProfiles).where(and(eq(studentProfiles.id, input.studentId), eq(studentProfiles.university, "UNITAU"))).limit(1);
      if (!student[0]) throw new Error("Estudante UNITAU não encontrado");
      const existing = await db.select().from(conversations).where(and(eq(conversations.studentId, input.studentId), eq(conversations.companyId, company.id))).limit(1);
      if (existing[0]) return existing[0];
      const result = await db.insert(conversations).values({ studentId: input.studentId, companyId: company.id });
      return { id: result[0].insertId, studentId: input.studentId, companyId: company.id };
    }),
    send: protectedProcedure.input(z.object({ conversationId: z.number().int(), body: z.string().trim().min(1).max(2000) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new Error("Banco de dados indisponível");
      const conversation = await getConversation(input.conversationId); if (!conversation) throw new Error("Conversa não encontrada");
      const student = await getStudentProfile(ctx.user.id); const company = await getCompanyProfile(ctx.user.id);
      const participant = (student && conversation.studentId === student.id) || (company && conversation.companyId === company.id);
      if (!participant) throw new Error("Você não participa desta conversa");
      const result = await db.insert(messages).values({ conversationId: input.conversationId, senderUserId: ctx.user.id, body: input.body });
      await db.update(conversations).set({ updatedAt: new Date() }).where(eq(conversations.id, input.conversationId));
      return { id: result[0].insertId };
    }),
  }),
});

export type AppRouter = typeof appRouter;
