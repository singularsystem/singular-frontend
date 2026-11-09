import fc from "fast-check";
import {
  QUOTA_RENEWS_AT_UNAVAILABLE,
  formatQuotaRenewsAtUtc,
} from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";

describe("Property 7: Formatação da data de renovação em UTC (AAAA-MM-DD)", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 7: Formatação da data de renovação em UTC (AAAA-MM-DD)
  it("formata qualquer timestamp ISO 8601 válido como AAAA-MM-DD usando os componentes UTC sem recálculo local", () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date(Date.UTC(1970, 0, 1, 0, 0, 0)),
          max: new Date(Date.UTC(2100, 11, 31, 23, 59, 59)),
        }),
        fc.integer({ min: -720, max: 720 }),
        (utcDate, offsetMinutes) => {
          if (Number.isNaN(utcDate.getTime())) {
            return;
          }
          const isoZ = utcDate.toISOString();
          const expectedYear = String(utcDate.getUTCFullYear()).padStart(4, "0");
          const expectedMonth = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
          const expectedDay = String(utcDate.getUTCDate()).padStart(2, "0");
          const expected = `${expectedYear}-${expectedMonth}-${expectedDay}`;

          expect(formatQuotaRenewsAtUtc(isoZ)).toBe(expected);

          // Testar também timestamp com deslocamento explícito de fuso que representa o mesmo instante UTC
          const sign = offsetMinutes >= 0 ? "+" : "-";
          const absMins = Math.abs(offsetMinutes);
          const offH = String(Math.floor(absMins / 60)).padStart(2, "0");
          const offM = String(absMins % 60).padStart(2, "0");
          const shifted = new Date(utcDate.getTime() + offsetMinutes * 60_000);
          const localIso =
            `${String(shifted.getUTCFullYear()).padStart(4, "0")}-` +
            `${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-` +
            `${String(shifted.getUTCDate()).padStart(2, "0")}T` +
            `${String(shifted.getUTCHours()).padStart(2, "0")}:` +
            `${String(shifted.getUTCMinutes()).padStart(2, "0")}:` +
            `${String(shifted.getUTCSeconds()).padStart(2, "0")}${sign}${offH}:${offM}`;

          expect(formatQuotaRenewsAtUtc(localIso)).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("retorna indicador de indisponível para null, undefined ou strings inválidas", () => {
    expect(formatQuotaRenewsAtUtc(null)).toBe(QUOTA_RENEWS_AT_UNAVAILABLE);
    expect(formatQuotaRenewsAtUtc(undefined)).toBe(QUOTA_RENEWS_AT_UNAVAILABLE);
    expect(formatQuotaRenewsAtUtc("")).toBe(QUOTA_RENEWS_AT_UNAVAILABLE);
    expect(formatQuotaRenewsAtUtc("not-a-date")).toBe(QUOTA_RENEWS_AT_UNAVAILABLE);
  });
});
