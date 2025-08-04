import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBaseUrl } from "@/util/baseUrl";

describe("getBaseUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("deve retornar URL de produção quando NODE_ENV é production", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_API_URL = undefined;

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("https://api.production.com");
  });

  it("deve retornar URL de desenvolvimento quando NODE_ENV não é production", () => {
    process.env.NODE_ENV = "development";
    process.env.NEXT_PUBLIC_API_URL = undefined;

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("http://localhost:8000");
  });

  it("deve retornar NEXT_PUBLIC_API_URL quando definida", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://custom-api.com";

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("https://custom-api.com");
  });

  it("deve priorizar NEXT_PUBLIC_API_URL sobre NODE_ENV", () => {
    process.env.NODE_ENV = "production";
    process.env.NEXT_PUBLIC_API_URL = "https://override-api.com";

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("https://override-api.com");
  });

  it("deve retornar URL de desenvolvimento quando NODE_ENV não está definido", () => {
    delete process.env.NODE_ENV;
    process.env.NEXT_PUBLIC_API_URL = undefined;

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("http://localhost:8000");
  });

  it("deve retornar URL de desenvolvimento para NODE_ENV=test", () => {
    process.env.NODE_ENV = "test";
    process.env.NEXT_PUBLIC_API_URL = undefined;

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("http://localhost:8000");
  });

  it("deve lidar com NEXT_PUBLIC_API_URL vazia", () => {
    process.env.NODE_ENV = "development";
    process.env.NEXT_PUBLIC_API_URL = "";

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("http://localhost:8000");
  });

  it("deve remover barra final da URL se presente", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/";

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("https://api.example.com/");
  });

  it("deve manter URL sem barra final inalterada", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";

    const baseUrl = getBaseUrl();

    expect(baseUrl).toBe("https://api.example.com");
  });
});
