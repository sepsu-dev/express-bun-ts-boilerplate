import { describe, it, expect } from "@jest/globals";
import {
  createProjectSchema,
  updateProjectSchema,
  getProjectsSchema,
  projectIdSchema,
  projectSkillSchema,
  addProjectSkillSchema,
} from "./project.validation";

describe("createProjectSchema", () => {
  it("should successfully validate valid project data", () => {
    const data = {
      body: {
        title: "My Project",
        overview: "This is a detailed overview of the project.",
      },
    };
    expect(() => createProjectSchema.parse(data)).not.toThrow();
  });

  it("should fail if title is less than 5 characters", () => {
    const data = {
      body: { title: "Proj", overview: "This is a detailed overview." },
    };
    expect(() => createProjectSchema.parse(data)).toThrow();
  });

  it("should fail if overview is less than 10 characters", () => {
    const data = {
      body: { title: "My Project", overview: "Short" },
    };
    expect(() => createProjectSchema.parse(data)).toThrow();
  });

  it("should succeed with empty demo_url", () => {
    const data = {
      body: { title: "My Project", overview: "Detailed overview here", demo_url: "" },
    };
    expect(() => createProjectSchema.parse(data)).not.toThrow();
  });

  it("should fail if demo_url is invalid", () => {
    const data = {
      body: { title: "My Project", overview: "Detailed overview here", demo_url: "invalid" },
    };
    expect(() => createProjectSchema.parse(data)).toThrow();
  });
});

describe("updateProjectSchema", () => {
  it("should pass with valid params and partial body", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: { title: "Updated title" },
    };
    expect(() => updateProjectSchema.parse(data)).not.toThrow();
  });

  it("should fail with invalid uuid in params", () => {
    const data = {
      params: { uid: "not-a-uuid" },
      body: {},
    };
    expect(() => updateProjectSchema.parse(data)).toThrow();
  });

  it("should pass with empty body (all fields partial)", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: {},
    };
    expect(() => updateProjectSchema.parse(data)).not.toThrow();
  });
});

describe("getProjectsSchema", () => {
  it("should use default values when no query params provided", () => {
    const result = getProjectsSchema.parse({ query: {} });
    expect(result.query.page).toBe(1);
    expect(result.query.limit).toBe(3);
  });

  it("should transform string values to integers", () => {
    const result = getProjectsSchema.parse({ query: { page: "5", limit: "10" } });
    expect(result.query.page).toBe(5);
    expect(result.query.limit).toBe(10);
  });
});

describe("projectIdSchema", () => {
  it("should succeed with a valid UUID", () => {
    const data = { params: { uid: "550e8400-e29b-41d4-a716-446655440000" } };
    expect(() => projectIdSchema.parse(data)).not.toThrow();
  });

  it("should fail with an invalid uid", () => {
    const data = { params: { uid: "not-a-uuid" } };
    expect(() => projectIdSchema.parse(data)).toThrow();
  });
});

describe("projectSkillSchema", () => {
  it("should succeed with valid UUIDs", () => {
    const data = {
      params: {
        uid: "550e8400-e29b-41d4-a716-446655440000",
        skill_uid: "550e8400-e29b-41d4-a716-446655440001",
      },
    };
    expect(() => projectSkillSchema.parse(data)).not.toThrow();
  });
});

describe("addProjectSkillSchema", () => {
  it("should succeed with valid UUIDs", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: { skill_uid: "550e8400-e29b-41d4-a716-446655440001" },
    };
    expect(() => addProjectSkillSchema.parse(data)).not.toThrow();
  });
});