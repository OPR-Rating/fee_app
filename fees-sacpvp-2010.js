// SACPVP guideline professional fees — Board Notice 138 of 2010
// Government Gazette No. 33614, 15 October 2010. Effective 1 October 2010.
// Source: https://www.gov.za/sites/default/files/gcis_document/201409/33614138.pdf
//
// This is the ONLY gazetted SACPVP guideline professional fee notice that could be found. The
// council's later gazettes (for example Notice 7467 of 2026, Gazette 54677) are registration fees
// and charges under section 12(1), not professional fees; SACPVP and the SA Institute of Valuers
// still publish the 2010 guideline as the current one. The figures are sixteen years old, so a
// valuer will want to escalate them by agreement. The proposal says which notice was used.
//
// THE METHOD IS A PER-VALUATION TARIFF, NOT A CONSTRUCTION FEE. The ad valorem tariff (clause 1.1)
// is read on the VALUE OF THE PROPERTY being valued: a basic tariff for the bracket plus "R x per
// R1 000 over" the bracket's lower figure. R15,00 per R1 000 is 1,5%, so the table converts exactly
// to the app's bracket rows [lo, hi, basic tariff, %, over] and index.html needs no new calculation
// branch. In this app the "value of works" field is therefore the VALUE OF THE PROPERTY (type it
// under Single project → Value of works). There are no work stages: the whole fee sits in one
// stage, "Valuation and report". The repeated-units card does not apply (clause 1.4: continuous
// valuations of similar properties are priced on their TOTAL value at the relevant tariff, which is
// what the Development scheme fork gives when the repeat percentage is left at 100).
//
// Table check: every basic tariff equals the previous basic tariff plus the previous rate over the
// whole bracket (500 + 1,5% × 100 000 = 2 000; … ; 56 200 + 0,04% × 50 000 000 = 76 200).
// Hand checks (used as tests, see CLAUDE.md):
//   R2 500 000 house: 7 700 + (2 500 000 - 1 000 000) × 0,15% = R9 950
//   R30 000 000 commercial: 38 700 + 5 000 000 × 0,07% = R42 200; second value (+30%) = R54 860
//   Rental valuation, gross annual rental R240 000: 5 100 + 190 000 × 0,75% = R6 525
//
// Clauses built as selectors: 1.2 more than one value for the property (+30% of the first fee),
// 1.5 revaluation within 12 months (-50%), 3.0 rental valuations on gross annual rental.
// NOT built: 1.3 prescribed forms (+25%, capped at R250 per property), 1.6 sectional title
// (investigation time at the hourly rate on top), 1.7 before-and-after, 1.8 part of a property,
// 2.2 (time charge may be used instead, but not less than the ad valorem fee), 3.0 note 2 (minimum
// R1 600 per rental determination), 4.0 to 5.0 court and arbitration (1,5 × hourly; R12 000 per
// day), 6.0 transport allowance (R4,50 per km), 7.3 typing at 15% of the time charge.
// Use Hours or a Negotiated line for those.

