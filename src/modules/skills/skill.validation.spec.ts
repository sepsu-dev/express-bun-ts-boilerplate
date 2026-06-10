import { describe, it, expect } from "@jest/globals";
import {
  createSkillSchema,
  updateSkillSchema,
  skillIdSchema,
} from "./skill.validation";

describe("createSkillSchema", () => {
  it("should pass with valid name and category_uid", () => {
    const data = {
      body: {
        name: "React",
        category_uid: "550e8400-e29b-41d4-a716-446655440000",
      },
    };
    expect(() => createSkillSchema.parse(data)).not.toThrow();
  });

  it("should pass with valid name, category_uid, and icon URL", () => {
    const data = {
      body: {
        name: "React",
        category_uid: "550e8400-e29b-41d4-a716-446655440000",
        icon: "https://cdn.example.com/icons/react.svg",
      },
    };
    expect(() => createSkillSchema.parse(data)).not.toThrow();
  });

  it("should pass with empty string icon", () => {
    const data = {
      body: {
        name: "React",
        category_uid: "550e8400-e29b-41d4-a716-446655440000",
        icon: "",
      },
    };
    expect(() => createSkillSchema.parse(data)).not.toThrow();
  });

  it("should fail if name is less than 2 characters", () => {
    const data = {
      body: { name: "R", category_uid: "550e8400-e29b-41d4-a716-446655440000" },
    };
    expect(() => createSkillSchema.parse(data)).toThrow();
  });

  it("should fail if category_uid is not a valid UUID", () => {
    const data = {
      body: { name: "React", category_uid: "not-a-uuid" },
    };
    expect(() => createSkillSchema.parse(data)).toThrow();
  });

  it("should fail if icon is an invalid URL", () => {
    const data = {
      body: {
        name: "React",
        category_uid: "550e8400-e29b-41d4-a716-446655440000",
        icon: "invalid-url",
      },
    };
    expect(() => createSkillSchema.parse(data)).toThrow();
  });
});

describe("updateSkillSchema", () => {
  it("should pass with valid params and partial body", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: { name: "Updated Skill" },
    };
    expect(() => updateSkillSchema.parse(data)).not.toThrow();
  });

  it("should pass with empty body (partial update)", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: {},
    };
    expect(() => updateSkillSchema.parse(data)).not.toThrow();
  });

  it("should fail if params uid is not a valid UUID", () => {
    const data = { params: { uid: "not-a-uuid" }, body: {} };
    expect(() => updateSkillSchema.parse(data)).toThrow();
  });
});

describe("skillIdSchema", () => {
  it("should pass with a valid UUID", () => {
    const data = { params: { uid: "550e8400-e29b-41d4-a716-446655440000" } };
    expect(() => skillIdSchema.parse(data)).not.toThrow();
  });

  it("should fail with an invalid uid", () => {
    const data = { params: { uid: "not-a-uuid" } };
    expect(() => skillIdSchema.parse(data)).toThrow();
  });
});