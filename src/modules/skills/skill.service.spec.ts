import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindAllGrouped: any = jest.fn();
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

jest.mock("./skill.repository", () => ({
  skillRepository: {
    findAllGrouped: mockFindAllGrouped,
    findById: mockFindById,
    findByName: mockFindByName,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

import { SkillService } from "./skill.service";

describe("SkillService", () => {
  beforeEach(() => {
    mockFindAllGrouped.mockReset();
    mockFindById.mockReset();
    mockFindByName.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
  });

  describe("findAllGrouped", () => {
    it("should return skills grouped by category", async () => {
      const grouped = {
        Frontend: [
          { uid: "s1", name: "React", category_uid: "c1" },
          { uid: "s2", name: "Vue", category_uid: "c1" },
        ],
        Backend: [
          { uid: "s3", name: "Node.js", category_uid: "c2" },
        ],
      };
      mockFindAllGrouped.mockResolvedValue(grouped);
      const result = await SkillService.findAllGrouped();
      expect(result).toEqual(grouped);
      expect(mockFindAllGrouped).toHaveBeenCalledTimes(1);
    });

    it("should return empty object if no skills exist", async () => {
      mockFindAllGrouped.mockResolvedValue({});
      const result = await SkillService.findAllGrouped();
      expect(result).toEqual({});
    });
  });

  describe("getById", () => {
    it("should return skill if found", async () => {
      mockFindById.mockResolvedValue({ uid: "uid-1", name: "React" });
      const result = await SkillService.getById("uid-1");
      expect(result).toEqual({ uid: "uid-1", name: "React" } as any);
    });

    it("should throw AppError if not found", async () => {
      mockFindById.mockResolvedValue(null);
      await expect(SkillService.getById("uid-1")).rejects.toThrow(
        "Skill not found"
      );
    });
  });

  describe("findByName", () => {
    it("should return skill by name", async () => {
      mockFindByName.mockResolvedValue({ uid: "1", name: "TypeScript" });
      const result = await SkillService.findByName("TypeScript");
      expect(result).toEqual({ uid: "1", name: "TypeScript" } as any);
    });

    it("should return null if not found", async () => {
      mockFindByName.mockResolvedValue(null);
      const result = await SkillService.findByName("Unknown");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new skill", async () => {
      mockFindByName.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        uid: "new-uid",
        name: "Go",
        category_uid: "cat-uid",
      });
      const result = await SkillService.create({
        name: "Go",
        category_uid: "cat-uid",
      });
      expect(result).toEqual({
        uid: "new-uid",
        name: "Go",
        category_uid: "cat-uid",
      } as any);
    });

    it("should throw 409 if skill name already exists", async () => {
      mockFindByName.mockResolvedValue({ uid: "existing", name: "Go" });
      await expect(
        SkillService.create({ name: "Go", category_uid: "cat-uid" })
      ).rejects.toThrow('Skill "Go" already exists');
    });
  });

  describe("update", () => {
    it("should update skill if found", async () => {
      mockFindByName.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "Updated Skill" });
      const result = await SkillService.update("uid-1", {
        name: "Updated Skill",
      });
      expect(result).toEqual({ uid: "uid-1", name: "Updated Skill" } as any);
    });

    it("should throw 409 if new name is already used by another skill", async () => {
      mockFindByName.mockResolvedValue({ uid: "other-uid", name: "Taken" });
      await expect(
        SkillService.update("uid-1", { name: "Taken" })
      ).rejects.toThrow('Skill "Taken" already exists');
    });

    it("should succeed if name is the same and belongs to the same uid", async () => {
      mockFindByName.mockResolvedValue({ uid: "uid-1", name: "MySkill" });
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "MySkill" });
      const result = await SkillService.update("uid-1", { name: "MySkill" });
      expect(result).toEqual({ uid: "uid-1", name: "MySkill" } as any);
    });

    it("should update skill without name (no duplicate check needed)", async () => {
      mockUpdate.mockResolvedValue({ uid: "uid-1", name: "Original", category_uid: "cat-1" });
      const result = await SkillService.update("uid-1", { category_uid: "cat-2" });
      expect(result).toEqual({ uid: "uid-1", name: "Original", category_uid: "cat-1" } as any);
      expect(mockFindByName).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith("uid-1", { category_uid: "cat-2" });
    });

    it("should throw 404 if skill not found", async () => {
      mockFindByName.mockResolvedValue(null);
      mockUpdate.mockResolvedValue(null);
      await expect(
        SkillService.update("uid-1", { name: "Nope" })
      ).rejects.toThrow("Skill not found");
    });
  });

  describe("delete", () => {
    it("should delete skill if found", async () => {
      mockDelete.mockResolvedValue(true);
      await SkillService.delete("uid-1");
      expect(mockDelete).toHaveBeenCalledWith("uid-1");
    });

    it("should throw 404 if skill not found", async () => {
      mockDelete.mockResolvedValue(false);
      await expect(SkillService.delete("uid-1")).rejects.toThrow(
        "Skill not found"
      );
    });

    it("should throw 409 if skill is still used by projects (FK violation)", async () => {
      const fkError = new Error("FK violation") as any;
      fkError.code = "23503";
      mockDelete.mockRejectedValue(fkError);
      await expect(SkillService.delete("uid-1")).rejects.toThrow(
        "Cannot delete skill that is still used by one or more projects"
      );
    });
  });
});