(function () {
  // Clause 1.1 ad valorem tariff: [lowest value, highest (null = open), basic tariff, % over, over]
  const AD_VALOREM = [
    [1, 50000, 500, 0, 0],
    [50001, 150000, 500, 1.50, 50000],
    [150001, 350000, 2000, 1.00, 150000],
    [350001, 500000, 4000, 0.80, 350000],
    [500001, 750000, 5200, 0.60, 500000],
    [750001, 1000000, 6700, 0.40, 750000],
    [1000001, 5000000, 7700, 0.15, 1000000],
    [5000001, 10000000, 13700, 0.14, 5000000],
    [10000001, 25000000, 20700, 0.12, 10000000],
    [25000001, 50000000, 38700, 0.07, 25000000],
    [50000001, 100000000, 56200, 0.04, 50000000],
    [100000001, null, 76200, 0.02, 100000000]
  ];
  // Clause 3.0 rental valuations, read on the gross annual rental (R270 per R1 000 = 27%)
  const RENTAL = [
    [1, 15000, 0, 27.00, 0],
    [15001, 50000, 4050, 3.00, 15000],
    [50001, null, 5100, 0.75, 50000]
  ];
  const STAGE = [{ id: "1", name: "Valuation and report", percent: 100, on: true }];

  window.FEE_MODULES = window.FEE_MODULES || {};
  window.FEE_MODULES.sacpvp = {
    id: "sacpvp",
    discipline: "Property valuation",
    council: "South African Council for the Property Valuers Profession (SACPVP)",
    country: "South Africa",
    notice: "Board Notice 138 of 2010",
    gazette: "Government Gazette No. 33614, 15 October 2010",
    effectiveYear: 2010,
    sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/201409/33614138.pdf",
    guidelineWording: "These are guideline professional fees determined under section 35(2) of the Property Valuers Profession Act, 2000, published for general information; the fee is agreed between the client and the registered valuer. The 2010 notice is the latest gazetted guideline; rates may be escalated by agreement.",
    costOfWorksNote: "For a valuation the 'value of works' is the VALUE OF THE PROPERTY being valued (for a rental valuation, the gross annual rental), excluding VAT. The ad valorem fee includes the time spent inspecting the property; report drafting, research and Deeds Office searches may be charged at the hourly rate in addition (notes (ii) and clause 2.3).",
    belowTableNote: "Enter the value of the property.",
    feeLabel: "Ad valorem tariff fee (clause 1.1)",
    vatRate: 0.15,
    selectors: [
      { id: "tariff", type: "seg", label: "Tariff", default: "value",
        options: [{ id: "value", label: "Valuation (on property value)" }, { id: "rental", label: "Rental valuation (on gross annual rental)" }] },
      { id: "extras", type: "multi", label: "Adjustments", default: [],
        options: [
          { id: "second", label: "A second value for the same property, e.g. market and insurance value (+30%, clause 1.2)" },
          { id: "reval", label: "Revaluation within 12 months, property unchanged (-50%, clause 1.5)" }
        ] }
    ],
    resolve(sel) {
      const rental = sel.tariff === "rental";
      const ex = sel.extras || [];
      const second = !rental && ex.includes("second"), reval = ex.includes("reval");
      const factor = (second ? 1.30 : 1) * (reval ? 0.5 : 1);
      const parts = [];
      if (second) parts.push("second value +30%");
      if (reval) parts.push("revaluation -50%");
      return {
        brackets: rental ? RENTAL : AD_VALOREM,
        factor,
        stageKey: rental ? "rental" : "value",
        stages: STAGE.map((s) => Object.assign({}, s)),
        summary: [rental ? "Rental valuation on the gross annual rental (clause 3.0 tariff; minimum R1 600 per rental determination)" : "Valuation on the ad valorem tariff (clause 1.1), read on the value of the property"]
          .concat(second ? ["More than one value required: an additional 30% of the fee for the first valuation (clause 1.2)"] : [])
          .concat(reval ? ["Revaluation within 12 months of a valuation by the same valuer, property not materially changed: fee reduced by 50% (clause 1.5)"] : []),
        hint: rental ? "Type the gross annual rental as the value. Investigations and research are charged at the hourly rate in addition (clause 3.0 note 1)." : "Type the value of the property as the value of works. The fee includes the inspection; add hours for the report, research and searches if you charge for them.",
        factorLabel: parts.length ? `Adjustments (${parts.join(", ")})` : ""
      };
    },
    repeatedBuildings: {
      stages14Percent: 100,
      stageIds: ["1"],
      note: "Clause 1.4: two or more properties with similar attributes valued under one instruction may be charged on their total value at the relevant tariff; 100% means no reduction."
    },
    disbursementAttendancePercent: 0,
    disbursementNote: "Clauses 6.0 and 7.0: transport at R4,50 per km (own vehicle) or actual cost, travelling time at the hourly rate, accommodation and meals at cost, plans, expert advice, postage and photographs at cost, typing at 15% of the time charge.",
    disbursementCategories: [
      "Transport (own vehicle, R4,50 per km)", "Public transport or hired conveyance", "Travelling time", "Accommodation, meals and refreshments",
      "Purchase and preparation of plans and drawings", "Deeds Office and municipal searches", "Expert advice and assistance", "Typing and secretarial (15% of time charge)", "Postage, photographs and incidentals", "Other (agreed with the client)"
    ],
    // Clause 2.1 time charge, Rand per hour or part thereof, excluding VAT.
    hourlyRates: [
      { role: "Professional valuer: more than 10 years", rate: 1600 },
      { role: "Professional valuer: less than 10 years", rate: 1300 },
      { role: "Professional associated valuer: more than 10 years", rate: 1300 },
      { role: "Professional associated valuer: less than 10 years", rate: 1100 },
      { role: "Candidate valuer: recognised qualification", rate: 650 },
      { role: "Candidate valuer: no qualification, over 3 years", rate: 550 },
      { role: "Candidate valuer: no qualification, 1 to 3 years", rate: 450 }
    ],
    hourlyNote: "SACPVP guideline time charge, Board Notice 138 of 2010, excluding VAT. Court, arbitration and consultation work is charged at 1,5 times these rates (clause 4.1). Change a rate if yours differs."
  };
})();
