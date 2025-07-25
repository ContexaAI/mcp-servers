import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ToolSet } from "../constants/index.js";

// Mock only createStatelessServer - the main external dependency
vi.mock("@smithery/sdk/server/stateless.js", () => ({
  createStatelessServer: vi.fn(() => ({
    app: {
      listen: vi.fn((port: number, callback?: () => void) => {
        if (callback) callback();
        return { close: vi.fn() };
      }),
      get: vi.fn(),
    },
  })),
}));

// Mock the tools registration functions to test tool set filtering
vi.mock("../tools/index.js", () => ({
  registerAllTools: vi.fn(),
  registerToolsBySet: vi.fn(),
}));

// Import after mocking
import { startServer } from "./server.js";
import { createStatelessServer } from "@smithery/sdk/server/stateless.js";
import { registerAllTools, registerToolsBySet } from "../tools/index.js";

describe("Server Configuration and Startup", () => {
  let mockApp: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});

    // Get the mock app from createStatelessServer
    mockApp = {
      listen: vi.fn((port: number, callback?: () => void) => {
        if (callback) callback();
        return { close: vi.fn() };
      }),
      get: vi.fn(),
    };

    vi.mocked(createStatelessServer).mockReturnValue({ app: mockApp });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Server startup without API key", () => {
    it("should start server successfully without API key", () => {
      const config = { port: 3000 };

      const server = startServer(config);

      expect(server).toBeDefined();
      expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    });

    it("should create stateless server with MCP server factory", () => {
      const config = { port: 3000 };

      startServer(config);

      expect(createStatelessServer).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should log startup messages", () => {
      const config = { port: 3000 };

      startServer(config);

      expect(console.log).toHaveBeenCalledWith(
        "Financial Modeling Prep MCP server started on port 3000"
      );
    });

    it("should register health endpoint", () => {
      const config = { port: 3000 };

      startServer(config);

      expect(mockApp.get).toHaveBeenCalledWith(
        "/healthcheck",
        expect.any(Function)
      );
    });
  });

  describe("API key configuration scenarios", () => {
    it("should handle createMcpServer function with no config (undefined token)", () => {
      const config = { port: 3000 };

      startServer(config);

      // Get the createMcpServer function passed to createStatelessServer
      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];

      // Should not throw when called without config
      expect(() => createMcpServerFn({ config: undefined })).not.toThrow();
    });

    it("should handle createMcpServer function with empty config (undefined token)", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];

      // Should not throw when called with empty config
      expect(() => createMcpServerFn({ config: {} })).not.toThrow();
    });

    it("should handle createMcpServer function with FMP_ACCESS_TOKEN from Smithery", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];

      // Should not throw when called with Smithery-provided token
      expect(() =>
        createMcpServerFn({
          config: { FMP_ACCESS_TOKEN: "smithery-token-123" },
        })
      ).not.toThrow();
    });

    it("should handle createMcpServer function with FMP_ACCESS_TOKEN from environment", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];

      // Should not throw when called with environment-provided token
      expect(() =>
        createMcpServerFn({
          config: { FMP_ACCESS_TOKEN: "env-token-456" },
        })
      ).not.toThrow();
    });
  });

  describe("Tool Set Filtering", () => {
    it("should register all tools when no tool sets are specified", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({ config: { FMP_ACCESS_TOKEN: "test-token" } });

      expect(registerAllTools).toHaveBeenCalled();
      expect(registerToolsBySet).not.toHaveBeenCalled();
    });

    it("should register specific tool sets when provided via server config", () => {
      const config = {
        port: 3000,
        toolSets: ["search", "company"] as ToolSet[],
      };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: { FMP_ACCESS_TOKEN: "test-token" },
      });

      expect(registerToolsBySet).toHaveBeenCalledWith(
        expect.any(Object),
        ["search", "company"],
        "test-token"
      );
      expect(registerAllTools).not.toHaveBeenCalled();
    });

    it("should parse tool sets from Smithery config when provided", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: {
          FMP_ACCESS_TOKEN: "test-token",
          FMP_TOOL_SETS: "search,company,quotes",
        },
      });

      expect(registerToolsBySet).toHaveBeenCalledWith(
        expect.any(Object),
        ["search", "company", "quotes"],
        "test-token"
      );
      expect(registerAllTools).not.toHaveBeenCalled();
    });

    it("should prioritize server config tool sets over Smithery config", () => {
      const config = { port: 3000, toolSets: ["crypto", "forex"] as ToolSet[] };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: {
          FMP_ACCESS_TOKEN: "test-token",
          FMP_TOOL_SETS: "search,company", // This should be ignored
        },
      });

      expect(registerToolsBySet).toHaveBeenCalledWith(
        expect.any(Object),
        ["crypto", "forex"],
        "test-token"
      );
      expect(registerAllTools).not.toHaveBeenCalled();
    });

    it("should handle empty tool sets gracefully", () => {
      const config = { port: 3000, toolSets: [] };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: { FMP_ACCESS_TOKEN: "test-token" },
      });

      expect(registerAllTools).toHaveBeenCalled();
      expect(registerToolsBySet).not.toHaveBeenCalled();
    });

    it("should handle whitespace in Smithery tool sets config", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: {
          FMP_ACCESS_TOKEN: "test-token",
          FMP_TOOL_SETS: " search , company , quotes ", // With extra spaces
        },
      });

      expect(registerToolsBySet).toHaveBeenCalledWith(
        expect.any(Object),
        ["search", "company", "quotes"], // Should be trimmed
        "test-token"
      );
    });

    it("should handle single tool set in Smithery config", () => {
      const config = { port: 3000 };

      startServer(config);

      const createMcpServerFn = vi.mocked(createStatelessServer).mock
        .calls[0][0];
      createMcpServerFn({
        config: {
          FMP_ACCESS_TOKEN: "test-token",
          FMP_TOOL_SETS: "search",
        },
      });

      expect(registerToolsBySet).toHaveBeenCalledWith(
        expect.any(Object),
        ["search"],
        "test-token"
      );
    });
  });

  describe("Docker integration", () => {
    it("should work with Docker compose environment variables", () => {
      // Simulate Docker environment variables as set by docker-compose.yml
      const originalEnv = { ...process.env };

      // Set Docker-style environment variables
      process.env.NODE_ENV = "production";
      process.env.PORT = "8000";
      process.env.FMP_ACCESS_TOKEN = "docker-token-from-compose";

      try {
        const config = { port: 8000 };

        const server = startServer(config);

        expect(server).toBeDefined();
        expect(mockApp.listen).toHaveBeenCalledWith(8000, expect.any(Function));

        // Verify that the createMcpServer function can handle the Docker environment
        const createMcpServerFn = vi.mocked(createStatelessServer).mock
          .calls[0][0];

        // Simulate Smithery SDK reading from environment when Docker provides the token
        expect(() =>
          createMcpServerFn({
            config: { FMP_ACCESS_TOKEN: process.env.FMP_ACCESS_TOKEN },
          })
        ).not.toThrow();
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    });

    it("should handle Docker environment with tool sets from environment variable", () => {
      const originalEnv = { ...process.env };

      // Simulate Docker environment with tool sets
      process.env.NODE_ENV = "production";
      process.env.PORT = "8000";
      process.env.FMP_ACCESS_TOKEN = "docker-token-from-compose";
      process.env.FMP_TOOL_SETS = "search,company,quotes";

      try {
        const config = { port: 8000 };

        const server = startServer(config);

        expect(server).toBeDefined();
        expect(mockApp.listen).toHaveBeenCalledWith(8000, expect.any(Function));

        // Verify the MCP server can be created with Docker-provided tool sets
        const createMcpServerFn = vi.mocked(createStatelessServer).mock
          .calls[0][0];

        // This simulates Smithery SDK reading the environment variables
        const mcpServer = createMcpServerFn({
          config: {
            FMP_ACCESS_TOKEN: process.env.FMP_ACCESS_TOKEN,
            FMP_TOOL_SETS: process.env.FMP_TOOL_SETS,
          },
        });

        expect(mcpServer).toBeDefined();

        // Verify the correct tool sets are registered
        expect(registerToolsBySet).toHaveBeenCalledWith(
          expect.any(Object),
          ["search", "company", "quotes"],
          "docker-token-from-compose"
        );
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    });

    it("should handle Docker environment without FMP_ACCESS_TOKEN (tool discovery mode)", () => {
      const originalEnv = { ...process.env };

      // Simulate Docker environment without API token (for tool discovery)
      process.env.NODE_ENV = "production";
      process.env.PORT = "8000";
      delete process.env.FMP_ACCESS_TOKEN;

      try {
        const config = { port: 8000 };

        const server = startServer(config);

        expect(server).toBeDefined();
        expect(mockApp.listen).toHaveBeenCalledWith(8000, expect.any(Function));

        // Verify server starts in discovery mode
        const createMcpServerFn = vi.mocked(createStatelessServer).mock
          .calls[0][0];
        expect(() => createMcpServerFn({ config: {} })).not.toThrow();
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    });

    it("should handle Docker port configuration from environment", () => {
      const originalEnv = { ...process.env };

      // Test that PORT environment variable is respected
      process.env.PORT = "9000";

      try {
        // When Docker sets PORT=9000, our index.ts should parse it
        const parsedPort = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        const config = { port: parsedPort };

        const server = startServer(config);

        expect(server).toBeDefined();
        expect(mockApp.listen).toHaveBeenCalledWith(9000, expect.any(Function));
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    });

    it("should replicate exact docker-compose.yml scenario from user issue", () => {
      const originalEnv = { ...process.env };

      // Replicate the exact environment from the user's docker-compose.yml:
      // environment:
      //   - NODE_ENV=production
      //   - PORT=8000
      //   - FMP_ACCESS_TOKEN=${FMP_ACCESS_TOKEN}
      //   - FMP_TOOL_SETS=${FMP_TOOL_SETS}
      process.env.NODE_ENV = "production";
      process.env.PORT = "8000";
      process.env.FMP_ACCESS_TOKEN = "user-provided-token-from-env-file";
      process.env.FMP_TOOL_SETS = "search,company,quotes";

      try {
        // This simulates what our index.ts does
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        const config = { port };

        const server = startServer(config);

        // Verify Docker setup works
        expect(server).toBeDefined();
        expect(mockApp.listen).toHaveBeenCalledWith(8000, expect.any(Function));

        // Verify the MCP server can be created with the Docker-provided token and tool sets
        const createMcpServerFn = vi.mocked(createStatelessServer).mock
          .calls[0][0];

        // This simulates Smithery SDK reading the environment variables
        const mcpServer = createMcpServerFn({
          config: {
            FMP_ACCESS_TOKEN: process.env.FMP_ACCESS_TOKEN,
            FMP_TOOL_SETS: process.env.FMP_TOOL_SETS,
          },
        });

        expect(mcpServer).toBeDefined();

        // Verify the token is available for tools (this was the original issue)
        expect(process.env.FMP_ACCESS_TOKEN).toBe(
          "user-provided-token-from-env-file"
        );
        expect(process.env.FMP_TOOL_SETS).toBe("search,company,quotes");

        // Verify the correct tool sets are registered
        expect(registerToolsBySet).toHaveBeenCalledWith(
          expect.any(Object),
          ["search", "company", "quotes"],
          "user-provided-token-from-env-file"
        );
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    });
  });

  describe("Health endpoint", () => {
    it("should return health status", () => {
      const config = { port: 3000 };
      const mockReq = {} as any;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as any;

      startServer(config);

      // Get the health endpoint handler
      const healthHandler = mockApp.get.mock.calls.find(
        (call: any) => call[0] === "/healthcheck"
      )?.[1];

      expect(healthHandler).toBeDefined();

      // Call the handler
      healthHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: "ok",
        timestamp: expect.any(String),
        version: expect.any(String),
        message: "Financial Modeling Prep MCP server is running",
        toolSets: "all",
      });
    });
  });
});
