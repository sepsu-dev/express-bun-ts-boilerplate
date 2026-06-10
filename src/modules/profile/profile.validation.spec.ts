import { describe, it, expect } from "@jest/globals";
import { updateProfileSchema, changePasswordSchema } from "./profile.validation";

describe("updateProfileSchema", () => {
  it("should successfully validate valid update", () => {
    const data = { body: { name: "New Name", title: "Dev" } };
    expect(() => updateProfileSchema.parse(data)).not.toThrow();
  });

  it("should succeed with empty body (partial update)", () => {
    const data = { body: {} };
    expect(() => updateProfileSchema.parse(data)).not.toThrow();
  });

  it("should succeed with valid image_url", () => {
    const data = { body: { image_url: "https://example.com/img.png" } };
    expect(() => updateProfileSchema.parse(data)).not.toThrow();
  });

  it("should succeed with empty image_url", () => {
    const data = { body: { image_url: "" } };
    expect(() => updateProfileSchema.parse(data)).not.toThrow();
  });

  it("should fail if image_url is invalid", () => {
    const data = { body: { image_url: "invalid-url" } };
    expect(() => updateProfileSchema.parse(data)).toThrow();
  });
});

describe("changePasswordSchema", () => {
  it("should successfully validate valid password change", () => {
    const data = { body: { oldPassword: "old", newPassword: "newpass123", confirmPassword: "newpass123" } };
    expect(() => changePasswordSchema.parse(data)).not.toThrow();
  });

  it("should fail if new password is too short", () => {
    const data = { body: { oldPassword: "old", newPassword: "short", confirmPassword: "short" } };
    expect(() => changePasswordSchema.parse(data)).toThrow();
  });

  it("should fail if confirmPassword does not match", () => {
    const data = { body: { oldPassword: "old", newPassword: "newpass123", confirmPassword: "different" } };
    expect(() => changePasswordSchema.parse(data)).toThrow();
  });

  it("should fail if oldPassword is empty", () => {
    const data = { body: { oldPassword: "", newPassword: "newpass123", confirmPassword: "newpass123" } };
    expect(() => changePasswordSchema.parse(data)).toThrow();
  });
});