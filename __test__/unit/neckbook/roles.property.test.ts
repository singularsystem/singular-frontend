import fc from "fast-check";
import {
  ADMIN_ROLE,
  isAdmin,
} from "@/source/infrastructure/common/config/roles";

describe("Property 8: Derivação da permissão administrativa", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 8: Derivação da permissão administrativa
  it("isAdmin(roles) é verdadeiro se e somente se roles contém ADMIN_ROLE", () => {
    const nonAdminRoleArb = fc
      .string()
      .filter((r) => r.toUpperCase() !== ADMIN_ROLE);

    // Sem ADMIN_ROLE -> sempre false
    fc.assert(
      fc.property(fc.array(nonAdminRoleArb), (roles) => {
        expect(isAdmin(roles)).toBe(false);
      }),
      { numRuns: 100 },
    );

    // Com pelo menos um ADMIN_ROLE (incluindo duplicatas e outros papéis) -> sempre true
    fc.assert(
      fc.property(
        fc.array(nonAdminRoleArb),
        fc.array(nonAdminRoleArb),
        fc.integer({ min: 1, max: 5 }),
        (prefix, suffix, adminCount) => {
          const admins = Array.from({ length: adminCount }, () => ADMIN_ROLE);
          const roles = [...prefix, ...admins, ...suffix];
          expect(isAdmin(roles)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );

    // Arbitrário geral: isAdmin(roles) === roles.some(r => r.toUpperCase() === ADMIN_ROLE)
    fc.assert(
      fc.property(
        fc.array(fc.oneof(nonAdminRoleArb, fc.constant(ADMIN_ROLE))),
        (roles) => {
          expect(isAdmin(roles)).toBe(roles.includes(ADMIN_ROLE));
        },
      ),
      { numRuns: 100 },
    );
  });
});
