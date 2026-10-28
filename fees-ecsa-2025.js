// ECSA guideline scope of services and professional fees — Board Notice 783 of 2025
// Government Gazette No. 52691, 16 May 2025. Commencement 2 April 2025.
// Source: https://www.gov.za/sites/default/files/gcis_document/202505/52691bn783.pdf
//
// DATA ONLY. Method (clause 4.2.1): pick the table for the discipline and project type, find the
// bracket where the cost of the works "exceeds A but does not exceed B"; basic fee = primary fee (C)
// + D% of the amount by which the cost exceeds A. Multiply by the typical factors (Tables 2A–8A)
// that apply. Stages are apportioned per Table 9. Projects up to R1 000 000: lump sum or time based.
//
// Worked examples in the gazette (used as tests):
//   A: rural road R24m, Table 1: 2 488 500 + (24m − 21m) × 9% = 2 758 500; × 0.85 = R2 344 725
//   C: electrical, building, R8m, Table 8: 399 000 + (8m − 2.1m) × 15% = R1 284 000
//
// NOT in this version: Table 2 (additional design fee on reinforced concrete and structural steel,
// engineering projects); construction monitoring staff costs (4.3.2); lead consultant +10% (4.3.3);
// principal agent +1% of cost of works (4.3.5). Add when an engineer asks for them.

