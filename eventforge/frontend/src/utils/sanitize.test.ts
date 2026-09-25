import { describe, it, expect } from "vitest";
import { escapeHtml, validateHttpsUrl, sanitizeText } from "@/utils/sanitize";

describe("escapeHtml", () => {
  it("escapes angle brackets and quotes", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
  it("escapes ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });
  it("leaves plain text untouched", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });
});

describe("validateHttpsUrl", () => {
  it("accepts https urls", () => {
    expect(validateHttpsUrl("https://example.com")).toBe(true);
  });
  it("rejects http urls", () => {
    expect(validateHttpsUrl("http://example.com")).toBe(false);
  });
  it("rejects garbage", () => {
    expect(validateHttpsUrl("not a url")).toBe(false);
  });
  it("rejects javascript: urls", () => {
    expect(validateHttpsUrl("javascript:alert(1)")).toBe(false);
  });
});

describe("sanitizeText", () => {
  it("strips html tags", () => {
    expect(sanitizeText("<b>bold</b> text")).toBe("bold text");
  });
});