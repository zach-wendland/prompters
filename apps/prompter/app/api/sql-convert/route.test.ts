/**
 * TEST SUITE: SQL Conversion API Route
 * Purpose: Test all edge cases, error handling, and core functionality
 * of the /api/sql-convert endpoint
 */

import { NextRequest } from "next/server";
import { POST } from "./route";

// Create a mock function that we can control
const mockCreate = jest.fn();

// Mock the entire OpenAI module
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe("POST /api/sql-convert - SQL Dialect Conversion API", () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  describe("Authentication & Authorization", () => {
    it("should return 401 when API key is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Missing OpenAI API key");
    });

    it("should return 401 for invalid API key format", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: {
          "x-openai-key": "invalid-key",
        },
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid OpenAI API key format");
    });

    it("should accept valid API key from header", async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                translated_sql: "SELECT * FROM users",
                translation_notes: "No changes needed",
                verification_steps: [],
              }),
            },
          },
        ],
      });

      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: {
          "x-openai-key": "sk-test-key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when SQL is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("SQL statement is required");
    });

    it("should return 400 when SQL is empty string", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "   ", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("SQL statement is required");
    });

    it("should return 400 when target dialect is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "SELECT * FROM users" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Target dialect is required");
    });

    it("should return 400 when target dialect is empty", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "  " }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Target dialect is required");
    });

    it("should return 400 for invalid request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: "not json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid request body");
    });
  });

  describe("OpenAI Integration", () => {
    it("should call OpenAI with correct parameters", async () => {
      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                translated_sql: "test",
                translation_notes: "test",
                verification_steps: [],
              }),
            },
          },
        ],
      });

      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({
          sql: "SELECT TOP 10 * FROM users WHERE status = 1",
          sourceDialect: "SQL Server",
          targetDialect: "PostgreSQL",
        }),
      });

      await POST(request);

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4o-mini",
          messages: expect.arrayContaining([
            expect.objectContaining({ role: "system" }),
            expect.objectContaining({ role: "user" }),
          ]),
          temperature: 0.2,
        })
      );
    });

    it("should handle OpenAI API errors gracefully", async () => {
      mockCreate.mockRejectedValue(new Error("OpenAI rate limit exceeded"));

      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("OpenAI rate limit exceeded");
    });

    it("should return 502 when OpenAI returns empty response", async () => {
      mockCreate.mockResolvedValue({
        choices: [],
      });

      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "SELECT * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.error).toBe("No response returned from OpenAI");
    });
  });

  describe("Response Parsing", () => {
    it("should parse valid JSON response correctly", async () => {
      const mockResponse = {
        translated_sql: "SELECT * FROM users LIMIT 10",
        translation_notes: "Converted TOP to LIMIT",
        verification_steps: [
          "Test with sample data",
          "Verify performance",
        ],
      };

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      });

      const request = new NextRequest("http://localhost:3000/api/sql-convert", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ sql: "SELECT TOP 10 * FROM users", targetDialect: "PostgreSQL" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });
  });
});
