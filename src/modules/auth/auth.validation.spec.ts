import { describe, it, expect } from "@jest/globals";
import { loginSchema } from "./auth.validation";

describe("loginSchema", () => {
  it("should successfully validate valid login", () => {
    const data = { body: { email: "admin@test.com", password: "password" } };
    expect(() => loginSchema.parse(data)).not.toThrow();
  });

  it("should fail if email is empty", () => {
    const data = { body: { email: "", password: "password" } };
    expect(() => loginSchema.parse(data)).toThrow();
  });

  it("should fail if email is invalid", () => {
    const data = { body: { email: "notanemail", password: "password" } };
    expect(() => loginSchema.parse(data)).toThrow();
  });

  it("should fail if password is empty", () => {
    const data = { body: { email: "admin@test.com", password: "" } };
    expect(() => loginSchema.parse(data)).toThrow();
  });
});