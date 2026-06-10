import { describe, it, expect } from "@jest/globals";
import {
  createSkillCategorySchema,
  updateSkillCategorySchema,
  skillCategoryIdSchema,
} from "./skill-category.validation";

describe("createSkillCategorySchema", () => {
  it("should pass with valid name", () => {
    const data = { body: { name: "Frontend" } };
    expect(() => createSkillCategorySchema.parse(data)).not.toThrow();
  });

  it("should pass with valid name and icon URL", () => {
    const data = {
      body: { name: "Frontend", icon: "https://cdn.example.com/icons/frontend.svg" },
    };
    expect(() => createSkillCategorySchema.parse(data)).not.toThrow();
  });

  it("should pass with empty string icon", () => {
    const data = { body: { name: "Frontend", icon: "" } };
    expect(() => createSkillCategorySchema.parse(data)).not.toThrow();
  });

  it("should fail if name is less than 2 characters", () => {
    const data = { body: { name: "F" } };
    expect(() => createSkillCategorySchema.parse(data)).toThrow();
  });

  it("should fail if icon is an invalid URL", () => {
    const data = { body: { name: "Frontend", icon: "not-a-url" } };
    expect(() => createSkillCategorySchema.parse(data)).toThrow();
  });
});

describe("updateSkillCategorySchema", () => {
  it("should pass with valid params and body", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: { name: "Updated Name" },
    };
    expect(() => updateSkillCategorySchema.parse(data)).not.toThrow();
  });

  it("should pass with empty body (partial update)", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: {},
    };
    expect(() => updateSkillCategorySchema.parse(data)).not.toThrow();
  });

  it("should fail if params uid is not a valid UUID", () => {
    const data = { params: { uid: "not-a-uuid" }, body: {} };
    expect(() => updateSkillCategorySchema.parse(data)).toThrow();
  });

  it("should fail if name is less than 2 characters", () => {
    const data = {
      params: { uid: "550e8400-e29b-41d4-a716-446655440000" },
      body: { name: "X" },
    };
    expect(() => updateSkillCategorySchema.parse(data)).toThrow();
  });
});

describe("skillCategoryIdSchema", () => {
  it("should pass with a valid UUID", () => {
    const data = { params: { uid: "550e8400-e29b-41d4-a716-446655440000" } };
    expect(() => skillCategoryIdSchema.parse(data)).not.toThrow();
  });

  it("should fail with an invalid uid", () => {
    const data = { params: { uid: "not-a-uuid" } };
    expect(() => skillCategoryIdSchema.parse(data)).toThrow();
  });
});