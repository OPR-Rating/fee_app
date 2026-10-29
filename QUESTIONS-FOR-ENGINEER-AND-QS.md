# Fee app: points to check with an engineer, a quantity surveyor, a construction project manager, a landscape architect and a property valuer

The app works out guideline fees from the gazetted tariffs. The tables themselves are copied from the gazettes and reproduce the gazettes' own worked examples exactly. The points below are where the gazette leaves something to agreement or interpretation, and where I made a choice. Each one has the question to ask.

## For a consulting engineer (ECSA, Board Notice 783 of 2025)

**1. Factors given as a range.**
The gazette gives some typical factors as a range, for example "gravel roads 0.75 to 1.50 by class" and "services for informal settlements 1.25 to 1.50". The app uses the lower value and the engineer can overtype nothing yet.
*Question:* in practice, how do you choose within the range, and should the app ask for the road class or settlement type instead?

**2. Several factors at once.**
The gazette says that where more than one factor applies, the effective factor is "typically the product of the factors involved". The app multiplies every ticked factor together.
*Question:* is that what you actually do, or are there combinations you would never multiply?

**3. Design-only factors.**
Two factors apply only to the design portion of the fee: duplication of works (0.25) and mass concrete, brickwork and cladding designed by the engineer (0.33). The app applies duplication to stages 1 to 4 only, which is what the gazette says. The 0.33 factor is currently applied to the whole fee like the other factors.
*Question:* should the 0.33 factor also be limited to stages 1 to 4?

**4. Partial service: "plus 10 percentage points".**
Clause 4.2.9 says that where not all stages are provided, the fee is the sum of the stage points "typically plus 10 percentage points". The app adds 10 points automatically whenever a stage is left out.
*Question:* is the 10 points always added, or only sometimes, and is it on the whole fee?

**5. Structural work inside a civil project.**
Table 2 gives an additional design fee on the reinforced concrete and structural steel portions of an engineering project, worked out separately on the value of that portion. The app does not do this yet.
*Question:* how often does this apply to your work, and is it worth building?

**6. Extras not built.**
Lead consulting engineer: an additional 10 percent of the team's fees (4.3.3). Principal agent: 1 percent of the cost of the works (4.3.5). Construction monitoring staff costs (4.3.2).
*Question:* which of these do you quote regularly?

**7. Hourly rates.**
ECSA publishes no rand rates. Rates are 22 cents (categories A and B), 17.5 cents (C) or 16.5 cents (D) per hour for each R100 of the person's annual cost of employment, or the DPSA indicative rates. The app asks for your own rate.
*Question:* what rates do you actually quote, so the app can offer sensible defaults?

**8. Small projects.**
The tables start at R1 050 000. Below that the gazette says lump sum or time based. The app says so and offers hours.
*Question:* is that how you handle small jobs?

## For a quantity surveyor (SACQSP, Board Notice 741 of 2025)

**1. Value for fee purposes.**
Clause 10.49.10: for building works, mechanical and electrical installations and civil works ancillary to the building are excluded from the value unless the QS is appointed for them. The app shows this as a note and leaves it to you to enter the right value.
*Question:* would you rather the app asked for the M&E and civils values separately and did the subtraction?

**2. Replication of a prototype.**
Clauses 2.3 and 2.4: replications get 60 percent of the applicable percentage. The gazette also has a separate stage split for "replication of prototype" (2.5 / 5 / 5 / 17.5 / 62.5 / 7.5). The app applies the 60 percent to the repeated units but splits the whole fee by the chosen contract type, not by the replication row.
*Question:* should the repeated portion use the replication stage split instead?

**3. Multiple procurement contracts.**
With a principal contractor the fee rises 10 percent, with none appointed 20 percent, and the stage split becomes the override row: 2.5 / 5 / 7.5 / then 15 during stage 4 and 20 during stage 5 / 45 / 5. The app treats stage 4 as 35 percent and stage 5 as 45.
*Question:* is the 20 "during stage 5" invoiced as stage 4 work or stage 5 work in practice?

**4. Adjustment factor.**
Clause 2.2.2 says an adjustment factor is applied for risk, complexity and market conditions, but gives no values. The app offers a number, default 1.00.
*Question:* what range do you typically use, and what drives it?

**5. Management and supplementary services.**
The app covers principal agency, principal consultancy, project monitoring and quality inspection. It does not cover the supplementary services in clause 2.6 (cost norms, schedules of materials, valuations, targeted procurement).
*Question:* which of those do you quote often enough to need?

**6. Hourly rates.**
The app uses the four principal rates from Board Notice 778 of 2025 (R1 412, R2 823, R3 986, R4 982 per hour). Other personnel are 27 cents per hour per R100 of gross annual remuneration, which you enter as your own rate.
*Question:* are these the rates you use, and should salaried staff rates be a preset?

## For a construction project manager (SACPCMP, Board Notice 168 of 2019)

**1. Which tariff.**
The last gazetted SACPCMP tariff is Board Notice 168 of 2019. The 2022 rebase (Board Notice 182 of 2021) went out for comment but was never gazetted as a tariff, and the 2023 notice is a policy without figures. The app uses the 2019 table and says so on the proposal.
*Question:* do you quote from the 2019 table, escalate it (and by what), or use the proposed 2022 figures? Should the app offer an escalation percentage?

