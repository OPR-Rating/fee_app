// SACQSP 2024 guideline tariff of professional fees — Board Notice 741 of 2025
// Government Gazette No. 52152, 21 February 2025. Effective 1 May 2024.
// Source: https://www.gov.za/sites/default/files/gcis_document/202502/52152bod741.pdf
// Hourly rates: Board Notice 778 of 2025 (Gazette 52534, 17 April 2025), effective 1 May 2024.
//
// DATA ONLY. Method (clause 2.1): fee = basic fee (clause 2.2.1, on the value for fee purposes)
// × appropriate percentage (clauses 2.3 to 2.6, by category and contract type) × adjustment factor
// (clause 2.2.2, by agreement), apportioned to stages per clause 2.7.
// The basic fee table was read from the gazette page image and checked: each primary charge equals
// the previous primary plus the previous marginal rate over the whole bracket.
//
// Worked example in the gazette (used as a test): value for fee purposes R77 500 000 →
//   5 438 500 + 6,75% × 13 500 000 = R6 349 750 (building works, bills of quantities, 100%).

(function () {
  // [lowest value in bracket, highest (null = open), primary charge, marginal %, balance-over base]
  const BASIC = [
    [1, 1000000, 23000, 13.25, 0],
    [1000001, 2000000, 155500, 13.00, 1000000],
    [2000001, 4000000, 285500, 12.75, 2000000],
    [4000001, 8000000, 540500, 10.95, 4000000],
    [8000001, 16000000, 978500, 9.55, 8000000],
    [16000001, 32000000, 1742500, 8.30, 16000000],
    [32000001, 64000000, 3070500, 7.40, 32000000],
    [64000001, 128000000, 5438500, 6.75, 64000000],
    [128000001, 256000000, 9758500, 5.38, 128000000],
    [256000001, 500000000, 16644900, 5.20, 256000000],
    [500000001, 1500000000, 29332900, 4.20, 500000000],
    [1500000001, 3000000000, 71332900, 3.75, 1500000000],
    [3000000001, 10000000000, 127582900, 2.70, 3000000000],
    [10000000001, null, 316582900, 2.25, 10000000000]
  ];
  const NAMES = ["Inception", "Concept and viability", "Design development", "Documentation and procurement", "Construction", "Close-out"];
  const mk = (p) => p.map((v, i) => ({ id: String(i + 1), name: NAMES[i], percent: v === null ? 0 : v, on: v !== null }));
  // Clause 2.7 apportionment of fees to stages (null = n/a)
  const APPORTION = {
    boq:        [5, 10, 15, 40, 25, 5],
    prov:       [5, 10, 15, 25, 40, 5],
    sor:        [5, 10, 20, 10, 50, 5],
    builders:   [null, null, null, 100, null, null],
    noboq:      [2.5, 7.5, 10, 20, 52.5, 7.5],
    costnorms:  [15, 15, 15, 20, 25, 10],
    costplus:   [2.5, 7.5, 10, 15, 57.5, 7.5],
    payval:     [null, null, null, null, 92.5, 7.5],
    pagency:    [null, null, 7.5, 7.5, 70, 15],
    pconsult:   [25, 25, 25, 25, null, null],
    monitor:    [2.5, 5, 10, 17.5, 50, 15],
    quality:    [null, null, null, null, 85, 15],
    replicate:  [2.5, 5, 5, 17.5, 62.5, 7.5],
    s_prov:     [2.5, 7.5, 10, 17.5, 55, 7.5],
    s_boq:      [2.5, 7.5, 10, 35, 37.5, 7.5],
    s_sor:      [2.5, 7.5, 10, 12.5, 60, 7.5],
    multi:      [2.5, 5, 7.5, 35, 45, 5]      // stage 4: 15 during stage 4 + 20 during stage 5
  };
  // Clause 2.3 (building), 2.4 (engineering), 2.5 (management): appropriate percentage by work and contract type
  const BUILDING_CONTRACTS = [
    { id: "boq",      label: "Bills of quantities (incl. provisional quantities, schedule of rates)", st: "boq" },
    { id: "sboq",     label: "Simplified bills of quantities",   st: "s_boq" },
    { id: "noboq",    label: "Contract without bills of quantities", st: "noboq" },
    { id: "builders", label: "Builder's quantities",            st: "builders" },
    { id: "payval",   label: "Payment valuations only",         st: "payval" },
    { id: "costplus", label: "Cost-plus contract",              st: "costplus" }
  ];
  const ENG_CONTRACTS = [
    { id: "eboq",     label: "Engineering bills of quantities",          st: "boq" },
    { id: "enoboq",   label: "Contract without engineering bills of quantities", st: "noboq" },
    { id: "payval",   label: "Payment valuations only",                  st: "payval" },
    { id: "costplus", label: "Cost-plus contract",                       st: "costplus" }
  ];
  const MGMT_CONTRACTS = [
    { id: "bld", label: "Building works" },
    { id: "eng", label: "Engineering works" }
  ];
  const WORK = {
    building:   { label: "Building works",                 group: "building", pct: { boq: 100, sboq: 75, noboq: 75, builders: 20, payval: 15, costplus: 70 } },
    alteration: { label: "Alteration works",               group: "building", pct: { boq: 140, sboq: 100, noboq: 75, builders: 20, payval: 15, costplus: 70 } },
    civ1:       { label: "Civil engineering works: category I",  group: "eng", pct: { eboq: 55, enoboq: 45, payval: 15, costplus: 55 } },
    civ2:       { label: "Civil engineering works: category II", group: "eng", pct: { eboq: 70, enoboq: 45, payval: 15, costplus: 55 } },
    elec:       { label: "Electrical engineering works",   group: "eng", pct: { eboq: 65, enoboq: 45, payval: 15, costplus: 55 } },
    mech:       { label: "Mechanical engineering works",   group: "eng", pct: { eboq: 65, enoboq: 45, payval: 15, costplus: 55 } },
    proc_iso:   { label: "Process engineering: detail isometric drawings", group: "eng", pct: { eboq: 55, enoboq: 45, payval: 15, costplus: 55 } },
    proc_ga:    { label: "Process engineering: general arrangement drawings", group: "eng", pct: { eboq: 100, enoboq: 45, payval: 15, costplus: 55 } },
    pagency:    { label: "Principal agency",      group: "mgmt", pct: { bld: 45, eng: 42.5 }, st: "pagency" },
    pconsult:   { label: "Principal consultancy", group: "mgmt", pct: { bld: 30, eng: 27.5 }, st: "pconsult" },
    monitor:    { label: "Project monitoring",    group: "mgmt", pct: { bld: 25, eng: 22.5 }, st: "monitor" },
    quality:    { label: "Quality inspection",    group: "mgmt", pct: { bld: 15, eng: 15 },   st: "quality" }
  };
  const contractsFor = (sel) => { const w = WORK[sel.work] || WORK.building; return w.group === "building" ? BUILDING_CONTRACTS : w.group === "eng" ? ENG_CONTRACTS : MGMT_CONTRACTS; };

  window.FEE_MODULES = window.FEE_MODULES || {};
  window.FEE_MODULES.sacqsp = {
    id: "sacqsp",
    discipline: "Quantity surveying",
    council: "South African Council for the Quantity Surveying Profession (SACQSP)",
    country: "South Africa",
    notice: "Board Notice 741 of 2025 (2024 Guideline Tariff)",
    gazette: "Government Gazette No. 52152, 21 February 2025",
    effectiveYear: 2024,
    sourceUrl: "https://www.gov.za/sites/default/files/gcis_document/202502/52152bod741.pdf",
    guidelineWording: "This Guideline Tariff of Professional Fees is not prescriptive, but merely a guideline of what is deemed to be fair and reasonable for the services rendered; the prerogative of the client and the quantity surveyor to negotiate a fee remains.",
    costOfWorksNote: "Value for fee purposes excludes VAT. For building works, mechanical and electrical installations and civil engineering works ancillary to the building are excluded unless the quantity surveyor is appointed for them (clause 10.49.10).",
    feeLabel: "Basic fee (clause 2.2.1)",
    vatRate: 0.15,
    selectors: [
      { id: "work", type: "select", label: "Category of work", default: "building",
        options: Object.keys(WORK).map((k) => ({ id: k, label: WORK[k].label })) },
      { id: "contract", type: "select", label: "Contract type", default: "boq",
        options: (sel) => contractsFor(sel).map((c) => ({ id: c.id, label: c.label })) },
      { id: "multi", type: "seg", label: "Procurement", default: "single",
        options: [{ id: "single", label: "One contract" }, { id: "m10", label: "Multiple, principal contractor +10%" }, { id: "m20", label: "Multiple, none appointed +20%" }] },
      { id: "adjust", type: "number", label: "Adjustment factor (clause 2.2.2: risk, complexity, market; 1,00 = none)", default: 1, step: 0.05, min: 0.1, max: 3 }
    ],
    resolve(sel) {
      const w = WORK[sel.work] || WORK.building;
      const contracts = contractsFor(sel);
      const c = contracts.find((x) => x.id === sel.contract) || contracts[0];
      const pct = w.pct[c.id] !== undefined ? w.pct[c.id] : 100;
      const multi = sel.multi === "m10" ? 1.10 : sel.multi === "m20" ? 1.20 : 1;
      const adjust = Math.min(3, Math.max(0.1, Number(sel.adjust) || 1));
      const stKey = multi !== 1 ? "multi" : (w.st || c.st || "boq");
      const factor = pct / 100 * multi * adjust;
      return {
        brackets: BASIC,
        factor,
        stageKey: stKey,
        stages: mk(APPORTION[stKey]),
        summary: [`${w.label} · ${c.label}`, `Appropriate percentage: ${pct}%`].concat(multi !== 1 ? [`Multiple procurement contracts: fee increased by ${Math.round((multi - 1) * 100)}%`] : []).concat(adjust !== 1 ? [`Adjustment factor: ${adjust.toFixed(2)}`] : []),
        factorLabel: `Appropriate percentage ${pct}%${multi !== 1 ? ` × ${multi.toFixed(2)}` : ""}${adjust !== 1 ? ` × adjustment ${adjust.toFixed(2)}` : ""}`
      };
    },
    repeatedBuildings: {
      stages14Percent: 60,
      stageIds: ["1", "2", "3", "4", "5", "6"],
      note: "Replication of a prototype (clauses 2.3 and 2.4): 60% of the applicable appropriate percentage on each repeat, prototypes at the full percentage."
    },
    disbursementAttendancePercent: 0,
    disbursementNote: "Disbursements (clause 8) are recovered at cost.",
    disbursementCategories: [
      "Travel and subsistence", "Accommodation", "Printing and reproduction of bills and documents", "Courier and postage",
      "Specialist services", "Statutory fees", "Software and data", "Other (agreed with the client)"
    ],
    hourlyRates: [
      { role: "Registered professional principal: up to 5 years", rate: 1412 },
      { role: "Registered professional principal: 5 to 10 years", rate: 2823 },
      { role: "Registered professional principal: over 10 years", rate: 3986 },
      { role: "Specialist work (over 10 years)", rate: 4982 }
    ],
    // Board Notice 778 of 2025: other personnel at 27c per hour for each R100 of gross annual remuneration.
    hourlyFormula: {
      basis: "gross annual remuneration",
      categories: [{ id: "other", label: "Other personnel (not a registered principal)", cents: 27 }]
    },
    hourlyNote: "SACQSP guideline time charge, Board Notice 778 of 2025, effective 1 May 2024, excluding VAT. Other personnel: 27c per hour for each R100 of gross annual remuneration ('From annual cost')."
  };
})();
