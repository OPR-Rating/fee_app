// SACAP guideline professional fees — Board Notice 885 of 2026
// Government Gazette No. 54218, 27 February 2026 (replaces BN 875 of 2026, repeals BN 672 of 2024)
// Source: https://www.gov.za/sites/default/files/gcis_document/202602/54218bn885.pdf
//
// This file is DATA ONLY. When SACAP publishes next year's notice, copy this file to
// fees-2027.js, change the numbers, and point index.html at the new file.
//
// Method (gazette page 3): fee = primary fee (C) + (value of works - column E) x secondary % (D)
// Column E is the bracket's "from" value. Example in the gazette: R3 000 000, low complexity:
//   246 281.11 + (3 000 000 - 2 000 001) x 10.40% = R350 281.00

window.SACAP_FEES = {
  // Which discipline tile on the front door this module serves.
  id: "sacap",
  discipline: "Architecture",
  council: "South African Council for the Architectural Profession (SACAP)",
  country: "South Africa",
  notice: "Board Notice 885 of 2026",
  gazette: "Government Gazette No. 54218, 27 February 2026",
  effectiveYear: 2026,
  sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/202602/54218bn885.pdf",

  // Exact wording, gazette page 7, clause 2(b)
  guidelineWording:
    "The guideline for professional fees is not prescribed or set as maximum or minimum mandatory fees to be charged for professional services rendered, but serves as a guideline.",

  // Clause 15(d): the construction budget for fee purposes excludes VAT, contingencies,
  // fees for other consultants and specialists, and the escalation provision.
  costOfWorksNote:
    "Value of works excludes VAT, contingencies, other consultants' fees and escalation.",

  // All monetary amounts exclude VAT (definitions section).
  vatRate: 0.15,

  complexities: {
    low: {
      label: "Low complexity",
      description: "Simple buildings of utilitarian character, standard low-technology construction, minimal mechanical and electrical services.",
      // [from, to (null = no upper limit), primaryFee, secondaryPercent]
      brackets: [
        [1,             200000,      9073.48,    14.02],
        [200001,        650000,      37121.34,   11.73],
        [650001,        2000000,     89897.22,   11.58],
        [2000001,       4000000,     246281.11,  10.40],
        [4000001,       6500000,     454281.00,  10.24],
        [6500001,       13000000,    710280.90,   9.20],
        [13000001,      40000000,    1308280.81,  8.62],
        [40000001,      130000000,   3636760.72,  8.36],
        [130000001,     260000000,   11160760.64, 8.10],
        [260000001,     520000000,   21685560.56, 7.48],
        [520000001,     1040000000,  41133560.48, 7.22],
        [1040000001,    null,        78656760.41, 7.04]
      ]
    },
    medium: {
      label: "Medium complexity",
      description: "Buildings of average character and design, non-complex structure and civils, average level of mechanical and electrical equipment.",
      brackets: [
        [1,             200000,      11341.85,   17.53],
        [200001,        650000,      46401.67,   14.66],
        [650001,        2000000,     112371.53,  14.48],
        [2000001,       4000000,     307851.38,  13.00],
        [4000001,       6500000,     567851.25,  12.80],
        [6500001,       13000000,    887851.13,  11.50],
        [13000001,      40000000,    1635351.01, 10.78],
        [40000001,      130000000,   4545950.90, 10.45],
        [130000001,     260000000,   13950950.80, 10.12],
        [260000001,     520000000,   27106950.70, 9.35],
        [520000001,     1040000000,  51416950.60, 9.02],
        [1040000001,    null,        98320950.51, 8.80]
      ]
    },
    high: {
      label: "High complexity",
      description: "Large or complicated buildings with high performance requirements, specialised installations, complex structural or civil design.",
      brackets: [
        [1,             200000,      13610.22,   21.04],
        [200001,        650000,      55682.01,   17.59],
        [650001,        2000000,     134845.83,  17.38],
        [2000001,       4000000,     369421.66,  15.60],
        [4000001,       6500000,     681421.50,  15.36],
        [6500001,       13000000,    1065421.35, 13.80],
        [13000001,      40000000,    1962421.21, 12.94],
        [40000001,      130000000,   5455141.08, 12.54],
        [130000001,     260000000,   16741140.96, 12.14],
        [260000001,     520000000,   32528340.84, 11.22],
        [520000001,     1040000000,  61700340.72, 10.82],
        [1040000001,    null,        117985140.62, 10.56]
      ]
    }
  },

  // Clause 17 and the table on gazette page 20: apportionment of the fee between work stages.
  stages: [
    { id: "1",   name: "Inception",                       percent: 2 },
    { id: "2",   name: "Concept and viability",           percent: 15 },
    { id: "3",   name: "Design development",              percent: 20 },
    { id: "4.1", name: "Documentation: council submission", percent: 10 },
    { id: "4.2", name: "Documentation and procurement",   percent: 20 },
    { id: "5",   name: "Construction",                    percent: 30 },
    { id: "6",   name: "Close-out",                       percent: 3 }
  ],

  // Generic module interface used by index.html (same shape as the ECSA and SACQSP modules).
  feeLabel: "Full-service guideline fee",
  selectors: [
    { id: "complexity", type: "seg", label: "Complexity", default: "medium",
      options: [{ id: "low", label: "Low" }, { id: "medium", label: "Medium" }, { id: "high", label: "High" }] }
  ],
  resolve(sel) {
    const c = this.complexities[sel.complexity] || this.complexities.medium;
    return {
      brackets: c.brackets,   // [from, to, primary, %]; the secondary fee is charged on (value − from)
      factor: 1,
      stageKey: "sacap",
      stages: this.stages.map((s) => ({ id: s.id, name: s.name, percent: s.percent, on: true })),
      summary: ["Complexity: " + c.label],
      hint: c.description,
      factorLabel: ""
    };
  },
  hourlyNote: "SACAP guideline hourly rates (Table 4, Method 2), excluding VAT. Method 1 works the rate out from the person's total annual cost of employment ('From annual cost' or a staff member from Settings). Change a rate if yours differs.",
  // Table 4, Method 1: percentage per R100 (or part) of the person's total annual cost of employment.
  // The gazette's own example (page 5): principal over 10 years on R960 000 a year → 9 600 × 20c = R1 920 per hour;
  // registered professional (2b) on R480 000 → R792; support staff (2d) on R180 000 → R225.
  hourlyFormula: {
    basis: "total annual cost of employment",
    categories: [
      { id: "p_spec",  label: "Principal: specialist",                          cents: 22.5 },
      { id: "p_10",    label: "Principal: more than 10 years",                  cents: 20 },
      { id: "p_lt10",  label: "Principal: less than 10 years",                  cents: 18.5 },
      { id: "assoc",   label: "Associates and managers",                        cents: 17.5 },
      { id: "reg_dir", label: "Registered professional, direct responsibility", cents: 16.5 },
      { id: "reg_und", label: "Registered professional, under direction",       cents: 15 },
      { id: "support", label: "Support staff",                                  cents: 12.5 }
    ]
  },
  disbursementNote: "Reimbursed at cost. The gazette allows a minimum of 10% on top for attendance where the fee is project cost-based. Set it to 0 to charge cost only.",

  // Clause 23, gazette page 21: repeated buildings under one contract, one client, one site or
  // closely related sites. Full fee on the prototype(s). On each repeat, stages 1 to 4 are
  // apportioned at 35% of the guideline fee for those stages; stages 5 and 6 stay at full fee.
  // Does NOT apply to similar floors in a multi-storey building. "May be adjusted by agreement".
  repeatedBuildings: {
    stages14Percent: 35,
    stageIds: ["1", "2", "3", "4.1", "4.2"],
    note: "Clause 23: full fee on the prototype design; on each repeated unit, stages 1 to 4 at 35% of the guideline fee for those stages, stages 5 and 6 at full fee. Not for similar floors in one multi-storey building."
  },

  // Clause 35 and the reimbursement table, gazette pages 5 to 7 and 24 to 26.
  // Disbursements are reimbursed at cost. A minimum of 10% of the cost may be added for
  // attendance where a project cost-based fee applies.
  disbursementAttendancePercent: 10,
  disbursementCategories: [
    "Council submission and statutory fees",
    "Specialist professional services",
    "Travel mileage",
    "Travel time",
    "Parking, tolls, car hire",
    "Flights, train, bus, taxi",
    "Accommodation and subsistence",
    "Postage and courier",
    "Printing and duplicating (A3, A4)",
    "Plotting of drawings (A3 to A0)",
    "Scanning and document binding",
    "Purchase of documents and research material",
    "Maps",
    "Models",
    "Presentation materials",
    "Photography",
    "Artwork",
    "Specialised computer software",
    "Project software subscriptions",
    "Other (agreed with the client)"
  ],

  // Table 4, Method 2 (SACAP guideline rate), Rand per hour excluding VAT.
  hourlyRates: [
    { role: "Principal: specialist",                      rate: 3313 },
    { role: "Principal: more than 10 years",              rate: 2663 },
    { role: "Principal: less than 10 years",              rate: 1991 },
    { role: "Associates and managers",                    rate: 1420 },
    { role: "Registered professional, direct responsibility", rate: 960 },
    { role: "Registered professional, under direction",   rate: 571 },
    { role: "Support staff",                              rate: 408 }
  ]
};

// Register this module for the front door. Other disciplines register under their own id
// (ecsa, sacqsp, sacpcmp, saclap, sacpvp) from their own files.
window.FEE_MODULES = window.FEE_MODULES || {};
window.FEE_MODULES[window.SACAP_FEES.id] = window.SACAP_FEES;
