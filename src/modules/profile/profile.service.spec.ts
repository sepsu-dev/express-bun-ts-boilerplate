import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGet: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetWithPassword: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindByEmail: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUpdate: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDelete: any = jest.fn();

jest.mock("./profile.repository", () => ({
  profileRepository: {
    get: mockGet,
    getWithPassword: mockGetWithPassword,
    findByEmail: mockFindByEmail,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

import { ProfileService } from "./profile.service";

describe("ProfileService", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGetWithPassword.mockReset();
    mockFindByEmail.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  describe("getProfile", () => {
    it("should call repository.get", async () => {
      mockGet.mockResolvedValue({ uid: "a", name: "Test" });
      const result = await ProfileService.getProfile();
      expect(result).toEqual({ uid: "a", name: "Test" } as any);
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("should return null if no profile exists", async () => {
      mockGet.mockResolvedValue(null);
      const result = await ProfileService.getProfile();
      expect(result).toBeNull();
    });
  });

  describe("getProfileWithPassword", () => {
    it("should call repository.getWithPassword", async () => {
      mockGetWithPassword.mockResolvedValue({ uid: "a", password: "hash" });
      const result = await ProfileService.getProfileWithPassword();
      expect(result).toEqual({ uid: "a", password: "hash" } as any);
    });
  });

  describe("findByEmail", () => {
    it("should call repository.findByEmail", async () => {
      mockFindByEmail.mockResolvedValue({ uid: "a", email: "t@t.com" });
      const result = await ProfileService.findByEmail("t@t.com");
      expect(result).toEqual({ uid: "a", email: "t@t.com" } as any);
    });
  });

  describe("update", () => {
    it("should call repository.update with data", async () => {
      mockUpdate.mockResolvedValue({ uid: "a", name: "Updated" });
      const result = await ProfileService.update({ name: "Updated" });
      expect(result).toEqual({ uid: "a", name: "Updated" } as any);
    });
  });

  describe("delete", () => {
    it("should call repository.delete", async () => {
      mockDelete.mockResolvedValue(true);
      const result = await ProfileService.delete("uid-1");
      expect(result).toBe(true);
    });
  });
});