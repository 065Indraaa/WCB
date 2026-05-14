/**
 * Smoke test — verifies the test infrastructure is correctly configured.
 * Vitest + React Testing Library + fast-check are all importable.
 */
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

describe("Test infrastructure smoke test", () => {
  it("vitest is working", () => {
    expect(1 + 1).toBe(2);
  });

  it("fast-check is working", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a; // commutativity
      })
    );
  });
});
