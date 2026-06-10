import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindAll: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindById: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindByName: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCreate: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUpdate: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDelete: any = jest.fn();

jest.mock("./skill-category.repository", () => ({
  skillCategoryRepository: {
    findAll: mockFindAll,
    findById: mockFindById,
    findByName: mockFindByName,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

import { SkillCategoryService } from "./skill-category.service";

describe("SkillCategoryService", () => {
  beforeEach(() => {
    mockFindAll.mockReset();
    mockFindById.mockReset();
    mockFindByName.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  describe("findAll", () => {
    it("should return all categories", async () => {
      mockFindAll.mockResolvedValue([{ uid: "1", name: "Frontend" }]);
      const result = await SkillCategoryService.findAll();
      expect(result).toHaveLength(1);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });

    it("should return empty array if no categories exist", async () => {
      mockFindAll.mockResolvedValue([]);
      const result = await SkillCategoryService.findAll();
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return category if found", async () => {
      mockFindById.mockResolvedValue({ uid: "uid-1", name: "Frontend" });
      const result = await SkillCategoryService.getById("uid-1");
      expect(result).toEqual({ uid: "uid-1", name: "Frontend" } as any);
    });

    it("should throw AppError if not found", async () => {
      mockFindById.mockResolvedValue(null);
      await expect(SkillCategoryService.getById("uid-1")).rejects.toThrow(
        "Skill category not found"
      );
    });
  });

  describe("findByName", () => {
    it("should return category by name", async () => {
      mockFindByName.mockResolvedValue({ uid: "1", name: "Backend" });
      const result = await SkillCategoryService.findByName("Backend");
      expect(result).toEqual({ uid: "1", name: "Backend" } as any);
    });

    it("should return null if not found", async () => {
      mockFindByName.mockResolvedValue(null);
      const result = await SkillCategoryService.findByName("Unknown");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new category", async () => {
      mockFindByName.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ uid: "new-uid", name: "DevOps", icon: null });
      const result = await SkillCategoryService.create({ name: "DevOps" });
      expect(result).toEqual({ uid: "new-uid", name: "DevOps", icon: null } as any);
    });

    it("should throw 409 if category name already exists", async () => {
      mockFindByName.mockResolvedValue({ uid: "existing", name: "DevOps" });
      await expect(
        SkillCategoryService.create({ name: "DevOps" })
      ).rejects.toThrow('Category "DevOps" already exists');
    });
  });

  describe("update", () => {
    it("should update category if found", async () => {
      mockFindByName.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "Updated" });
      const result = await SkillCategoryService.update("uid-1", { name: "Updated" });
      expect(result).toEqual({ uid: "uid-1", name: "Updated" } as any);
    });

    it("should throw 409 if new name is already used by another category", async () => {
      mockFindByName.mockResolvedValue({ uid: "other-uid", name: "Taken" });
      await expect(
        SkillCategoryService.update("uid-1", { name: "Taken" })
      ).rejects.toThrow('Category "Taken" already exists');
    });

    it("should succeed if name is the same and belongs to the same uid", async () => {
      mockFindByName.mockResolvedValue({ uid: "uid-1", name: "MyName" });
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "MyName" });
      const result = await SkillCategoryService.update("uid-1", { name: "MyName" });
      expect(result).toEqual({ uid: "uid-1", name: "MyName" } as any);
    });

    it("should update category without name (no duplicate check needed)", async () => {
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "Original", icon: "🔥" });
      const result = await SkillCategoryService.update("uid-1", { icon: "🚀" });
      expect(result).toEqual({ uid: "uid-1", name: "Original", icon: "🔥" } as any);
      expect(mockFindByName).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith("uid-1", { icon: "🚀" });
    });

    it("should throw 404 if category not found", async () => {
      mockFindByName.mockResolvedValue(null);
      mockUpdate.mockResolvedValue(null);
      await expect(
        SkillCategoryService.update("uid-1", { name: "Nope" })
      ).rejects.toThrow("Skill category not found");
    });
  });

  describe("delete", () => {
    it("should delete category if found", async () => {
      mockDelete.mockResolvedValue(true);
      await SkillCategoryService.delete("uid-1");
      expect(mockDelete).toHaveBeenCalledWith("uid-1");
    });

    it("should throw 404 if category not found", async () => {
      mockDelete.mockResolvedValue(false);
      await expect(SkillCategoryService.delete("uid-1")).rejects.toThrow(
        "Skill category not found"
      );
    });

    it("should throw 409 if category is still used by skills (FK violation)", async () => {
      const fkError = new Error("FK violation") as any;
      fkError.code = "23503";
      mockDelete.mockRejectedValue(fkError);
      await expect(SkillCategoryService.delete("uid-1")).rejects.toThrow(
        "Cannot delete category that is still used by one or more skills"
      );
    });
  });
});