**2. The table's odd joins.**
Three brackets do not meet exactly: bracket 2 ends at R176 650 but bracket 3 starts at R175 400; bracket 7 starts at R2 392 340 where bracket 6 ends at R2 392 400; bracket 9 starts at R7 992 400 where bracket 8 ends at R7 992 340. The app uses the figures as printed.
*Question:* do you treat the last two as misprints (2 392 400 and 7 992 340) or use the printed figures?

**3. Alterations and additions.**
Clause 12 adds a premium of 25% of the applicable fee. The app applies it to the whole fee when "Alterations and additions" is chosen.
*Question:* on a job that is partly new and partly alteration, do you apply the 25% to the alteration portion only, and should the app ask for that split?

**4. Separate sites, phases and sections.**
Clause 6.6 lets works on separate sites or in separately documented phases be priced per site, or at an agreed fee between that sum and the fee on the total cost. The app prices the total cost; the "repeated units" card is left at 100% (no reduction) because the tariff has no repeat rule.
*Question:* how do you price a phased or multi-site project in practice?

**5. Hourly rates.**
The gazette gives no Rand rates; clause 10.3 refers to the Department of Public Works consultant rates. The app asks for your own rate.
*Question:* which rates do you quote, so the app can offer presets?

**6. Supplementary services and termination.**
Clause 4 services (development management, health and safety agent, direct contractors, mediation) are by agreement and not built; neither is the clause 5.2 termination surcharge of 10%.
*Question:* which of these do you quote often enough to need a line in the app?

## For a landscape architect (SACLAP, Board Notice 47 of 2013 and the 2011 Fees Protocol)

**1. Which notice.**
The last gazetted SACLAP guideline fee notice that could be found is Board Notice 47 of 2013 (hourly rates and the scale of fees by project value). Later SACLAP gazettes are registration fees. The app uses the 2013 scale and says so on the proposal.
*Question:* is there a newer gazetted scale or hourly table that we missed? If not, how do you escalate the 2013 figures?

**2. Reading the scale between the gazetted points.**
The gazette lists a percentage at 17 project values (14,00% at R400 000 down to 9,90% at R9 000 000) and nothing in between. The app makes the fee exact at each listed value and draws a straight line between them (so R3 000 000 gives R307 200, an effective 10,24%). Reading the percentage off a graph instead would give about 0,2% more.
*Question:* how do you read the scale for a value between the points, and what do you use above R9 000 000 (the app holds 9,90%)?

**3. Below R400 000.**
The gazette says projects under R400 000 are "based on published hourly rates". The app shows that note and offers Hours only or Lump sum.
*Question:* is that how you handle small jobs, or do you extend the percentage upwards?

**4. Stage split and partial service.**
The stages come from the Fees Protocol (5 / 15 / 15 / 30 / 32 / 3). Partial service adds 10% of the applicable fee (clause 8); the app applies the 10% as a factor on the stages you leave ticked. The +1% principal agent and +1% principal consultant, master plans at 1% (7.1), the 15% alterations premium and the 35% + 15% contract-administration-only fee (10.9) are not built.
*Question:* which of these do you use, and is the stage split still the one you work to?

**5. Hourly rates.**
The app loads the 2013 rates (R1 440, R1 050, R790, R530, R260 per hour).
*Question:* what do you actually charge today?

## For a property valuer (SACPVP, Board Notice 138 of 2010)

**1. Which notice.**
The only gazetted SACPVP guideline professional fee notice that could be found is Board Notice 138 of 2010 (effective 1 October 2010); the council and the SA Institute of Valuers still publish it as current. The app uses it and says so on the proposal.
*Question:* is there a newer guideline, and how do you escalate the 2010 figures in a quote?

**2. The value you type.**
The app's "Value of works" field is the value of the property (or the gross annual rental for a rental valuation). The fee includes the inspection; report drafting, research and searches are extra at the hourly rate (notes (ii) and clause 2.3).
*Question:* do you quote the ad valorem fee alone, or ad valorem plus hours for the report? Should the app add a default number of report hours?

**3. Adjustments built as percentages.**
Second value for the same property +30% (clause 1.2) and revaluation within 12 months −50% (clause 1.5) are ticks that multiply the fee (both ticked = × 1,30 × 0,50).
*Question:* is that how you combine them? Which other clauses do you use often (prescribed forms +25% capped at R250, sectional title, before-and-after, part of a property, continuous valuations)?

**4. Rental valuations.**
Clause 3.0 is built on the gross annual rental, but the R1 600 minimum per determination is shown as a note, not enforced.
*Question:* should the app enforce the minimum, and do you use this tariff at all?

**5. Time charge as an alternative.**
Clause 2.2 allows a time charge instead of the tariff, provided it is not less than the ad valorem fee. The app does not compare the two.
*Question:* how often do you charge on time, and would a "whichever is higher" check help?

**6. Court and arbitration work.**
Clauses 4 and 5 (1,5 × hourly rate, R12 000 per day as arbitrator, minimum hours on postponement) are not built.
*Question:* is this part of your work, and should it be a preset?

## For both

**Stage splits are editable.** The gazette's split is loaded, and you can change any percentage. The proposal shows the percentages used.

**Everything is a guideline.** All the gazettes say the fees are not prescribed. The proposal says so in the closing note and the fee is open to negotiation.

**What would be most useful:** run two or three real past projects through the app and compare with the fee you actually proposed. Differences tell us more than any reading of the gazette.
