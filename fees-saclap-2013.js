// SACLAP guideline professional fees — Board Notice 47 of 2013
// Government Gazette No. 36307, 5 April 2013. Effective 1 January 2013.
// Source: https://www.gov.za/sites/default/files/gcis_document/201409/36307bn47.pdf
// Stage split and rules: SACLAP Code of Practice and Fees Protocol, January 2011 (saclap.org.za).
//
// This is the LAST GAZETTED SACLAP guideline fee notice that could be found (it is also the only one
// SACLAP lists under Professional Practice on its website). SACLAP's later gazettes (Board Notices
// 57 of 2018, 2022 and 2024 rates tables) are registration fees and charges under section 12(1),
// not professional fees. So the 2013 figures are the current guideline; a landscape architect
// will probably want to escalate them by agreement. The proposal says which notice was used.
//
// THE METHOD DOES NOT FIT THE COST-BRACKET SHAPE EXACTLY. The gazette gives a "Scale of Fees" as a
// PERCENTAGE OF PROJECT VALUE at seventeen value points (R400 000 → 14,00% … R9 000 000 → 9,90%),
// with projects below R400 000 "based on published hourly rates". It gives no primary/secondary
// columns and says nothing about values between the points or above R9 000 000.
// Closest honest fit (judgement call, listed in QUESTIONS-FOR-ENGINEER-AND-QS.md): the fee at each
// gazetted point is exactly value × gazetted %, and between two points the fee is interpolated in a
// straight line. That is what a bracket row expresses, so each row below is
//   [point, next point, fee at point (= point × %), marginal % to the next point, point]
// and index.html needs no new calculation branch. Above R9 000 000 the 9,90% is held flat (the last
// gazetted percentage), which is the same as a marginal 9,90% from a primary of R891 000. Below
// R400 000 the module reports "below the table" and points to hourly rates, as the gazette does.
// The alternative, interpolating the PERCENTAGE between points, gives R307 843 at R3 000 000: 0,2% more.
//
// Hand checks (used as tests, see CLAUDE.md):
//   R2 000 000 (a gazetted point): 2 000 000 × 10,99% = R219 800 → row [1800000, 2000000, 201780, 9.01, 1800000]:
//     201 780 + (2 000 000 - 1 800 000) × 9,01% = 219 800 ✓
//   R3 000 000 (between points): 290 920 + (3 000 000 - 2 800 000) × 8,14% = R307 200 (10,24% effective)
//   R12 000 000 (above the scale): 891 000 + 3 000 000 × 9,90% = R1 188 000 = 12 000 000 × 9,90% ✓
// Marginal percentages are exact to the Rand at the gazetted points: ((next × next%) - (point × %))
// ÷ (next - point); they are written to four decimals below, and the Python check in CLAUDE.md
// recomputes every point from the gazetted percentages.
//
// Stage split: Fees Protocol clause 10.5 (5 / 15 / 15 / 30 / 32 / 3). Partial service: protocol
// clause 8, fee for the stages performed plus 10% of the total applicable fee; +1% as principal
// agent and a further 1% as principal consultant (not built; by agreement). Master plans: 1% of the
// estimated development cost (protocol 7.1; not built: use a Negotiated percentage line).

