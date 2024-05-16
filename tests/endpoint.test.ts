import { createEndpoint } from "../src/endpoint"
import { describe, it, expect } from "vitest"

describe("endpoint", () => {
  it.each([
    ["123", null, "https://123.r2.cloudflarestorage.com/bucket"],
    ["123", "fedramp" as const, "https://123.fedramp.r2.cloudflarestorage.com/bucket"],
    ["456", "eu" as const, "https://456.eu.r2.cloudflarestorage.com/another"],
  ])("should return correct endpoint for %s, %s, %s", async (accountId, jurisdiction, expected) => {
    const enpoint = createEndpoint(accountId, jurisdiction)
    expect(enpoint).toBe(expected)
  })
})
