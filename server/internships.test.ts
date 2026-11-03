import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: () => undefined } as TrpcContext["res"] };
}

function authenticatedContext(profileType: "student" | "company" = "student"): TrpcContext {
  return { user: { id: 42, openId: "test-user", name: "Test User", email: "test@example.com", loginMethod: "test", role: "user", profileType, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: () => undefined } as TrpcContext["res"] };
}

describe("internships, applications and messages routers", () => {
  it("exposes public listing and complete authenticated procedures", () => {
    const procedures = appRouter._def.procedures;
    expect(procedures["internships.list"]).toBeDefined();
    expect(procedures["internships.mine"]).toBeDefined();
    expect(procedures["internships.close"]).toBeDefined();
    expect(procedures["profiles.me"]).toBeDefined();
    expect(procedures["profiles.saveStudent"]).toBeDefined();
    expect(procedures["profiles.saveCompany"]).toBeDefined();
    expect(procedures["internships.create"]).toBeDefined();
    expect(procedures["applications.mine"]).toBeDefined();
    expect(procedures["applications.forCompany"]).toBeDefined();
    expect(procedures["applications.submit"]).toBeDefined();
    expect(procedures["applications.updateStatus"]).toBeDefined();
    expect(procedures["messages.conversations"]).toBeDefined();
    expect(procedures["messages.thread"]).toBeDefined();
    expect(procedures["messages.start"]).toBeDefined();
    expect(procedures["messages.send"]).toBeDefined();
  });

  it("blocks protected vacancy, application and messaging actions for visitors", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.internships.create({ title: "Vaga", description: "Descrição válida", area: "Produto", city: "Taubaté", modality: "hibrido", requirements: "Comunicação", targetCourses: "ADS", deadline: new Date() })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.applications.submit({ internshipId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.messages.conversations()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("keeps profile type available in authenticated context", () => {
    expect(authenticatedContext("company").user?.profileType).toBe("company");
  });
});