(function () {
  // Gazette "Scale of Fees": [project value, percentage of project value]
  const SCALE = [
    [400000, 14.00], [500000, 13.53], [600000, 13.16], [700000, 12.86], [800000, 12.62],
    [900000, 12.42], [1000000, 12.25], [1200000, 11.95], [1400000, 11.70], [1600000, 11.45],
    [1800000, 11.21], [2000000, 10.99], [2400000, 10.64], [2800000, 10.39], [3500000, 9.94],
    [5000000, 9.92], [9000000, 9.90]
  ];
  // Bracket rows derived from the scale (see header): fee is exact at every gazetted point.
  const BRACKETS = SCALE.map((pt, i) => {
    const fee = Math.round(pt[0] * pt[1]) / 100;
    const next = SCALE[i + 1];
    if (!next) return [pt[0], null, fee, pt[1], pt[0]];              // flat 9,90% above R9 000 000
    const nextFee = Math.round(next[0] * next[1]) / 100;
    const marginal = (nextFee - fee) / (next[0] - pt[0]) * 100;
    return [pt[0], next[0] - 1, fee, Math.round(marginal * 10000) / 10000, pt[0]];
  });
  // Fees Protocol clause 10.5
  const STAGES = [
    { id: "1", name: "Inception", percent: 5 },
    { id: "2", name: "Concept and viability", percent: 15 },
    { id: "3", name: "Design development", percent: 15 },
    { id: "4", name: "Documentation and procurement", percent: 30 },
    { id: "5", name: "Construction", percent: 32 },
    { id: "6", name: "Close-out", percent: 3 }
  ];

  window.FEE_MODULES = window.FEE_MODULES || {};
  window.FEE_MODULES.saclap = {
    id: "saclap",
    discipline: "Landscape architecture",
    council: "South African Council for the Landscape Architectural Profession (SACLAP)",
    country: "South Africa",
    notice: "Board Notice 47 of 2013",
    gazette: "Government Gazette No. 36307, 5 April 2013",
    effectiveYear: 2013,
    sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/201409/36307bn47.pdf",
    guidelineWording: "These are guideline professional fees determined under section 34(2) of the Landscape Architectural Profession Act, 2000, read with the SACLAP Code of Practice and Fees Protocol; fees are agreed between the client and the landscape architectural professional. The 2013 notice is the latest gazetted scale; rates may be escalated by agreement.",
    costOfWorksNote: "Project cost: the estimated, and finally the actual, cost of the landscape works, excluding VAT. Second-hand materials are valued as if new (Fees Protocol 6.1).",
    belowTableNote: "The gazetted scale starts at a project value of R400 000. Below that the fee is based on the published hourly rates: choose Hours only or Lump sum under 'How is this job charged?'.",
    feeLabel: "Guideline fee (scale of fees)",
    vatRate: 0.15,
    selectors: [
      { id: "service", type: "seg", label: "Service", default: "full",
        options: [{ id: "full", label: "Full design service" }, { id: "partial", label: "Partial service (+10%)" }] }
    ],
    resolve(sel) {
      const partial = sel.service === "partial";
      return {
        brackets: BRACKETS,
        factor: partial ? 1.10 : 1,
        stageKey: "saclap",
        stages: STAGES.map((s) => ({ id: s.id, name: s.name, percent: s.percent, on: true })),
        summary: ["Landscape architectural design service on the gazetted sliding scale: a percentage of the project value that falls as the value rises (between the gazetted points the fee is interpolated)"].concat(partial ? ["Partial service: fee for the stages performed plus 10% of the applicable fee (Fees Protocol clause 8)"] : []),
        hint: (partial ? "Untick the stages not performed. The protocol adds 10% of the total applicable fee for a partial service; +1% as principal agent and a further 1% as principal consultant are by agreement. " : "Standard design service, stages 1 to 6 (Fees Protocol clause 7.2). ") + "Scale of fees: 14,00% at R400 000 falling to 9,90% at R9 000 000 and above.",
        factorLabel: partial ? "Partial service allowance (Fees Protocol clause 8)" : ""
      };
    },
    // The protocol has no repeated-unit rule. 100% means no reduction; edit by agreement.
    repeatedBuildings: {
      stages14Percent: 100,
      stageIds: ["1", "2", "3", "4"],
      note: "The SACLAP protocol has no repeated-design discount; 100% means no reduction. Phases of a master plan are separate projects for the percentage (Fees Protocol 7.1)."
    },
    disbursementAttendancePercent: 0,
    disbursementNote: "Fees Protocol clause 12: all reasonable expenses and disbursements are reimbursed; staff deployed on site at total cost of employment plus 30% (clause 10.13).",
    disbursementCategories: [
      "Travel and subsistence", "Accommodation", "Printing, plotting and reproduction", "Courier and postage",
      "Specialist consultants (hydrological, ecological, soil studies)", "Statutory and submission fees", "Plant material surveys and nursery visits", "Other (agreed with the client)"
    ],
    // Board Notice 47 of 2013, time-based fees, Rand per hour excluding VAT.
    hourlyRates: [
      { role: "Principal landscape architect: more than 10 years", rate: 1440 },
      { role: "Principal landscape architect: less than 10 years", rate: 1050 },
      { role: "Associates and managers", rate: 790 },
      { role: "Staff with direct responsibility for an activity", rate: 530 },
      { role: "Other staff under direction", rate: 260 }
    ],
    // Board Notice 47 of 2013: the three staff rows may instead be charged per R100 of total annual cost of employment.
    hourlyFormula: {
      basis: "total annual cost of employment",
      categories: [
        { id: "assoc", label: "Associates and managers", cents: 17.5 },
        { id: "staff", label: "Staff with direct responsibility for an activity", cents: 15 },
        { id: "other", label: "Other staff under direction", cents: 12.5 }
      ]
    },
    hourlyNote: "SACLAP time-based guideline rates, Board Notice 47 of 2013, excluding VAT. Associates, staff and other staff may instead be charged at 17,5c / 15c / 12,5c per hour for each R100 of total annual cost of employment ('From annual cost'). Change a rate if yours differs."
  };
})();
