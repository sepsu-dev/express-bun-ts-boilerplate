import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindAll: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindById: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFindByTitle: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCreate: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUpdate: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDelete: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAddSkill: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRemoveSkill: any = jest.fn();

jest.mock("./project.repository", () => ({
  projectRepository: {
    findAll: mockFindAll,
    findById: mockFindById,
    findByTitle: mockFindByTitle,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    addSkill: mockAddSkill,
    removeSkill: mockRemoveSkill,
  },
}));

import { ProjectService } from "./project.service";

describe("ProjectService", () => {
  beforeEach(() => {
    mockFindAll.mockReset();
    mockFindById.mockReset();
    mockFindByTitle.mockReset();
    mockCreate.mockReset();
    mockUpdate.mockReset();
    mockDelete.mockReset();
    mockAddSkill.mockReset();
    mockRemoveSkill.mockReset();
  });

  describe("getPaginated", () => {
    it("should return data + total", async () => {
      mockFindAll.mockResolvedValue({ data: [{ uid: "1", title: "P1" }], total: 1 });
      const result = await ProjectService.getPaginated(1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe("getById", () => {
    it("should return project if found", async () => {
      mockFindById.mockResolvedValue({ uid: "1", title: "P1" });
      const result = await ProjectService.getById("1");
      expect(result).toEqual({ uid: "1", title: "P1" } as any);
    });

    it("should throw AppError if not found", async () => {
      mockFindById.mockResolvedValue(null);
      await expect(ProjectService.getById("1")).rejects.toThrow("Project not found");
    });
  });

  describe("findByTitle", () => {
    it("should return project when found by title", async () => {
      mockFindByTitle.mockResolvedValue({ uid: "1", title: "P1" });
      const result = await ProjectService.findByTitle("P1");
      expect(result).toEqual({ uid: "1", title: "P1" } as any);
      expect(mockFindByTitle).toHaveBeenCalledWith("P1");
    });

    it("should return null when title not found", async () => {
      mockFindByTitle.mockResolvedValue(null);
      const result = await ProjectService.findByTitle("Nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create new project if title does not exist", async () => {
      mockFindByTitle.mockResolvedValue(null);
      mockCreate.mockResolvedValue({ uid: "1", title: "New Project" });
      const result = await ProjectService.create({ title: "New Project" });
      expect(result).toEqual({ uid: "1", title: "New Project" } as any);
    });

    it("should create project without title (no duplicate check needed)", async () => {
      mockCreate.mockResolvedValue({ uid: "1", title: "Untitled" });
      const result = await ProjectService.create({ overview: "Just an overview" });
      expect(result).toEqual({ uid: "1", title: "Untitled" } as any);
      expect(mockFindByTitle).not.toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith({ overview: "Just an overview" });
    });

    it("should throw 409 if title already exists", async () => {
      mockFindByTitle.mockResolvedValue({ uid: "2", title: "Existing" });
      await expect(ProjectService.create({ title: "Existing" })).rejects.toThrow(
        'Project "Existing" already exists'
      );
    });
  });

  describe("update", () => {
    it("should update project if found", async () => {
      mockFindByTitle.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({ uid: "1", title: "Updated" });
      const result = await ProjectService.update("1", { title: "Updated" });
      expect(result).toEqual({ uid: "1", title: "Updated" } as any);
    });

    it("should throw 409 if title is already used by another project", async () => {
      mockFindByTitle.mockResolvedValue({ uid: "other", title: "Taken" });
      await expect(ProjectService.update("1", { title: "Taken" })).rejects.toThrow(
        'Project "Taken" already exists'
      );
    });

    it("should succeed if title is the same but uid matches (self update)", async () => {
      mockFindByTitle.mockResolvedValue({ uid: "1", title: "My Title" });
      mockUpdate.mockResolvedValue({ uid: "1", title: "My Title" });
      const result = await ProjectService.update("1", { title: "My Title" });
      expect(result).toEqual({ uid: "1", title: "My Title" } as any);
    });

    it("should update project without title (no duplicate check)", async () => {
      mockUpdate.mockResolvedValue({ uid: "1", title: "Original" });
      const result = await ProjectService.update("1", { overview: "New overview" });
      expect(result).toEqual({ uid: "1", title: "Original" } as any);
      expect(mockFindByTitle).not.toHaveBeenCalled();
      expect(mockUpdate).toHaveBeenCalledWith("1", { overview: "New overview" });
    });

    it("should throw 404 if project not found", async () => {
      mockFindByTitle.mockResolvedValue(null);
      mockUpdate.mockResolvedValue(null);
      await expect(ProjectService.update("1", { title: "Nope" })).rejects.toThrow(
        "Project not found"
      );
    });
  });

  describe("delete", () => {
    it("should delete project if found", async () => {
      mockDelete.mockResolvedValue(true);
      await ProjectService.delete("1");
      expect(mockDelete).toHaveBeenCalledWith("1");
    });

    it("should throw 404 if not found", async () => {
      mockDelete.mockResolvedValue(false);
      await expect(ProjectService.delete("1")).rejects.toThrow("Project not found");
    });
  });

  describe("addSkill", () => {
    it("should add skill to project", async () => {
      mockAddSkill.mockResolvedValue({});
      await ProjectService.addSkill("p-uid", "s-uid");
      expect(mockAddSkill).toHaveBeenCalledWith("p-uid", "s-uid");
    });
  });

  describe("removeSkill", () => {
    it("should remove skill from project", async () => {
      mockRemoveSkill.mockResolvedValue({});
      await ProjectService.removeSkill("p-uid", "s-uid");
      expect(mockRemoveSkill).toHaveBeenCalledWith("p-uid", "s-uid");
    });
  });
});