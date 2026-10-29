// SACPCMP recommended guideline tariff of fees — Board Notice 168 of 2019
// Government Gazette No. 42697, 13 September 2019. Commencement September 2019.
// Source: https://www.gov.za/sites/default/files/gcis_document/201909/42697bn168.pdf
//
// This is the LAST GAZETTED SACPCMP tariff. A rebased 2022 tariff was published for comment
// (Board Notice 182 of 2021, Gazette 45649) but its gazetting was suspended and it never became a
// notice; Board Notice 392 of 2023 (Gazette 48017) is a fee POLICY with no figures. So the 2019
// figures are the current guideline, and a construction project manager will probably want to
// escalate them by agreement. The proposal says which notice was used.
//
// DATA ONLY. Method (clause 7): the basic fee for normal construction project management services
// on BUILDING projects is read from one table: primary fee for the cost bracket + "add %" of the
// cost of the works over the bracket's "for value over" figure. This is the same shape as SACAP
// and ECSA, so index.html needs no new calculation branch. Stages per clause 8. Alterations and
// additions +25% (clause 12). Hourly rates: the gazette points to the Department of Public Works
// consultant rates rather than giving Rand figures (clause 10.3), so the hourly list is empty and
// the user enters a rate.
//
// The gazette has no worked example. Hand checks (used as tests, see CLAUDE.md):
//   R5 000 000:  334 400 + (5 000 000 - 4 000 000) × 7,85% = R412 900
//   R45 000 000: 2 392 340 + (45 000 000 - 32 000 000) × 6,30% = R3 211 340; alterations × 1,25 = R4 014 175
// Bracket 1 reads "16 650 + 8,00% for value over 0", so the fee at R1 000 000 is 96 650, which
// is bracket 2's primary: the table is continuous there. Three joins are not exactly continuous:
// bracket 3 starts at 175 400 where bracket 2 ends at 176 650; bracket 7's primary is 2 392 340
// where bracket 6 ends at 2 392 400; bracket 9's primary is 7 992 400 where bracket 8 ends at
// 7 992 340 (the last two look like transposed digits in the gazette). The gazette's own figures
// are kept as printed; the differences are at most R1 250 on fees of R175 000 and up.
//
// NOT in this version: clause 6.6 (separate sites, phases or sections: fee per site or an agreed
// figure between that and the fee on the total), clause 5.2 termination surcharge, and the
// additional/supplementary services of clause 4 (by agreement). Add when a PrCPM asks for them.

(function () {
  // Bracket rows: [lowest cost in bracket, highest (null = open), primary fee, add %, "for value over"]
  const BUILDING = [
    [1, 1000000, 16650, 8.00, 0],
    [1000001, 2000000, 96650, 8.00, 1000000],
    [2000001, 4000000, 175400, 7.95, 2000000],
    [4000001, 8000000, 334400, 7.85, 4000000],
    [8000001, 16000000, 648400, 7.80, 8000000],
    [16000001, 32000000, 1272400, 7.00, 16000000],
    [32000001, 64000000, 2392340, 6.30, 32000000],
    [64000001, 128000000, 4408340, 5.60, 64000000],
    [128000001, 256000000, 7992400, 4.90, 128000000],
    [256000001, 500000000, 14264400, 4.24, 256000000],
    [500000001, 1000000000, 24610000, 3.66, 500000000],
    [1000000001, 2000000000, 42910000, 3.16, 1000000000],
    [2000000001, 3000000000, 74510000, 2.83, 2000000000],
    [3000000001, null, 102810000, 2.58, 3000000000]
  ];
  // Clause 8: proportioning the basic fee over the stages
  const STAGES = [
    { id: "1", name: "Initiation (inception)", percent: 10 },
    { id: "2", name: "Concept and viability", percent: 10 },
    { id: "3", name: "Design development", percent: 25 },
    { id: "4", name: "Documentation and procurement", percent: 10 },
    { id: "5", name: "Construction", percent: 40 },
    { id: "6", name: "Close-out", percent: 5 }
  ];

  window.FEE_MODULES = window.FEE_MODULES || {};
  window.FEE_MODULES.sacpcmp = {
    id: "sacpcmp",
    discipline: "Project and construction management",
    council: "South African Council for the Project and Construction Management Professions (SACPCMP)",
    country: "South Africa",
    notice: "Board Notice 168 of 2019",
    gazette: "Government Gazette No. 42697, 13 September 2019",
    effectiveYear: 2019,
    sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/201909/42697bn168.pdf",
    guidelineWording: "This is the recommended guideline tariff of fees determined under section 34(2) of the Project and Construction Management Professions Act, 2000; where the tariff is inappropriate to a project the client and construction project manager may agree a fee in writing (clause 6.4). The 2019 notice is the latest gazetted tariff; rates may be escalated by agreement.",
    costOfWorksNote: "Cost of the works: the total amount, including free-issue items and excluding VAT, certified or to be certified to contractors for the works the construction project manager manages, before deduction of penalties or liquidated damages.",
    belowTableNote: "The value of works is below the first bracket of the table.",
    feeLabel: "Basic fee for normal services (clause 7)",
    vatRate: 0.15,
    selectors: [
      { id: "kind", type: "seg", label: "Nature of the works", default: "new",
        options: [{ id: "new", label: "New building works" }, { id: "alter", label: "Alterations and additions (+25%)" }] }
    ],
    resolve(sel) {
      const alter = sel.kind === "alter";
      return {
        brackets: BUILDING,
        factor: alter ? 1.25 : 1,
        stageKey: "sacpcmp",
        stages: STAGES.map((s) => ({ id: s.id, name: s.name, percent: s.percent, on: true })),
        summary: ["Construction project management, building projects (clause 7 table)"].concat(alter ? ["Alterations and additions: premium of 25% (clause 12)"] : []),
        hint: alter ? "Clause 12: a premium of 25% of the applicable fee is added for the additional work required for alterations and additions." : "The tariff covers normal construction project management services on building projects.",
        factorLabel: alter ? "Alterations and additions premium (clause 12)" : ""
      };
    },
    // The gazette has no repeated-building rule for construction project managers. Clause 6.6 lets
    // separate sites, phases or sections be priced separately or at an agreed figure. The repeat
    // card is left available at 100% (no reduction) so that a scheme's units can still be listed.
    repeatedBuildings: {
      stages14Percent: 100,
      stageIds: ["1", "2", "3", "4"],
      note: "The SACPCMP tariff has no repeated-building discount; 100% means no reduction. Clause 6.6: works on separate sites, phases or sections may be priced per site, or at an agreed fee between that sum and the fee on the total cost."
    },
    disbursementAttendancePercent: 0,
    disbursementNote: "Clause 11: disbursements and reasonable travelling and subsistence are claimed at cost over and above the fee; travelling time at the time-based rate, less the first hour per return journey when fees are on a percentage basis.",
    disbursementCategories: [
      "Travelling (private vehicle, parking, tolls)", "Flights, train, bus, taxi, hired car", "Travelling time",
      "Accommodation and subsistence", "Typing, production, copying and binding of contract and tender documents",
      "Special reproductions, printing, artwork and photography requested by the client", "Other (agreed with the client)"
    ],
    hourlyRates: [],
    hourlyNote: "Clause 10.3: the gazette gives no Rand rates; it refers to the Department of Public Works hourly fee rates for consultants (www.dpw.gov.za) as recommended guidelines, or rates agreed at the start of the commission. Enter your own rate."
  };
})();
