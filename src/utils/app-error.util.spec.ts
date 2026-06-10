import { describe, it, expect } from "@jest/globals";
import { AppError } from "./app-error.util";

describe("AppError", () => {
  it("should create an AppError with default status 500", () => {
    const error = new AppError("Something went wrong");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("AppError");
    expect(error.message).toBe("Something went wrong");
    expect(error.status).toBe(500);
  });

  it("should create an AppError with a custom status code", () => {
    const error = new AppError("Not found", 404);
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe("AppError");
    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
  });

  it("should be catchable as a standard Error", () => {
    try {
      throw new AppError("Test error", 400);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(AppError);
      expect((e as AppError).status).toBe(400);
    }
  });
});