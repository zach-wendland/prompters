/**
 * TEST SUITE: Prompt Refinement API Route
 * Purpose: Test all edge cases, error handling, and core functionality
 * of the /api/refine endpoint
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

describe("POST /api/refine - Prompt Refinement API", () => {
  beforeEach(() => {
    mockCreate.mockClear();
  });

  describe("Authentication & Authorization", () => {
    it("should return 401 when API key is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        body: JSON.stringify({ prompt: "test prompt" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Missing OpenAI API key");
    });

    it("should return 401 for invalid API key format", async () => {
      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: {
          "x-openai-key": "invalid-key-format",
        },
        body: JSON.stringify({ prompt: "test prompt" }),
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
                refined_prompt: "test",
                rationale: "test",
                follow_up_questions: [],
              }),
            },
          },
        ],
      });

      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: {
          "x-openai-key": "sk-test-key",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "test prompt" }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when prompt is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Prompt is required");
    });

    it("should return 400 when prompt is empty string", async () => {
      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ prompt: "   " }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Prompt is required");
    });

    it("should return 400 for invalid request body", async () => {
      const request = new NextRequest("http://localhost:3000/api/refine", {
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
                refined_prompt: "test",
                rationale: "test",
                follow_up_questions: [],
              }),
            },
          },
        ],
      });

      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({
          prompt: "Create a user authentication system",
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
          temperature: 0.4,
        })
      );
    });

    it("should handle OpenAI API errors gracefully", async () => {
      mockCreate.mockRejectedValue(new Error("OpenAI API error"));

      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ prompt: "test" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("OpenAI API error");
    });

    it("should return 502 when OpenAI returns empty response", async () => {
      mockCreate.mockResolvedValue({
        choices: [],
      });

      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ prompt: "test" }),
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
        refined_prompt: "Create a secure JWT-based authentication system",
        rationale: "Enhanced clarity and specificity",
        follow_up_questions: [
          "Which database should be used?",
          "Should it support OAuth?",
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

      const request = new NextRequest("http://localhost:3000/api/refine", {
        method: "POST",
        headers: { "x-openai-key": "sk-test-key" },
        body: JSON.stringify({ prompt: "auth system" }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
    });
  });
});
