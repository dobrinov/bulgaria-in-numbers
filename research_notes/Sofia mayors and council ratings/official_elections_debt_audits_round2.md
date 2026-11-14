# Sofia Municipality — official elections, debt, budget and audit figures (round 2)

Access notes (read first):
- Retrieved directly (curl) and parsed from the original PDF/DOC/XLSX files: sofia.bg, council.sofia.bg, bulnao.government.bg. Figures from these are **official primary data**.
- **Not retrieved:** results.cik.bg, cik.bg, portal.cik.bg, mi2003/mi2007.cik.bg and minfin.bg answer plain HTTP requests with a Cloudflare "Just a moment… enable JavaScript" bot challenge (HTTP 403) even with a browser User-Agent. I did not drive a browser through that challenge. web.archive.org also returned 403. The session's web-search quota ran out after one search, so press articles could not be located either.
- Consequence: **no official CIK vote counts are in this file.** Election figures below are secondary (Wikipedia) and labelled as such.
- All money is nominal. BGN until 2025; the 2026 budget documents are in EUR (fixed rate 1 EUR = 1.95583 BGN).

## 1. Mayor of Sofia elections — votes, %, turnout

### Takeaway
Official CIK tables could not be downloaded, so only secondary figures are available: full vote counts for 2023, percentages for 2019, 2015, 2009, 2007, 2005, 2003 and 1999, and nothing for 1995 or 2011. Treat every number in this section as medium confidence until checked against results.cik.bg.

### Cited Findings

