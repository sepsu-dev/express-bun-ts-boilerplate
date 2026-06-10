import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindByEmail: any = jest.fn();

jest.mock("../profile/profile.repository", () => ({
  profileRepository: {
    get: jest.fn(),
    getWithPassword: jest.fn(),
    findByEmail: mockFindByEmail,
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/config", () => ({
  APP_CONFIG: { jwtSecret: "test-secret" },
}));

import { AuthService } from "./auth.service";

describe("AuthService", () => {
  beforeEach(() => {
    mockFindByEmail.mockReset();
  });

  it("login: should fail if profile not found", async () => {
    mockFindByEmail.mockResolvedValue(null);
    await expect(AuthService.login("test@test.com", "password")).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("login: should fail if password does not match", async () => {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("correct", 10);
    mockFindByEmail.mockResolvedValue({
      uid: "uuid-1",
      email: "test@test.com",
      password: hashedPassword,
      name: "Test User",
    });
    await expect(AuthService.login("test@test.com", "wrong")).rejects.toThrow(
      "Invalid email or password"
    );
  });

  it("login: should succeed if password matches", async () => {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash("password", 10);
    mockFindByEmail.mockResolvedValue({
      uid: "uuid-1",
      email: "test@test.com",
      password: hashedPassword,
      name: "Test User",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await AuthService.login("test@test.com", "password")) as any;
    expect(typeof result.token).toBe("string");
    expect(result.token.length).toBeGreaterThan(0);
  });
});