(function () {
  // Bracket rows: [lowest value in bracket, highest (null = open), primary fee, secondary %, subtract base A]
  const ENG_PROJECTS_6 = [   // Table 1 (civil & structural, engineering projects): last row 6.00%
    [1050001, 2100000, 178500, 17.00, 1050000],
    [2100001, 10500000, 336000, 12.50, 2100000],
    [10500001, 21000000, 1386000, 10.50, 10500000],
    [21000001, 52500000, 2488500, 9.00, 21000000],
    [52500001, 105000000, 5323500, 8.00, 52500000],
    [105000001, 630000000, 9523500, 7.00, 105000000],
    [630000001, null, 46273500, 6.00, 630000000]
  ];
  const ENG_PROJECTS_65 = ENG_PROJECTS_6.map((r, i) => i === 6 ? [r[0], r[1], r[2], 6.50, r[4]] : r.slice());   // Tables 5 & 6
  const BUILDING_CIV_STR = [   // Tables 3 & 4
    [1050001, 2100000, 178500, 17.00, 1050000],
    [2100001, 10500000, 336000, 12.50, 2100000],
    [10500001, 21000000, 1386000, 10.50, 10500000],
    [21000001, 52500000, 2488500, 9.50, 21000000],
    [52500001, null, 5481000, 8.50, 52500000]
  ];
  const BUILDING_MECH_ELEC = [   // Tables 7 & 8
    [1050001, 2100000, 210000, 20.00, 1050000],
    [2100001, 10500000, 399000, 15.00, 2100000],
    [10500001, 21000000, 1659000, 13.00, 10500000],
    [21000001, 52500000, 3024000, 11.50, 21000000],
    [52500001, 105000000, 6646500, 10.50, 52500000],
    [105000001, null, 12159000, 10.00, 105000000]
  ];
  const MANAGEMENT = [   // Table 10: engineering management services (principal consultant)
    [1050001, 2100000, 52500, 5.0, 1050000],
    [2100001, 10500000, 99750, 3.5, 2100000],
    [10500001, 21000000, 393750, 3.0, 10500000],
    [21000001, 52500000, 708750, 2.5, 21000000],
    [52500001, 105000000, 1496250, 2.0, 52500000],
    [105000001, null, 2546250, 1.5, 105000000]
  ];
  const NAMES = ["Inception", "Concept and viability", "Design development", "Documentation and procurement", "Contract administration and inspection", "Close-out"];
  const stages = (pcts) => pcts.map((p, i) => ({ id: String(i + 1), name: NAMES[i], percent: p }));
  // Table 9: typical percentage points per stage
  const ST = {
    civ_eng: [5, 25, 25, 25, 15, 5],
    str_eng: [5, 25, 30, 10, 25, 5],
    civ_bld: [5, 25, 25, 15, 25, 5],
    str_bld: [5, 20, 30, 15, 25, 5],
    me:      [5, 15, 20, 20, 35, 5],
    mgmt:    [5, 20, 30, 15, 25, 5]
  };
  const TABLES = {
    civ_eng:  { label: "Civil engineering · engineering project (Table 1)",      brackets: ENG_PROJECTS_6,   stages: "civ_eng" },
    str_eng:  { label: "Structural engineering · engineering project (Table 1)", brackets: ENG_PROJECTS_6,   stages: "str_eng" },
    civ_bld:  { label: "Civil engineering · building project (Table 3)",         brackets: BUILDING_CIV_STR, stages: "civ_bld" },
    str_bld:  { label: "Structural engineering · building project (Table 4)",    brackets: BUILDING_CIV_STR, stages: "str_bld" },
    mech_eng: { label: "Mechanical engineering · engineering project (Table 5)", brackets: ENG_PROJECTS_65,  stages: "me" },
    elec_eng: { label: "Electrical engineering · engineering project (Table 6)", brackets: ENG_PROJECTS_65,  stages: "me" },
    mech_bld: { label: "Mechanical engineering · building project (Table 7)",    brackets: BUILDING_MECH_ELEC, stages: "me" },
    elec_bld: { label: "Electrical engineering · building project (Table 8)",    brackets: BUILDING_MECH_ELEC, stages: "me" },
    mgmt:     { label: "Engineering management / principal consultant (Table 10)", brackets: MANAGEMENT,     stages: "mgmt" }
  };
  // Typical factors (Tables 2A, 3A, 4A, 5A, 6A, 7A, 8A, 11A). The gazette multiplies them together
  // when more than one applies. Ranges are shown at their lower value; edit by agreement.
  const FACTORS = [
    { id: "alter",     label: "Alterations to existing works (portion affected)", factor: 1.25 },
    { id: "tenant",    label: "Multi-tenant installations (building M&E)",         factor: 1.25 },
    { id: "wet",       label: "Water supply, drainage and fire water systems",      factor: 1.25 },
    { id: "wwtw",      label: "Water and wastewater treatment works",               factor: 1.25 },
    { id: "ruralws",   label: "Water and sanitation in rural areas",                factor: 1.35 },
    { id: "informal",  label: "Services for informal settlements (1.25 to 1.50)",   factor: 1.25 },
    { id: "rd_flat",   label: "Rural single carriageway, flat terrain",             factor: 0.85 },
    { id: "fw_flat",   label: "Rural freeway / dual carriageway, flat terrain",     factor: 0.95 },
    { id: "rd_mtn",    label: "Rural single carriageway, mountainous",              factor: 1.15 },
    { id: "fw_mtn",    label: "Rural freeway / dual carriageway, mountainous",      factor: 1.25 },
    { id: "rd_urban",  label: "Single carriageway through urban areas",             factor: 1.15 },
    { id: "fw_urban",  label: "Freeway / dual carriageway through urban areas",     factor: 1.25 },
    { id: "rd_rehab",  label: "Road maintenance and rehabilitation",                factor: 1.15 },
    { id: "rd_upg",    label: "Road upgrading (pavement and/or alignment)",         factor: 1.25 },
    { id: "gravel",    label: "Gravel roads (0.75 to 1.50 by class)",               factor: 1.00 },
    { id: "mass",      label: "Mass concrete, brickwork, cladding designed by engineer (design portion)", factor: 0.33 },
    { id: "finadmin",  label: "Financial administration done by the QS or others (cost > R1m)", factor: 0.85 }
  ];

  window.FEE_MODULES = window.FEE_MODULES || {};
  window.FEE_MODULES.ecsa = {
    id: "ecsa",
    discipline: "Engineering",
    council: "Engineering Council of South Africa (ECSA)",
    country: "South Africa",
    notice: "Board Notice 783 of 2025",
    gazette: "Government Gazette No. 52691, 16 May 2025",
    effectiveYear: 2025,
    sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/202505/52691bn783.pdf",
    guidelineWording: "This guideline scope of services and professional fees is a guideline determined under section 34(2) of the Engineering Profession Act, 2000; fees are agreed between the client and the consulting engineer.",
    costOfWorksNote: "Cost of the works (clause 1.2.7): the amount certifiable to contractors for the works designed, specified or administered by the engineer, excluding VAT, including escalation and a pro-rata share of preliminary and general items.",
    belowTableNote: "The ECSA tables start at a cost of works of R1 050 000. For projects up to R1 000 000 the gazette provides for a lump sum or time-based fee: use Hours only.",
    feeLabel: "Basic fee for normal services",
    vatRate: 0.15,
    selectors: [
      { id: "table", type: "select", label: "Discipline and project type", default: "civ_bld",
        options: Object.keys(TABLES).map((k) => ({ id: k, label: TABLES[k].label })) },
      { id: "factors", type: "multi", label: "Typical factors that apply (multiplied together)", default: [],
        options: FACTORS.map((f) => ({ id: f.id, label: `${f.label} × ${f.factor.toFixed(2)}` })) }
    ],
    resolve(sel) {
      const t = TABLES[sel.table] || TABLES.civ_bld;
      const chosen = FACTORS.filter((f) => (sel.factors || []).includes(f.id));
      const factor = chosen.reduce((a, f) => a * f.factor, 1);
      return {
        brackets: t.brackets,
        factor,
        stageKey: t.stages,
        stages: stages(ST[t.stages]),
        summary: [t.label].concat(chosen.map((f) => `${f.label}: × ${f.factor.toFixed(2)}`)),
        factorLabel: chosen.length ? `Typical factors (${chosen.map((f) => f.factor.toFixed(2)).join(" × ")} = ${factor.toFixed(3)})` : ""
      };
    },
    // Where not all stages are provided, the gazette adds "typically plus 10 percentage points" (clause 4.2.9).
    partialServicePoints: 10,
    partialServiceNote: "Clause 4.2.9: where not all stages are provided, the fee is the sum of the stage points plus typically 10 percentage points.",
    repeatedBuildings: {
      stages14Percent: 25,
      stageIds: ["1", "2", "3", "4"],
      note: "Duplication of works (factor 0.25, clause 4.1.5.14): applies to the design stages 1 to 4 of complete units repeated without alteration to the drawings; stages 5 and 6 at full fee."
    },
    disbursementAttendancePercent: 0,
    disbursementNote: "Expenses and costs are recovered at cost (clause 4.5).",
    disbursementCategories: [
      "Travel and subsistence", "Accommodation", "Printing, plotting and reproduction", "Courier and postage",
      "Specialist services and testing", "Statutory and submission fees", "Site establishment", "Software and data", "Other (agreed with the client)"
    ],
    hourlyRates: [],
    hourlyNote: "ECSA publishes no Rand hourly rates: the rate is 22c (categories A and B), 17,5c (C) or 16,5c (D) per hour for each R100 of the person's total annual cost of employment, or DPSA indicative rates. Enter your own rate."
  };
})();