| Election | Round | Candidate (party) | Votes | % | Turnout in Sofia | Source (secondary) |
|---|---|---|---|---|---|---|
| 2023 (29 Oct / 5 Nov) | 1 | Vasil Terziev (PP–DB) | 119,121 | 31.80 | 36.04% | [en.wikipedia](https://en.wikipedia.org/wiki/2023_Sofia_mayoral_election) |
| | 1 | Vanya Grigorova (BSP) | 80,875 | 21.59 | | same |
| | 1 | Anton Hekimyan (GERB–SDS) | 66,792 | 17.83 | | same |
| | 1 | Deyan Nikolov (Vazrazhdane) | 29,052 | 7.76 | | same |
| | 1 | Vili Lilkov (Blue Sofia) | 21,356 | 5.69 | | same |
| | 1 | Ivaylo Valchev (ITN) | 11,861 | 3.17 | | same |
| | 1 | Radostin Vasilev (ind.) | 9,450 | 2.52 | | same |
| | 2 | Vasil Terziev | 175,044 | 48.20 | 34.64% | same |
| | 2 | Vanya Grigorova | 170,258 | 46.89 | | same |
| 2019 (27 Oct / 3 Nov) | 1 | Yordanka Fandakova (GERB) | n/f | 36.37 | 42.82% (derived, see Inferences) | [en.wikipedia](https://en.wikipedia.org/wiki/2019_Bulgarian_local_elections) |
| | 1 | Maya Manolova (ind., BSP-backed) | n/f | 27.79 | | same |
| | 1 | Borislav Ignatov (Democratic Bulgaria) | n/f | 12.20 | | same |
| | 1 | Boris Bonev (ind., Spasi Sofia) | n/f | 10.77 | | same |
| | 1 | Angel Dzhambazki (VMRO) | n/f | 3.90 | | same |
| | 1 | "None of the above" | n/f | 2.32 | | same |
| | 1 | Volen Siderov (Ataka) | n/f | 1.44 | | same |
| | 2 | Yordanka Fandakova | 209,542 | 49.98 | 40.02% (derived) | % [en.wikipedia](https://en.wikipedia.org/wiki/2019_Bulgarian_local_elections); votes [bg.wikipedia, Фандъкова](https://bg.wikipedia.org/wiki/Йорданка_Фандъкова) |
| | 2 | Maya Manolova | n/f | 45.13 | | en.wikipedia, same |
| | 2 | "None of the above" | n/f | 4.89 | | same |
| 2015 (25 Oct) | 1 | Yordanka Fandakova (GERB) — elected in round 1 | n/f | 60.17 | n/f | [bg.wikipedia, Местни избори 2015](https://bg.wikipedia.org/wiki/Местни_избори_в_България_(2015)); her biography page gives 60.13% — [bg.wikipedia, Фандъкова](https://bg.wikipedia.org/wiki/Йорданка_Фандъкова) |
| 2011 (23 Oct) | 1 | Yordanka Fandakova (GERB) — won | n/f | n/f | n/f | [bg.wikipedia, Фандъкова](https://bg.wikipedia.org/wiki/Йорданка_Фандъкова) (no figure given) |
| 2009 partial (15 Nov) | 1 | Yordanka Fandakova (GERB) | n/f | 66.23 | 23.17% | [en.wikipedia, Fandakova](https://en.wikipedia.org/wiki/Yordanka_Fandakova) |
| | 1 | Georgi Kadiev (BSP) | n/f | 27.71 | | same |
| 2007 (28 Oct) | 1 | Boyko Borisov (GERB) — elected in round 1 | n/f | 53.43 | n/f | [bg.wikipedia, Местни избори 2007](https://bg.wikipedia.org/wiki/Местни_избори_в_България_(2007)) |
| | 1 | Martin Zaimov (Alliance for Sofia: DSB+SDS) | n/f | 17.77 | | same |
| | 1 | Brigo Asparuhov (BSP) | n/f | 15.48 | | same |
| | 1 | Slavi Binev (Ataka) | n/f | 4.02 | | same |
| | 1 | Antonia Parvanova (NDSV) | n/f | 2.55 | | same |
| | 1 | Titi Papazov (Democratic Party) | n/f | 1.73 | | same |
| | 1 | Yuliana Doncheva (Novoto vreme) | n/f | 1.24 | | same |
| 2005 partial | 2 | Boyko Borisov (ind.) beat Tatyana Doncheva (BSP) | n/f | 68.5 | n/f | [bg.wikipedia, Борисов](https://bg.wikipedia.org/wiki/Бойко_Борисов) |
| 2003 | 1 | Stefan Sofiyanski (SSD) | n/f | "30%" | n/f | [bg.wikipedia, Софиянски](https://bg.wikipedia.org/wiki/Стефан_Софиянски) |
| | 2 | Stefan Sofiyanski beat Stoyan Aleksandrov (BSP) | n/f | "54%" | n/f | same |
| 1999 (16 Oct) | 1 | Stefan Sofiyanski (ODS) beat Rumen Ovcharov (BSP) | n/f | "69%" | 51.6% (already in earlier notes) | same |
| 1995 | — | Stefan Sofiyanski elected (SDS won Sofia) | n/f | n/f | n/f | [bg.wikipedia, Местни избори 1995](https://bg.wikipedia.org/wiki/Местни_избори_в_България_(1995)) |

n/f = not found.

- Borisov was sworn in as mayor on 10 November 2005 — [bg.wikipedia, Борисов](https://bg.wikipedia.org/wiki/Бойко_Борисов)
- 2023 turnout fell 6.78 pp in round 1 and 5.38 pp in the runoff versus 2019 — [en.wikipedia](https://en.wikipedia.org/wiki/2023_Sofia_mayoral_election)

### Inferences
- 2019 Sofia turnout derived from the 2023 page's deltas: round 1 = 36.04 + 6.78 = 42.82%; runoff = 34.64 + 5.38 = 40.02%. This matches the "roughly 43%" in the earlier notes.
- 2019 runoff: 209,542 votes at 49.98% implies about 419,250 ballots counted in the denominator (computed).
- 2015: 60.17% (election page) vs 60.13% (biography) is an unresolved small conflict; CIK would settle it.

### Gaps
- Official CIK vote counts for every year except (secondarily) 2023; all figures for 1995 and 2011; first-round opponents' results for 1999, 2003, 2005 and 2015; turnout for 1995, 2003, 2005, 2007, 2011, 2015.
- Official pages to check when access is possible: `results.cik.bg/mi2023/tur1/rezultati/2246.html` (and `tur2`), `results.cik.bg/mi2019/tur1/rezultati/2246.html`, `results.cik.bg/minr2015/tur1/mestni/2246.html`, `results.cik.bg/mipvr2011/tur1/mestni/2246.html` (the 2011 path is the one cited by English Wikipedia; `results.cik.bg/tur1/mestni/2246.html` was my guess and is unverified).

## 2. Sofia Municipal Council elections — votes and % per list

### Takeaway
No official vote counts per list were obtained. The only additions to the earlier notes are a fuller 2019 percentage table; the 1999 "Radicals" question and the 2011 VMRO seat question remain open, with the available evidence pointing to one VMRO seat.

### Cited Findings
- 2019, % of valid votes by list: GERB–SDS 32.68; BSP 18.05; Democratic Bulgaria 14.52; Boris Bonev (independent) 8.55; VMRO 4.82; Ataka 1.61; DPS 1.27; Glas Naroden 1.16; Vazrazhdane 1.08; "Greens" 1.04; ABV 0.95; others 8.74 — [en.wikipedia](https://en.wikipedia.org/wiki/2019_Bulgarian_local_elections) (cites results.cik.bg)
- 2011: VMRO is shown with **1 seat** and 1.8%, in a table whose stated source is the CIK page `results.cik.bg/mipvr2011/tur1/mestni/2246.html`; listed seats sum to 61 (33+15+8+2+2+1) — [en.wikipedia](https://en.wikipedia.org/wiki/2011_Bulgarian_local_elections)
- 2007: GERB 46.38% / 33 seats; BSP 16.47% / 12; Alliance for Sofia 15.67% / 11; Ataka 4.78% / 3; NDSV 2.19% / 2 — [bg.wikipedia](https://bg.wikipedia.org/wiki/Местни_избори_в_България_(2007)) (already in earlier notes; re-read from page source)
- 2003: the English page's table (BSP 26.6%, SDS 23.3%, SSD 21.0%, BZNS-NS–DP 9.7%, NDSV 6.1%) cites a Dnevnik archive page; its prose ("BSP roughly 33%, SDS 21%") cites bTV — [en.wikipedia](https://en.wikipedia.org/wiki/2003_Bulgarian_local_elections). The two do not agree.
- 1999: the Central Commission's printed "Бюлетин за резултатите от местните избори, 1999 г." (430 pages, by province) exists only as a physical library item at IME, not online — [IME library catalogue](http://library.ime.bg/byuletin-za-rezultatite-ot-mestnite-izbori-proizvedeni-na-16-i-23-oktomvri-1999g-/)

### Inferences
- VMRO 2011: with the council's own member list (earlier notes) and the CIK-cited table both giving 1 seat and a total of 61, the "2 seats" in Bulgarian Wikipedia's council article is most likely the error. Not confirmed on the CIK page itself.
- The 2003 prose figure of "33%" for BSP may refer to something other than the council list (e.g. the mayoral first round); unverified.

### Gaps
- Votes per list and turnout for 1995, 1999, 2003, 2007, 2011, 2015, 2019, 2023 from CIK.
- Whether БДС "Радикали" ran its own list in 1999: no new evidence. The printed 1999 bulletin at the IME library would settle it.

## 3. Municipal debt of Sofia Municipality by year

### Takeaway
A continuous official series now exists for end-2010 to end-2025: debt rose from BGN 445.7 m (2010) to BGN 874.7 m (end-2025, about EUR 447 m), with the sharpest rises in 2016, 2018, 2024 and 2025. Nothing official was found for years before 2010 (the Ministry of Finance register is blocked), and end-2013 is missing.

### Cited Findings

Municipal debt outstanding at 31 December, nominal BGN (debt under the Municipal Debt Act; excludes debt of municipal companies):

| Year-end | Debt (BGN) | New debt drawn in year | Principal repaid | Interest and fees paid | Source |
|---|---|---|---|---|---|
| 2010 | 445,665,390 | | | | National Audit Office debt audit 2011–2012 — [bulnao](https://www.bulnao.government.bg/bg/documents/1607/ODSO_last_2_zasedanie_TRK_E_Accept_260913.doc) |
| 2011 | 477,663,915 | | | | same |
| 2012 | 487,848,949 | | | | same |
| 2013 | not found | | | | |
| 2014 | 531,466,634 | | | | Annex 6 to 2014 report — [sofia.bg](https://www.sofia.bg/documents/20127/1649146/prill6+31+12+2014.pdf/4e53b7b3-9152-4d10-9389-3aa23fe757b8) |
| 2015 | 570,582,679 | | | | Annex 6 (scanned) and opening balance of the 2016 table — [sofia.bg 2015 year page](https://www.sofia.bg/2015-financial-year) |
| 2016 | 642,678,386 | 78,301,857 | 16,784,760 | 17,865,520 | Annex 6, 2016 — [sofia.bg 2016 year page](https://www.sofia.bg/2016-financial-year) |
| 2017 | 628,497,491 | 19,580,280 | 21,268,125 | 17,703,746 | "Информация за общинския дълг към 31.12.2017" — [sofia.bg 2017 year page](https://www.sofia.bg/2017-financial-year) |
| 2018 | 715,320,415 | 109,526,480 | 32,011,649 | 17,963,251 | Annex 6, 2018 — [sofia.bg](https://www.sofia.bg/documents/20127/1650227/%D0%9F%D0%A0%D0%98%D0%9B%D0%9E%D0%96%D0%95%D0%9D%D0%98%D0%95+%E2%84%96+6.pdf/447bf77d-51e0-45ea-a5c6-c9ffed1ef286) |
| 2019 | 726,672,166 | 43,028,260 | 35,932,954 | 18,249,681 | Annex 6, 2019 — [sofia.bg 2019 year page](https://www.sofia.bg/2019-financial-year) |
| 2020 | 686,333,234 | not parsed | not parsed | not parsed | opening balance in the 2021 table — [sofia.bg 2021 year page](https://www.sofia.bg/2021-financial-year) |
| 2021 | 646,744,109 | 236,252 | 36,661,730 | 16,419,185 | Annex 6, 2021 — same |
| 2022 | 638,738,688 | 35,204,940 | 36,481,019 | 15,342,132 | Annex 6, 2022 — [sofia.bg](https://www.sofia.bg/documents/d/guest/2023-10-03-prilozenie-6-informacia-za-obsinskia-d-lg) |
| 2023 | 679,899,893 | 59,499,900 | 35,467,438 | 15,148,342 | Annex 6, 2023 — [sofia.bg](https://www.sofia.bg/documents/d/guest/prilozenie-6-informacia-za-obsinskia-d-lg) |
| 2024 | 757,966,352 | 140,819,760 | 60,093,638 | 17,633,875 | Annex 6, 2024 — [sofia.bg](https://www.sofia.bg/documents/d/guest/prilozenie-6-6) |
| 2025 | 874,660,252 | 160,118,414 | 37,922,499 | 22,055,495 | Annex 6, 2025 (xlsx) — [sofia.bg](https://www.sofia.bg/documents/d/guest/2026-08-19-prilozenie-6-informacia-za-obsinskia-d-lg-izdadenite-obsinski-garancii-d-lga-na-licata-po-cl-8a-ot-zakona-za-obsinskia-d-lg) |

- Municipal guarantees outstanding: 0 in every year 2016–2024 (a bank guarantee contract for EUR 3,675,000 was signed in 2018 but was not active at 31.12.2018) — Annex 6 documents above; [sofia.bg 2019 year page](https://www.sofia.bg/2019-financial-year)
- Composition at end-2010: five long-term loans from international lenders, four drawn (CEB for 75 Roma homes; EBRD for public-transport rehabilitation; EIB "Sofia Metro"; JBIC for the metro). End-2011 and end-2012: seven loans — [bulnao debt audit](https://www.bulnao.government.bg/bg/documents/1607/ODSO_last_2_zasedanie_TRK_E_Accept_260913.doc)
- Debt ceilings stated in the budget ("maximum debt at year-end"): 2017: BGN 634,825,091; 2019: 709,311,913; 2020: 690,334,358; 2021: 668,517,535; 2022: 728,305,949; 2023: 711,720,234; 2024: 895,541,192; 2026: **EUR 476,243,718** (confirms the unit that was unclear in the earlier notes) — "Справка по чл. 39 ЗПФ" on the year pages, e.g. [2024](https://www.sofia.bg/documents/d/guest/prilozenie-6-spravka-po-cl-39-ot-zpf), [2026](https://www.sofia.bg/documents/d/guest/2026-10-06-10-prilozenie-6-spravka-za-maksimalnia-razmer-na-d-lga)
- New debt planned: up to EUR 30 m (BGN 58,674,900) in the 2018 budget; up to BGN 29 m in 2019; none declared in 2020, 2023, 2024 and 2026 budgets — same documents.
- A Eurobond loan was raised in 1999 and repaid in 2002; the 2001 budget set aside BGN 10 m in government securities for the repayment — National Audit Office audits of the municipality for 2001 and 2002 — [bulnao 2001](https://www.bulnao.government.bg/bg/documents/1583/STOLICHNA_02.doc), [bulnao 2002](https://www.bulnao.government.bg/bg/documents/1490/STOLICHNA-2002.doc). The amount is not stated in the passages read.

### Inferences
- End-2025 debt of BGN 874,660,252 equals about EUR 447.2 m at the fixed rate (computed). The 2026 ceiling of EUR 476.2 m therefore allows roughly EUR 29 m of net new borrowing.
- Requested benchmark years: 2005 not found; 2009 not found (nearest: BGN 445.7 m at end-2010); 2015: 570.6 m; 2019: 726.7 m; 2023: 679.9 m; 2024: 758.0 m; 2025: 874.7 m.
- S&P's "direct debt" (650 / 639 / 655e for 2021–2023, earlier notes) is close to but not identical with the municipality's own figures (646.7 / 638.7 / 679.9); the 2023 gap exists because S&P's number was an estimate made before year-end accounts.
- Debt was nearly flat 2018–2023 (715 → 680 m) and then rose 29% in two years (2023 → 2025).

### Gaps
- Debt for 1996–2009 and end-2013. The Ministry of Finance register (minfin.bg/bg/1127) is behind a bot challenge. The municipality's year pages exist only from 2014 (pages for 2008–2013 return 404).
- 2020 flows (drawn/repaid) were not parsed from the 2020 annex.
- Size of the 1999 Eurobond in an official source.

## 4. Adopted budget totals and capital-programme execution

### Takeaway
Official adopted ("initial") budgets were retrieved for 2018–2025: from BGN 1.56 bn (2018) to BGN 2.87 bn (2025) including EU-fund accounts. The capital programme was executed at about 61–73% of the updated plan in 2022–2025, and the municipality itself reports the same recurring causes of delay each year.

### Cited Findings

Initial budget as adopted by the council (nominal BGN):

| Year | Council decision | Budget part | EU-funds accounts | Total | Source |
|---|---|---|---|---|---|
| 2018 | No. 4 of 25.01.2018 | 1,225,571,200 | (difference) | 1,555,913,616 | [2018 report](https://www.sofia.bg/2018-financial-year) |
| 2019 | No. 32 of 31.01.2019 | 1,445,374,385 | 305,368,747 | 1,750,743,132 | [2019 report](https://www.sofia.bg/2019-financial-year) |
| 2020 | No. 42 of 06.02.2020 | 1,468,841,866 | 260,665,492 | 1,729,507,358 | [2020 report](https://www.sofia.bg/2020-financial-year) |
| 2021 | No. 107 of 25.02.2021 | 1,595,224,127 | 296,230,374 | 1,891,454,501 | [2021 report](https://www.sofia.bg/2021-financial-year) |
| 2022 | No. 205 of 31.03.2022 | 1,827,973,414 | 272,952,048 | 2,100,925,462 | [2022 report](https://www.sofia.bg/documents/d/guest/2023-10-03-otcet-za-kasovoto-izp-lnenie-na-sbornia-budzet-na-stolicna-obsina-za-2022-g-) |
| 2023 | No. 814 of 14.09.2023 | 2,269,143,667 | 295,634,322 | 2,564,777,989 | [2023 report](https://www.sofia.bg/documents/d/guest/otcet-za-kasovoto-izp-lnenie-2023-1) |
| 2024 | No. 49 of 28.03.2024 | 2,519,226,657 | 112,434,200 | 2,631,660,857 | [2024 report](https://www.sofia.bg/documents/d/guest/otcet-za-kasovoto-izp-lnenie-2024-godina) |
| 2025 | No. 475 of 26.06.2025 | 2,753,965,485 | 116,462,500 | 2,870,427,985 | [2025 report](https://www.sofia.bg/documents/d/guest/2026-08-19-otcet-za-kasovoto-izp-lnenie-2025-g-) |

Other budget facts:
- 2001: expenditure in the initially adopted budget BGN 382,076,172 — [bulnao audit for 2001](https://www.bulnao.government.bg/bg/documents/1583/STOLICHNA_02.doc)
- 2002: budget revenue executed BGN 410,194,757 = 99.7% of the adopted budget — [bulnao audit for 2002](https://www.bulnao.government.bg/bg/documents/1490/STOLICHNA-2002.doc)
- 2005: budget adopted on 24.02.2005 — [bulnao capital-investment audit](https://www.bulnao.government.bg/bg/documents/1937/Doklad-Stolichna-kap-invest-070308.doc)
- 2010: revenue executed at 86% of the updated plan — [bulnao financial audit 2010](https://www.bulnao.government.bg/bg/documents/4276/1-Doklad_GFO_StolObstina_2010.doc)
- 2013: own revenues BGN 487.0 m against an updated budget of 529.3 m (92.0%); waste fee 171.6 m against 183.6 m — [report to the 2014 draft budget](https://www.sofia.bg/documents/20127/1649228/doklad_proektobudzhet_+2014.pdf/c5ca3c43-5613-48c6-9adf-8b62288c107e)
- 2018: updated budget 1,417,274,318; executed 1,212.70 m (85.6%); own revenues 709.27 m — 2018 report (link above)
- 2019: updated budget 1,539,999,889; revenue side executed 1,531 m including 173.2 m cash carried over; own revenues 703.15 m against 739.11 m (95.1%) — 2019 report
- 2020: revenue side executed 1,382.7 m including 171.3 m cash carried over; own revenues 690.1 m against 756.5 m (91.2%) — 2020 report
- 2023: own revenues 962.22 m against 961.16 m (100.1%); tax revenues 471.54 m — 2023 report
- 2024: tax revenues 543.34 m (99% of 548.89 m plan) — 2024 report
- 2025: tax revenues 638.7 m (98% of 651.4 m plan) — 2025 report

Capital programme, updated plan versus actual (nominal BGN, including EU-funded projects unless stated):

| Year | Updated plan | Actual | Rate stated by the municipality | Source |
|---|---|---|---|---|
| 2020 | n/f | n/f | 80.07% once unpaid completed works (12.5 m) are added | 2020 report |
| 2021 | 257,814,113 (budget part only) | 166,849,077 | "close to 75%" after adjusting for unpaid/unbilled works | 2021 report |
| 2022 | 638,471,022 | 439,256,443 | "close to 78%" after adjustments | 2022 report |
| 2023 | 826,743,513 | 605,520,509 | 73.24% | 2023 report |
| 2024 | 726,456,757 | 445,353,098 | not stated; about BGN 62 m of the metro line 3 stage 3 loan was not drawn, cutting execution by "6 per cent" | 2024 report |
| 2025 | 721,050,261 | 495,952,931 | 68.78% | 2025 report |

- Capital spending in the budget part alone (excluding EU accounts): 2023: 368,544,449; 2024: 390,359,350; 2025: 399,444,868 — 2023, 2024, 2025 reports.
- Reasons for delay repeated in every report 2021–2025: appeals against contractor-selection procedures, land acquisition and expropriation appeals, planning and approval procedures, incomplete underground cadastre; in 2023 also the late state and municipal budget (adopted 14.09.2023) — 2022 and 2023 reports.
- Overdue liabilities at year-end: 2019: BGN 766.9 thousand; 2020: 3.23 m; 2021: 1.06 m; 2022: 770 thousand — 2019–2022 reports.

### Inferences
- Unadjusted execution rates computed from the table: 2021 budget part 64.7%; 2022 68.8%; 2024 61.3%. The municipality's "close to 75%/78%" figures add work done but not yet paid, so they are not comparable with the 2023 and 2025 rates.
- The capital programme was under-executed by BGN 200–280 m every year 2022–2025, which supports S&P's "generally weak" assessment quoted in the earlier notes.
- Initial totals here are slightly below the "framework" figures the municipality quotes in EUR (earlier notes) for 2023–2025 after conversion, but agree to within rounding (e.g. 2023: 2,564.8 m BGN ≈ EUR 1.31 bn).

### Gaps
- Adopted totals for 1996–2000, 2003–2009, 2011, 2016, 2017 were not found; 2001, 2002, 2010 and 2013 have partial figures only. The documents for 2014–2017 are on the sofia.bg year pages but their narrative reports were not parsed for totals.
- Capital plan and actual for 2014–2019 are in Annex 5 of each year's report (downloaded but not tabulated).

## 5. National Audit Office (Сметна палата) reports on Sofia Municipality

### Takeaway
The Audit Office's document search lists about 50 reports on the municipality, its districts and companies from 2002 to 2025. Financial statements have received clean opinions every year since 2010 (with "emphasis of matter" in 2010–2014 and 2016), while the performance audits of 1998–2008 are sharply critical of property disposals, concessions and capital spending.

### Cited Findings

Financial audits of the annual accounts — opinion by year:

| Accounts year | Opinion | Adopted | Source |
|---|---|---|---|
| 2010 | Unqualified with emphasis of matter ("заверка без резерви с обръщане на внимание") | 2011 | [bulnao](https://www.bulnao.government.bg/bg/documents/4276/1-Doklad_GFO_StolObstina_2010.doc) |
| 2011 | Unqualified with emphasis of matter | 2012 | [bulnao](https://www.bulnao.government.bg/bg/documents/4445/Doklad_GFO_StolOb2011_r.doc) |
| 2012 | Unqualified with emphasis of matter | 2013 | [bulnao](https://www.bulnao.government.bg/bg/documents/4794/Doklad_GFO_Stolichna_obstina_2012_r_.doc) |
| 2013 | Unqualified with emphasis of matter | 2014 | [bulnao](https://www.bulnao.government.bg/bg/documents/5182/gfo-stolichna-2013.doc) |
| 2014 | Unqualified with emphasis of matter | 2015 | [bulnao](https://www.bulnao.government.bg/bg/documents/5505/gfo-st-obshtina-050216.doc) |
| 2015 | Unqualified ("заверка без резерви") | 2016 | [bulnao](https://www.bulnao.government.bg/bg/documents/5563/gfo-stolichna-2015.doc) |
| 2016 | Certified with emphasis of matter | Decision 281 of 02.08.2017 | [bulnao](https://www.bulnao.government.bg/bg/documents/5911/so-stol-ob-2016.doc) |
| 2017 | Opinion text not readable (file is an unrendered template) | Decision 328 of 16.08.2018 | [bulnao](https://www.bulnao.government.bg/bg/documents/6139/GFO_Stolichna_2017.docx) |
| 2018 | Unmodified | Decision 173 of 04.07.2019 | [bulnao](https://www.bulnao.government.bg/bg/documents/6354/gfo-so-2018.pdf) |
| 2019 | Unmodified (earlier notes) | — | [bulnao](https://www.bulnao.government.bg/media/documents/gfo-so-2019.pdf) |
| 2020 | Unmodified | Decision 123 of 27.05.2021 | [bulnao](https://www.bulnao.government.bg/bg/documents/11594/GFO_%D0%A1%D0%9E_20_nemod.pdf) |
| 2021 | Unmodified | Decision 395 of 26.10.2022 | [bulnao](https://www.bulnao.government.bg/bg/documents/13193/GFO_Nemodif_SO_2021.pdf) |
| 2022 | Unmodified | Decision 401 of 13.09.2023 | [bulnao](https://www.bulnao.government.bg/bg/documents/14029/GFO_Nemod_Stolichna_2022.pdf) |
| 2023 | Unmodified | Decision 425 of 03.10.2024 | [bulnao](https://www.bulnao.government.bg/bg/documents/14809/GFO_Stol_obshtin_102024_HOP7FPQ.pdf) |
| 2024 | Unmodified | Decision 447 of 05.12.2025 | [bulnao](https://www.bulnao.government.bg/bg/documents/15635/GFO_Stol_obshtina_nemod_2024.pdf) |

Performance and compliance audits read (findings quoted from the reports' conclusions):

| Report | Audited period | Main findings | Source |
|---|---|---|---|
| Management and disposal of private municipal real estate | 01.01.1998 – 31.12.2005 | Conclusion: management and disposal were "ineffective and inefficient"; council and mayor "did not create legal and organisational conditions … in defence of the municipality's interests"; disposals were made without any council-defined property policy. Sales were 71.65% of all disposals: 3,124 sales under bound competence and 68 discretionary, of which only 66 by auction and 2 by tender (2.13% of sales). | [bulnao](https://www.bulnao.government.bg/bg/documents/1985/stolichna-imustestvo210907.doc) |
| Legality of concession revenues and related spending — Sofiyska voda part | up to 31.12.2003 | No single archive of the water concession, so the team could not gather sufficient evidence for an opinion; original concession documents were held by a private firm ("Омонит" ООД) that is not a party to the contract; no rules for coordinating the municipality's control; accounting did not reflect the public assets handed over. Recommendation: mayor to report annually to the council on concession control. | [bulnao](https://www.bulnao.government.bg/bg/documents/1218/Doklad_SofVoda_Konces.doc) |
| Legality of concession revenues and related spending — full report incl. cleaning concessions | up to 31.12.2003 | Council decisions and the mayor's contracts provide for **no concession fee**, contrary to the 1997 and 1999 concession ordinances; concessionaires were allowed to transfer their rights to third parties in breach of the Municipal Property Act rules; winter-cleaning price terms allowed payment regardless of area actually cleaned. | [bulnao](https://www.bulnao.government.bg/bg/documents/1347/Concesii_Sofia.doc); follow-up on recommendations: [bulnao](https://www.bulnao.government.bg/bg/documents/4133/kontrol-preporaki-stolichna-obshtina_-03-07.doc) |
| Budget spending on capital investment | 2005 | No criteria for selecting projects; capital spending tracked outside the accounting system, so no reliable per-project data; design costs of the municipal enterprise "София – проект" not capitalised, giving unrealistic asset values; the Finance Minister made five upward corrections to the capital subsidy totalling BGN 12,341,800. | [bulnao](https://www.bulnao.government.bg/bg/documents/1937/Doklad-Stolichna-kap-invest-070308.doc) |
| Swaps of private municipal real estate | 01.01.2006 – 31.03.2008 | 140 swap deals completed; no strategy or programme for property disposal and no housing policy, so effectiveness could not be judged; council reports insufficiently justified; auctions/tenders not used; breaches of internal rules on valuations create a risk that the municipality's interests were not protected. | [bulnao](https://www.bulnao.government.bg/bg/documents/1843/Doklad-zameni-chos-imoti-SO-2006-2008-18020.doc) (file name truncated in the listing; the report is listed under document id 1843) |
| Effectiveness of control over the street-cleaning concession contracts | contracts in force at 30.06.2008 | Investment plans were never checked, so no penalties for missed investment; penalties fell more than five-fold between 2005 (about BGN 600 thousand) and 2007 (BGN 58 thousand); the municipality has no fallback provider if a concessionaire fails; unused waste-fee revenue is routinely spent on other activities, contrary to the Local Taxes and Fees Act. | [bulnao](https://www.bulnao.government.bg/bg/documents/795/Doklad-kontrol-kontsesii-SO-08-odob.doc) |
| Award and performance of public procurement | 01.01.2010 – 30.09.2011 | Some contracts signed without the required three offers; deadlines for notifying the procurement register not met; no assigned responsibility for keeping procurement files (fixed during the audit). | [bulnao](https://www.bulnao.government.bg/bg/documents/572/Oditen.doklad_SO_251012.doc) |
| Management of municipal debt and guaranteed debt | 01.01.2011 – 31.12.2012 | Source of the 2010–2012 debt figures in section 3; small discrepancies between the municipality's and the Ministry of Finance register's payment data (e.g. BGN 115,382 in interest and fees). Conclusions not extracted. | [bulnao](https://www.bulnao.government.bg/bg/documents/1607/ODSO_last_2_zasedanie_TRK_E_Accept_260913.doc) |
| Exercise of the municipality's rights in companies it owns | 01.01.2013 – 31.12.2014 (adopted by Decision 035 of 11.02.2016) | No rules on when council consent is needed for leasing contracts; no mechanism making companies report on implementation of council decisions; control system rated "good" but it did not prevent the non-compliances found. | [bulnao](https://www.bulnao.government.bg/bg/documents/11953/od-td-stolichna-180216-r.doc) |
| Toplofikatsiya Sofia EAD | 01.01.2018 – 31.12.2020 | Follow-up reports (Dec 2023, Mar 2025): recommendation 1 (to the council chair, on control activities) and recommendation 5 (to the company's CEO, on collecting receivables) were found not implemented at the first check; some receivables had become time-barred. | [bulnao 2023](https://www.bulnao.government.bg/bg/documents/14251/PK_Toplofikacia_1223.pdf), [bulnao 2025](https://www.bulnao.government.bg/bg/documents/15026/PK_Toplofikaciq_032025_RD4LYsJ.pdf) |
| Toplofikatsiya Sofia EAD | 01.01.2007 – 30.04.2013 | Follow-up (Dec 2014): all recommendations implemented. | [bulnao](https://www.bulnao.government.bg/bg/documents/12301/pk-toplofikazia-031214.doc) |

Other reports located (titles and periods only; not read):
- Audit of the municipality and its districts for 2001 and for 2002; financial audit for 2003 — [1583](https://www.bulnao.government.bg/bg/documents/1583/STOLICHNA_02.doc), [1490](https://www.bulnao.government.bg/bg/documents/1490/STOLICHNA-2002.doc), [1364](https://www.bulnao.government.bg/bg/documents/1364/Stolicha2003.doc)
- Waste-fee funds 2004 and "Чистота" spending 2005 (summary incl. Sofia) — [1196](https://www.bulnao.government.bg/bg/documents/1196/Obobsten_Chistota.rtf)
- Renting out of municipal real estate, 2006 — [1940](https://www.bulnao.government.bg/bg/documents/1940/Doklad-Stolichna-Obshtina-ned-imoti-odob.doc) (file name truncated in listing)
- Administration of local taxes and fees, 2006 — [1876](https://www.bulnao.government.bg/bg/documents/1876/Doklad-prihodi-MDT-SO-2006-odob1.doc)
- Management of municipal kindergartens, 2007–2008 — [1789](https://www.bulnao.government.bg/bg/documents/1789/Doklad-SO-det-gradini-2007-2008-odob1.doc)
- Internal audit activity, 2008 — [1783](https://www.bulnao.government.bg/bg/documents/1783/Doklad-VO-SO-2008-odob.doc)
- Central Mineral Baths conversion into the Museum of Sofia, 1998–2008 — [810](https://www.bulnao.government.bg/bg/documents/810/Doklad-Central-Banya-SO-1998-2008-odob.doc)
- Municipal Guarantee Fund for SMEs, 2007 – mid-2009 — [1760](https://www.bulnao.government.bg/bg/documents/1760/Doklad-Stolichna_Garant-Fond-250610.doc)
- Sports development programme 2006–2010 — [1700](https://www.bulnao.government.bg/bg/documents/1700/doklad_sporta_2011.doc)
- Management and disposal of property, 2012 — [11981](https://www.bulnao.government.bg/bg/documents/11981/doklad-imoti-stolichna-2014.doc)
- Preferential-fare passenger transport and related budget flows (covers 2011–2012) — [11992](https://www.bulnao.government.bg/bg/documents/11992/od-prevoz-patnici-so-181213.doc)
- District audits: Krasno selo 2005; Izgrev 2007–mid-2008; Serdika 2018–2019 (Decision 416 of 20.09.2023); Ilinden 2019–2020 (Decision 417 of 20.09.2023; follow-up 2025) — [Ilinden](https://www.bulnao.government.bg/bg/documents/13930/OD_R_Ilinden_SO_18-20_0923.pdf), [Serdika](https://www.bulnao.government.bg/bg/documents/13931/OD_R_Serdika_18-19_0923.pdf)
- PHARE project BG 9906 "Sofiyska voda – wastewater project" (audit of the central finance unit, not the municipality) — [1547](https://www.bulnao.government.bg/bg/documents/1547/Proekt9906-Sofvoda.doc)

### Inferences
- The clean opinions since 2010 concern the accuracy of the accounts, not the quality of management; the critical material is in the performance audits, almost all of which cover periods before 2015.
- The three property and concession audits (1998–2005 property; concessions to 2003; swaps 2006–2008) make the same structural finding across two mayors: no property strategy and little competitive disposal.
- No performance audit of the municipality itself covering a period after 2014 was found other than the district and Toplofikatsiya audits and the 2017 air-quality audit in the earlier notes.

### Gaps
- **Sofia metro audit (2005):** not found. Searches of the Audit Office site for "метро" and "метрополитен" returned no metro-construction report; it may not be online.
- Publication dates for the pre-2010 reports were not extracted (the files give decision numbers of the council, not of the Audit Office). File names suggest: property 1998–2005 → 21.09.2007; capital investment 2005 → 07.03.2008; procurement → 25.10.2012; these are my reading of file names, not stated dates.
- 2017 financial-audit opinion; conclusions of the debt, kindergarten, property-2012 and preferential-transport audits.
- No audit specifically of waste treatment, public-transport operators or air quality beyond those listed was found.

## 6. Sofiyska voda concession at its October 2025 expiry

### Takeaway
The concession did not end on 6 October 2025: it was extended by 8 years and 4 months (to 2034) through a Fourth Supplementary Agreement that the council approved on 24 November 2022 and a deputy mayor signed on 28 August 2023. It was neither re-tendered nor returned to the municipality.

### Cited Findings
- Council Decision No. 898 of 24.11.2022: approves the draft Fourth Supplementary Agreement to the concession contract (signed 23.12.1999, in force 06.10.2000, amended by the First, Second and Third agreements of 23.03.2018) with Annex 20 "Investment programme of the concessionaire"; authorises the mayor to sign it **after** an opinion from the energy and water regulator (KEVR) under art. 21(3) of the water-services regulation act; adopts an indicative list of sewerage extensions (German, Busmantsi, Dimitar Milenkov, Abdovitsa, Levski V, Ovcha kupel, Gorna banya, Iliyantsi, Benkovski, Orlandovtsi and others) — [council.sofia.bg, Decision 898](https://council.sofia.bg/documents/d/guest/r-898)
- The agreement was signed on 28.08.2023 by deputy mayor Albena Atanasova (acting for the mayor) and extends the term by 8 years and 4 months, described as the maximum possible, i.e. until 2034 — report by councillors Todorov, Grigorova, Savov and Mladenov, Nov 2023 — [council.sofia.bg](https://council.sofia.bg/documents/d/guest/soa23-vk66-10856-todorov-grigorova-savov-mladenov)
- Same report (opposition councillors' claims, not findings): the council decision was taken without KEVR's opinion and the agreement was signed despite an explicitly negative KEVR opinion; the agreement fixes shareholders' return on capital at 13% (reduced from 17%), which they argue only KEVR may set; they proposed a temporary committee to examine the legality — same source.
- The concessionaire had proposed BGN 634 m of investment to 2034 in exchange for the 8-year extension (search summary of the article) — [Capital, 21 Nov 2022](https://www.capital.bg/biznes/kompanii/2022/11/21/4418195_koncesiiata_na_vik_mrejata_na_sofiia_shte_bude/)
- The contract continued to operate after October 2025: Decision No. 95 of 13.02.2025 set up a working group on small hydro plants on the water network "in cooperation with Sofiyska voda"; Decision No. 479 of 25.06.2026 adopted the council's opinion on Sofiyska voda's business plan for 2027–2031 and agreed its investment programme — [Decision 95](https://council.sofia.bg/documents/d/guest/r-095-2025), [Decision 479](https://council.sofia.bg/documents/d/guest/r-479-2026)
- Earlier: Decision No. 861 of 14.09.2023 adopted the opinion on the 2022–2026 business plan — [Decision 861](https://council.sofia.bg/documents/d/guest/r-861)

### Inferences
- 6 October 2025 plus 8 years 4 months gives an end date around 6 February 2034 (computed; the exact date was not seen in a document).
- The extension was decided by the 2019–2023 council (GERB-led) and signed in the last weeks of Fandakova's term, two months before the October 2023 election; the 2023–2027 council inherited it.

### Gaps
- Whether the temporary committee proposed in November 2023 was created and what it concluded; any court challenge or KEVR decision on the agreement; the vote count on Decision 898.
- The text of the Fourth Supplementary Agreement (Annex 1 to Decision 898) was not read.
