import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const state = { student: undefined as any, company: undefined as any, existingApplication: undefined as any };
const updateWhere = vi.fn(async () => []);
const updateSet = vi.fn(() => ({ where: updateWhere }));
const insertValues = vi.fn(async (value: any) => [{ insertId: value.studentId ?? value.companyId ?? 77 }]);
const fakeDb = { update: vi.fn(() => ({ set: updateSet })), insert: vi.fn(() => ({ values: insertValues })) };

vi.mock("./db", () => ({
  getDb: vi.fn(async () => fakeDb),
  getStudentProfile: vi.fn(async () => state.student),
  getCompanyProfile: vi.fn(async () => state.company),
  getApplicationByStudentAndInternship: vi.fn(async () => state.existingApplication),
  listInternships: vi.fn(async () => []),
  listStudents: vi.fn(async () => [{ student: { id: 3, university: "UNITAU", course: "ADS", semester: "4º", skills: "TypeScript", objective: "Produto", bio: "Perfil", resumeUrl: null }, user: { id: 21, name: "Estudante UNITAU" } }]),
}));

const { appRouter } = await import("./routers");

function context(profileType: "student" | "company" = "student"): TrpcContext {
  return { user: { id: 10, openId: "business-test", name: "Test", email: "test@example.com", loginMethod: "test", role: "user", profileType, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: () => undefined } as TrpcContext["res"] };
}

describe("business procedures", () => {
  beforeEach(() => { state.student = undefined; state.company = undefined; state.existingApplication = undefined; vi.clearAllMocks(); });

  it("saves a student profile and persists the student type", async () => {
    const result = await appRouter.createCaller(context("student")).profiles.saveStudent({ university: "UNITAU", universityCity: "Taubaté", course: "Computação", semester: "4º", skills: "TypeScript", objective: "Aprender produto digital" });
    expect(result).toBe(77);
    expect(updateSet).toHaveBeenCalledWith({ profileType: "student" });
    expect(insertValues).toHaveBeenCalled();
  });

  it("saves a company profile and persists the company type", async () => {
    const result = await appRouter.createCaller(context("company")).profiles.saveCompany({ legalName: "Empresa Teste", description: "Empresa de tecnologia para teste", city: "Taubaté", industry: "Tecnologia", website: "https://example.com" });
    expect(result).toBe(77);
    expect(updateSet).toHaveBeenCalledWith({ profileType: "company" });
  });

  it("rejects company publishing without a company profile", async () => {
    await expect(appRouter.createCaller(context("company")).internships.create({ title: "Estágio", description: "Descrição da vaga de teste", area: "Produto", city: "Taubaté", modality: "hibrido", requirements: "Comunicação", targetCourses: "ADS, SI", deadline: new Date() })).rejects.toThrow("Cadastre o perfil da empresa");
  });

  it("rejects duplicate applications before inserting", async () => {
    state.student = { id: 5, userId: 10 };
    state.existingApplication = { id: 91 };
    const result = await appRouter.createCaller(context("student")).applications.submit({ internshipId: 4 });
    expect(result).toBe(91);
    expect(insertValues).not.toHaveBeenCalled();
  });

  it("lists the UNITAU student directory only for companies", async () => {
    const result = await appRouter.createCaller(context("company")).students.directory({ course: "ADS" });
    expect(result[0]?.student.university).toBe("UNITAU");
  });

  it("rejects the student directory for students", async () => {
    await expect(appRouter.createCaller(context("student")).students.directory({})).rejects.toThrow("Apenas empresas");
  });

  it("loads the persisted profile type through profiles.me", async () => {
    const result = await appRouter.createCaller(context("company")).profiles.me();
    expect(result.account.profileType).toBe("company");
  });

  it("protects vacancy closing when the company profile is missing", async () => {
    await expect(appRouter.createCaller(context("company")).internships.close({ internshipId: 12 })).rejects.toThrow("Cadastre o perfil da empresa");
  });

  it("allows only companies to initiate conversations", async () => {
    await expect(appRouter.createCaller(context("student")).messages.start({ studentId: 3 })).rejects.toThrow("Apenas empresas");
  });

  it("protects application review when the company profile is missing", async () => {
    await expect(appRouter.createCaller(context("company")).applications.updateStatus({ applicationId: 4, status: "viewed" })).rejects.toThrow("Apenas empresas");
  });
});
