# Toplofikatsiya Sofia EAD: condition by year, 1995 – Nov 2026

Research date: 15 Nov 2026. Company: "Топлофикация София" ЕАД, UIC 831609046.

## How the data were obtained

- **Primary series: the company's own audited annual financial statements.**
  - 2007–2024 were downloaded from the public Commercial Register: the deed API `portal.registryagency.bg/CR/api/Deeds/831609046` and the documents at `/CR/api/Documents/<id>`. The public portal serves these without a login.
  - 2013–2020 audited statements are also on toplo.bg/financials (`/media/financial-reports/financial_report-2013.pdf` … `gfo_2020.pdf`).
  - Annual activity reports (годишен доклад за дейността) were downloaded for 2007–2012, 2020–2024 and partly 2013–2019.
  - All filings are scanned images. I OCR'd them in Bulgarian with tesseract, and the figures below were read from the OCR text. One ambiguous figure (52,311) was checked against the page image.
  - The 2023 audit report and the 2023 activity report have a text layer and were read directly.
- **Filing dates (documented, Commercial Register).**
  - The 2018, 2019 and 2020 statements were all filed on 03.02.2022.
  - The 2021 statement was filed on 17.06.2024 and the 2022 statement on 30.07.2024.
  - The 2023 statement was filed on 31.07.2024 and the 2024 statement on 25.02.2026.
  - The **2025 statement is not in the register** as of the snapshot taken 15 Nov 2026.
  - The Audit Office also flagged the late filing of the 2018 statement.
- **Other primary sources.** Audit Office report (2018–2020 audit, adopted 14.09.2022); KEVR draft price decision of June 2026; Sofia council report by Terziev/Petrov (WBG proposal); BNR, BTA, Mediapool (via the site's public WordPress API), Euronews.
- **Source not read.** Capital.bg returned 403 to automated fetches; Capital items below come from search snippets only.
- Downloads are kept in `/private/tmp/claude-502/-Users-deyan-dobrinov-dev-personal-mvr/8e13c5de-2e99-44cd-a1cf-25ade74020ef/scratchpad/toplo_cr/` (Commercial Register PDFs), `.../toplo_dl/` (toplo.bg, BNR, BTA, Mediapool, NAO, KEVR) and `.../toplo_crocr/` (OCR text). Scripts are in `.../toplo_scripts/`.

**Labels used.**
- [FS] = audited financial statement or audit report.
- [AR] = company annual activity report (company self-reported, not audited, but filed in the register).
- [NAO] = Audit Office.
- [REG] = regulator.
- [COURT] = court.
- [OFF] = official statement (ministry, municipality, council document).
- [PRESS] = press-reported.
- [SNIP] = search snippet only.
- [ALLEG] = allegation.
- [DERIVED] = arithmetic on documented figures, shown with its formula; not an estimate.

**Units.** BGN thousand unless stated. The lev was converted to the euro on 1 Jan 2026 at 1.95583 BGN/EUR; 2026 figures are in EUR as published.

---

## 1. Definitions and comparability (read before charting)

1. **Total liabilities ("Общо пасиви").**
   - **Consistent series (A).** Use the figure as first reported in each year's own audited statement. From 2007 to 2024 this includes "financing / grants for non-current assets" (безвъзмездни средства, about 45–63 m).
   - **The 2011 exception.** The 2011 statement printed 494,659, which excludes grants of 56,180. Its own activity report and the 2012 statement's comparative give **550,839**, which includes them. Series A uses 550,839.
   - **Restatements exist.** Charting first-reported values is the consistent choice. The main ones:
     - 2010: first reported 548,745; restated in 2011 to 540,089 (486,792 + 53,297).
     - 2009: the restated opening balance was 446,151 excluding grants.
     - 2014: 810,075 → 844,525.
     - 2019: 978,949 → 978,497.
2. **Net result.**
   - Series A uses each year's own statement. Restated values are noted.
   - **2021 is not comparable.** The +304.2 m profit comes from a one-off, non-cash recognition of servitude rights over the network (income 585,830). Without that effect the pre-tax result was a loss of 267,262 [AR 2021]. The auditor qualified its opinion on exactly this item in 2021–2024 [FS].
   - **2022** includes 166.8 m of state gas compensation [AR 2023].
3. **Debt to Bulgargaz alone is NOT a consistent measure of gas debt.**
   - Bulgargaz repeatedly assigned (cession, цесия) its receivables to its parent BEH: in 2009 (214,963), and again in 2013–14, 2018–19, 2020–21 and Oct 2021 (BGN 121 m).
   - **For a gas-debt line, chart the combined "Bulgargaz + BEH"** [DERIVED from FS notes]. The 2020 combined figure (754,740) matches the Audit Office's own total exactly.
   - BEH balances are trade payables to 2017, then "loans" (the cessions were turned into loans).
4. **Trade receivables (net).**
   - Comparable 2006–2017 under the old impairment policy.
   - **Break in 2018 (IFRS 9 expected credit losses)**: they fall from about 396 m to about 182 m.
   - There is a further reclassification of 26,983 to "other receivables" in 2021 [FS 2021].
   - Do not plot one series across 2017/2018.
5. **Collection rate (събираемост)** [AR].
   - Company definition: receipts in the year ÷ (overdue receivables at 1 Jan + billing for the year excluding December).
   - Comparable 2002–2011 only. Not published in this form after 2011 (searched).
6. **Network losses** [AR]: "transport losses" with hot water as a % of heat released to the network (leaks plus heat dissipation). Same definition 2008–2024.
7. **Customers (абонати/потребители)** [AR]: comparable 2007–2012 (one table). After that only rounded or relative figures.

---

## 2. Year-by-year notes

### 1995–2005 (Sofiyanski)
- **Ownership.**
  - Municipal in the 1990s.
  - The state took 42% in 2002 against gas debts, leaving 58% municipal [PRESS, Capital 2010].
  - The 2007 statement is still headed "Топлофикация София **АД**" (two shareholders) [FS 2007].
- **Rescheduling.** A rescheduling agreement with Bulgargaz, "Договор № 1 от 29.12.1998", is the base contract for all later reschedulings [FS 2007–2011].
  - [PRESS, Capital 2015, SNIP] The BEH debt of 503 m was described as "accumulated since 1998".
- **Collection rate** (company definition, §1.5) [AR 2007]: 2002 **73.19%**, 2003 **71.95%**, 2004 **71.01%**, 2005 **70.25%**.
- **Heat production**, gross MWh [AR 2009]:
  | Year | Gross heat production (MWh) |
  |---|---|
  | 2003 | 6,048,766 |
  | 2004 | 5,447,080 |
  | 2005 | 5,647,892 |
- **Licences** for heat production, combined generation and transmission were issued on 15.11.2000 [FS].
- **District heating project.**
  - 14.08.2002: EBRD loan of EUR 30 m (15 years, state-guaranteed).
  - 18.07.2003: World Bank (IBRD) loan of EUR 26 m (17 years, state-guaranteed).
  - Kozloduy fund grant: 49.2 m drawn by 2009.
  - A loan from the Ministry of Economy for heat meters.
  - Under the project 584 substations were replaced in 2009. About 1,800 old ones remained at end-2009 [FS/AR 2007–2011].
- **Balance-sheet values.** Machines and equipment were revalued on 01.01.2003 and land and buildings on 01.01.2004, creating a revaluation reserve of about 199.8 m [FS 2007, FS 2011]. The 2011 auditor qualified because no new valuation had been made since 2002.
- **Not found:** total liabilities, net result, revenue or receivables for any year 1995–2005. The earliest balance-sheet data are end-2006 (comparatives in the 2007 statement).
- Valentin Dimitrov case: see existing notes (period_1995_2009_gaps_round2.md). Conduct 2003–2006; final 3-year sentence Feb 2015 [COURT].

### 2006 (Borisov from Nov 2005)
- [FS 2007, comparatives] Total liabilities **286,543**; net loss **−5,582**; sales revenue **316,877**; trade receivables **176,404**.
- [FS 2007] Bulgargaz: current trade payable 135,550 plus trade loan 8,000. The non-current part was not separately disclosed for 2006.
- Collection rate **65.38%** [AR 2007].
- Heat production 5,591,731 MWh [AR 2009].
- Hot-water price for households 60.25 BGN/MWh (unchanged 2006–2007) [AR 2007].

### 2007 (Borisov)
- [FS 2007] Total liabilities **358,343**; net loss **−15,004**; revenue **332,660**; trade receivables **233,884**; equity 325,812.
- [FS 2007] Bulgargaz total **193,850** [DERIVED: current 53,050 + current instalment 24,900 + non-current 115,900].
  - The non-current part comes from the 21.09.2007 rescheduling of **150,760,905.66 BGN** to 2013.
  - Bulgargaz made up 72.78% of current liabilities.
- Customers **401,230** [AR 2012 table]; collection rate **59.16%** (households 51.89%) [AR 2007].
- Heat production 5,135,280 MWh.
- Prices [AR 2007]: hot water 60.25 BGN/MWh; associations 57.24; electricity 85.19 → 107.27 BGN/MWh.
- Council/mayor decisions:
  - [PRESS, Capital 2007] Council gave New Energy Vision AD, without tender, the right to build a heat plant on a company site.
  - Jan 2007: council elected Atanas Mihov as director (existing notes).

### 2008 (Borisov) — company fully state-owned
- [FS 2008] Total liabilities **429,801**; net loss **−63,283**; revenue **348,614**; trade receivables **236,694**.
- [FS 2008] Bulgargaz total **268,648** [DERIVED: current 177,948 + non-current 90,700].
  - Bulgargaz made up 86.11% of current liabilities.
  - Gas debts as at 30.11.2008 were assigned to BEH after year-end.
- Customers **410,181** (384,248 household); collection rate **58.31%** (households 52.38%); network losses **18.02%** [AR 2008].
- Prices from 01.07.2008: electricity 178.41 BGN/MWh; household hot water 68.33 BGN/MWh (+13.4%) [AR 2008].
- Ownership: the council transferred its 58% to the state free of charge, voting unanimously except G. Kadiev [PRESS, Capital 2010]. From 2008 the statements are headed "ЕАД".

### 2009 (Borisov to Jul 2009; Fandakova from autumn 2009)
- [FS 2009] Total liabilities **510,343**; net loss **−43,060**; revenue **423,149**; trade receivables **254,275**.
- [AR 2009] Liabilities for natural gas (Bulgargaz + BEH combined) **355,763** (69.71% of liabilities). A clean split is not given.
- [FS 2009] Bulgargaz assigned **214,963** of the company's debt to BEH under a cession dated 17.03.2009. The auditor qualified because the repayment terms were unclear.
- [FS 2009] 20.10.2009: new Bulgargaz rescheduling of **113,307,057.56 BGN** over 57 months.
- Customers **418,068** (389,636 household; 28,432 business); collection rate **52.24%** (households 46.69%); network losses **17.52%** [AR 2009].
- Hot-water price [AR 2009]:
  - A minister's decision of 11.03.2009 kept the household price at 68.33 BGN/MWh.
  - Price-review figures cited in the report were 81.17 BGN/MWh, and 74.71 for Q2 2009.
- This confirms the known BGN 510 m at end-2009 [FS].

### 2010 (Fandakova) — returned to the municipality
- [FS 2010] Total liabilities **548,745** [DERIVED: non-current 376,443 + current 172,302 from the statement face]. The activity report shows "общо задължения" 548,748.
- [FS 2010] Net loss **−10,046** (restated in 2011 to −25,689); revenue **425,536**; trade receivables **271,604**.
- [FS 2011, note 19] BEH **222,156**; Bulgargaz **199,542**.
  - [FS 2011] 26.03.2010: BEH rescheduling of **213,966,375.92 BGN** over 6 years, to 2017.
- Customers **425,482**; network losses **18.03%** [AR 2010].
- Ownership: the state transferred the company back to Sofia Municipality free of charge, with its liabilities [PRESS, Capital 2010]. Sofia Municipality has been registered as sole owner since 20.12.2010 [Commercial Register].

### 2011 (Fandakova)
- [FS 2011/2012] Total liabilities **550,839** (see §1.1).
- [FS 2011] Net profit **+22,904**; revenue **537,383**; trade receivables **324,664**.
- [FS 2011] BEH **222,147**; Bulgargaz **191,838**.
- Qualified audit: BEH debt not confirmed; asset values not tested [FS].
- Customers **430,682**; collection rate **57.22%** (households 52.48%); network losses **17.18%** [AR 2011].
- Gross receivables from heat 525,343, of which impaired 199,312 [AR 2011].

### 2012 (Fandakova)
- [FS 2012] Total liabilities **603,971**; net profit **+2,726**; revenue **600,060**; trade receivables **393,626**.
- [FS 2012] BEH **222,106**; Bulgargaz **238,153**.
- Customers **433,851**; network losses **17.54%** [AR 2012].
- [AR 2012] Household arrears:
  - 29,921 households owed for more than 3 years, totalling 98.8 m (52% of household receivables).
  - 216,422 households had no arrears.
- 15,736 court applications were filed in 2012, against 9,335 in 2011.
- [PRESS, Capital Jun 2012, SNIP] "Toplofikatsiya Sofia sank into debt".

### 2013 (Fandakova)
- [FS 2013] Total liabilities **629,028**; net profit **+5,353** (restated in 2014 to +4,530); revenue **559,340**; trade receivables **408,281**.
- [FS 2013] BEH **408,671**; Bulgargaz **79,034**.
- Qualified audit: BEH balance not confirmed; receivables possibly overstated [FS].
- Network losses **17.46%** [AR 2013].
- Audit Office audit of the period 2007 – Apr 2013. In the Dec 2014 follow-up all recommendations were found implemented [NAO] (existing notes).

### 2014 (Fandakova)
- [FS 2014] Total liabilities **810,075** (restated 844,525); net loss **−57,658** (restated −84,724); revenue **485,856**; trade receivables **476,496**.
- [FS 2014 audit] BEH **496,395**; Bulgargaz **167,514** (restated in 2015 to 528,070 / 170,289).
- [FS 2014] **KTB bank collapse**:
  - 89,196 of the company's cash was blocked in Corporate Commercial Bank (KTB).
  - Carrying value 76,777 at end-2014 and 43,877 at end-2015.
- Network losses **18.25%** [AR 2014].
- [PRESS, Capital Mar 2014, SNIP] The company was among the four largest debtors to Bulgargaz.

### 2015 (Fandakova)
- [FS 2015] Total liabilities **811,676**; net loss **−59,235**; revenue **425,723**; trade receivables **444,058**.
- [FS 2015] BEH **500,465**; Bulgargaz **159,297**.
- **Agreement of 11.12.2015 with BEH**: recognition and rescheduling of **500,465** over 20 years, to 2035, at 3.25% [NAO 2022; FS].
- [FS 2015] Write-off of **52,311** of time-barred liabilities to BEH, booked as income.
- [FS 2015] First going-concern emphasis: accumulated loss 296,330.
- Network losses **17.47%** [AR 2015].
- [PRESS, Capital Dec 2015, SNIP] The municipality was preparing a concession (not carried out).

### 2016 (Fandakova)
- [FS 2016] Total liabilities **726,564**; net loss **−40,822**; revenue **348,070**; trade receivables **363,417**.
- [FS 2016] BEH **500,465**; Bulgargaz **85,008**.
- Auditor: material uncertainty on going concern (accumulated loss 336,634) [FS].
- Network losses **18.14%** [AR 2016].

### 2017 (Fandakova)
- [FS 2017] Total liabilities **760,385**; net loss **−34,817**; revenue **356,990**; trade and other receivables **395,868**.
- [FS 2017] BEH **500,465**; Bulgargaz **112,243**.
- Network losses **18.78%** [AR 2017].

### 2018 (Fandakova)
- [FS 2018] Total liabilities **862,729**; net loss **−19,786**; revenue **412,562**; trade receivables **181,941** (IFRS 9 break).
- [FS 2018] BEH **602,955** (500,465 + 102,490 new); Bulgargaz **62,972**.
- Network losses **19.22%** [AR 2018].
- Dec 2018: EIB signed a EUR 67 m loan for the RDF plant (existing notes).
- [PRESS, Capital Jul 2018, SNIP] Part of electricity revenue was to go directly to Bulgargaz.

### 2019 (Fandakova)
- [FS 2019] Total liabilities **978,949**; net loss **−82,525**; revenue **470,684**; trade receivables **202,755**.
- [FS 2019] BEH **594,147** (577,615 + 16,532; restated 593,695); Bulgargaz **170,864**.
- **Agreement of 01.04.2019 with BEH**: 99,193 rescheduled to Aug 2025 at 4.66% [NAO].
- Network losses **20.87%** [AR].
- [ALLEG, Greenpeace analysis, Apr 2024] The 2019 carbon-quota contract with intermediary "Grand Capital" (fixed price EUR 28.50/t plus a commission) is said to have cost about BGN 200 m above market over 2019–2024 [PRESS, Mediapool 23.04.2024].

### 2020 (Fandakova)
- [FS 2020] Total liabilities **1,003,461**; net loss **−67,158**; revenue **401,852**; trade receivables **199,935**.
- [FS 2020] BEH **699,069**; Bulgargaz **55,671**. Gas-contract liabilities 754,740 = 75% of all liabilities [NAO].
- Bridging loan from the Bulgarian Development Bank: 40 m at at least 3%, over 36 months; 36,306 drawn by end-2020 [NAO].
- Network losses **19.25%** [AR 2020].
- EU approved EUR 77 m ERDF for the RDF plant (Mar 2020; existing notes).

### 2021 (Fandakova)
- [FS 2021] Total liabilities **1,389,865**; net result **+304,214** (non-comparable; pre-tax loss excluding servitudes −267,262 [AR]); revenue **634,499**; trade receivables **184,822**.
- [FS 2021] BEH (loans) **901,816** (93,707 current + 808,109 non-current).
- Bulgargaz **47,681** [DERIVED: 552,863 (2022) − 505,182 (2022 increase stated in AR 2022)].
- [PRESS, BNR 28.10.2021] BEH took over BGN 121 m of Bulgargaz debt so that November gas supplies could continue.
- Regulated gas price rose 280% in 2021 (26.93 → 102.33 BGN/MWh) [AR 2021].
- Network losses **19.14%** [AR 2021].
- [PRESS, Capital Jul 2021, SNIP] A consortium with Chinese participation was ranked first in the RDF-plant tender.

### 2022 (Fandakova)
- [FS 2022] Total liabilities **1,760,044**; net loss **−352,544**; revenue **1,043,542**; trade receivables **225,055**.
- [FS/AR] BEH **886,718**; Bulgargaz **552,863**.
- State gas compensation of 166,809 (Jan–May) was paid directly to Bulgargaz [AR 2023].
- Parliament imposed a price moratorium for Q1 2022.
- **15.09.2022 BEH agreement**: 333,596,906 BGN rescheduled to March 2029 at 3.525% [AR 2023].
- **19.09.2022**: three-party agreement with Bulgargaz and the Electricity System Security Fund (Фонд СЕС), under which 80% of the CHP premium goes directly to Bulgargaz [AR 2023].
- [PRESS, Mediapool 04.10.2022, KEVR data] Heat price at that time **137.82 BGN/MWh**; CHP premium 785.82 BGN/MWh. About BGN 1 bn of debt was renegotiated.
- Network losses **19.48%** [AR 2022].
- [NAO, adopted 14.09.2022, audit of 2018–2020]:
  - Board members appointed without public selection.
  - 2015–2019 business-plan investment only 33% executed (163.8 m of 496.3 m).
  - Accumulated losses over 240 m in the period.
  - Annual statements for 2019–2020 not reviewed by the supervisory board.
- [PRESS, Mediapool Dec 2022] The RDF project (about 370 m total, 177 m EU) would lose at least BGN 100 m of EU funds; the contractor award was in court after the competition commission (КЗК) annulled it.

### 2023 (Fandakova to Nov 2023; Terziev from Nov 2023)
- [FS 2023] Total liabilities **1,888,600**; net loss **−88,361**; revenue **1,136,248** (of which CHP premium from Фонд СЕС 516,464); trade receivables **237,741** (gross 341,730).
- [FS/AR 2023] BEH **797,639**; Bulgargaz **781,362**.
  - Interest/penalties to Bulgargaz in 2023: 77,158.
  - Current liabilities exceed current assets by 767,265.
- Network losses **20.51%** [AR]. Customers rose by 15,094 (+3.4%) over 2019–2023 [AR].
- 15,008 court cases filed against customers in 2023 [AR].
- The municipality returned the EU RDF funding.
- Sofia Administrative Court annulled the environmental impact assessment (EIA) for the RDF plant in Sept 2023 (existing notes).
- 27–30 Nov 2023 [PRESS, Mediapool; OFF, Ministry of Finance]: the draft 2024 state budget provided for the state to buy the company's gas debt to BEH and Bulgargaz (about 1.6 bn), with the company staying municipal.
- 21 Dec 2023: Parliament adopted the option [PRESS].

### 2024 (Terziev)
- [FS 2024] Total liabilities **2,259,416**; net loss **−143,136**; revenue **803,366**; trade receivables **169,924**.
- [FS 2024] BEH (loans) **769,922** (246,869 + 523,053).
- Bulgargaz **991,236** [DERIVED: 781,362 + increase of 209,874 stated in AR 2024].
- Interest/penalties to Bulgargaz 104,975. Current liabilities exceed current assets by 1,259,086 [FS].
- Network losses **22.04%** (leaks 7.31%) [AR 2024]. Customers "over 460,000" [AR, rounded].
- 27 Mar 2024 [OFF via PRESS]: Denkov cabinet allocated **1,580,315,352 BGN** to the Energy Ministry to buy the debt, subject to EC state-aid approval.
- 12 Apr 2024: Glavchev caretaker cabinet cancelled the decision [PRESS, Mediapool].
- 2 May 2024: Supreme Administrative Court definitively rejected the RDF project [SNIP] (existing notes).
- Jun 2024: CEO Aleksandar Aleksandrov resigned after reports that company contracts went to firms of his wife [PRESS/ALLEG].
- Jul 2024: council replaced the boards of six municipal companies, Toplofikatsiya included (existing notes). Petar Petrov became CEO in autumn 2024 [PRESS].
- 3 Oct 2024: Bulgargaz froze a company account. Lifted after a BGN 10 m payment (11 Oct) [PRESS].
- 29–30 Nov 2024: a pipeline break on Al. Malinov Blvd left more than 100,000 people without heat [PRESS].
- Dec 2024 council hearing [PRESS, Mediapool 11.12.2024, company data]:
  - Debts of BGN 1.6 bn to Bulgargaz and BEH.
  - About 1,300 network failures by end-Nov.
  - Repairs budget only BGN 9 m.

### 2025 (Terziev)
- **Annual statement not filed** (not in the register). Press figures:
  - Loss **≈ BGN 426 m** (2024: 143 m) [SNIP, Capital 03.08.2026].
  - Business-plan forecast loss of 392.8 m [OFF, council report].
  - Assets 1.366 bn BGN at end-2025 [SNIP, Capital EN 04.11.2026].
  - "Accumulated debt about BGN 2.5 bn" in the 2025 statements [OFF, Terziev/Petrov report to the council, undated, after 24.11.2025].
- Feb 2025: major break on the Iskar main (1,220 mm pipe); nine districts without heat [PRESS].
- Sept 2025: Druzhba-2 was without heat for about three months (average 12 days per block, per company data) [PRESS].
  - 19 Sept: Terziev set up a working group for an external audit and proposed a concession [OFF/PRESS].
  - 23 Sept: he asked prosecutors to investigate the past 15 years of management [PRESS, BTA].
- 24.11.2025: World Bank Group offered a preparatory analysis on private-sector participation (debt "over EUR 1 bn") [OFF, council report].
- Dec 2025 – Jan 2026: mass failures in Lyulin, Mladost-3, Dianabad and Poligona. The ombudsman referred them to KEVR [PRESS, BTA 16.01.2026].

### 2026 (Terziev)
- End-Jan 2026 [PRESS, Mediapool 09.02.2026, CEO at council committee]:
  - Debts **EUR 1,215,527,112**: Bulgargaz **≈ EUR 762 m** (interest 16%), BEH **≈ EUR 403 m** (12%), contractors about EUR 50 m.
- 17 Apr 2026 [REG, KEVR via BTA]: ordered compensation for **6,197 customers** (164 substations) left without heat for more than 48 h in Dec 2025 – Jan 2026; licence breaches found.
- 9 Jun 2026 [REG, KEVR draft decision]: from 01.07.2026 heat price **EUR 73.30/MWh**; Sofia +5.5% (the company asked for +29%); CHP premium EUR 277.87/MWh; required revenue EUR 517.45 m.
  - Final average increase across all companies reported as 4.5% [PRESS].
- 11 Jun 2026: council approved the 2026 business plan and started management changes at 53 municipal companies. Terziev re-tabled his request for an independent audit [OFF, BTA].
- 30 Jun 2026: Energy Ministry prescriptions, reported not implemented [ALLEG, minister] (existing notes).
- 31 Oct 2026 [OFF, Energy Ministry via press]: owed **EUR 915.5 m to Bulgargaz** and **EUR 403.4 m to BEH** (EUR 1.32 bn total); no payments since May 2026 [PRESS, Euronews].
  - 22–23 Oct: Bulgargaz demanded financial data before a 2027 supply contract [PRESS].
- Nov 2026 [PRESS, Mediapool 11.11.2026, company at council committee]:
  - **More than 500 simultaneous network breaches**, about 1,000 substations disconnected.
  - Some customers without hot water since end-August.
  - Iztok and Izgrev fully cut off.
  - Breaches compared with 260 in 2025 and 118 in 2024, on the company's own count (definition differs from the "about 1,300 failures" cited for 2024).
- 19 Nov 2026: council agenda includes the mayor's independent-analysis report (existing notes).

---

## (a) Clean table: consistent, sourced values

BGN thousand, end of year.
- **Total liabilities** and **net result**: as first reported in that year's audited statement (definitions in §1).
- **Debt to Bulgargaz**: trade payables to Bulgargaz per statement notes. It is affected by cessions to BEH, so plot the "Bulgargaz + BEH" column for gas debt.
- "n/f" = not found. "—" = no meaningful value.
- 2021 net result is flagged as not comparable.

| Year | Total liabilities | Debt to Bulgargaz | Debt to BEH | Bulgargaz + BEH [DERIVED] | Net result | Source |
|---|---|---|---|---|---|---|
| 1995–2005 | n/f | n/f | — | n/f | n/f | — |
| 2006 | 286,543 | n/f (current 135,550 + loan 8,000; non-current n/f) | — | n/f | −5,582 | FS 2007 (comparatives) |
| 2007 | 358,343 | 193,850 [DERIVED, 3 components] | — | 193,850 | −15,004 | FS 2007 |
| 2008 | 429,801 | 268,648 [DERIVED, 2 components] | — | 268,648 | −63,283 | FS 2008 |
| 2009 | 510,343 | n/f (split) | 214,963 (cession) | 355,763 (AR, "natural gas") | −43,060 | FS/AR 2009 |
| 2010 | 548,745 | 199,542 | 222,156 | 421,698 | −10,046 | FS 2010; FS 2011 note 19 |
| 2011 | 550,839 | 191,838 | 222,147 | 413,985 | +22,904 | FS 2011/2012 |
| 2012 | 603,971 | 238,153 | 222,106 | 460,259 | +2,726 | FS 2012 |
| 2013 | 629,028 | 79,034 | 408,671 | 487,705 | +5,353 | FS 2013 |
| 2014 | 810,075 | 167,514 | 496,395 | 663,909 | −57,658 | FS 2014 |
| 2015 | 811,676 | 159,297 | 500,465 | 659,762 | −59,235 | FS 2015 |
| 2016 | 726,564 | 85,008 | 500,465 | 585,473 | −40,822 | FS 2016 |
| 2017 | 760,385 | 112,243 | 500,465 | 612,708 | −34,817 | FS 2017 |
| 2018 | 862,729 | 62,972 | 602,955 | 665,927 | −19,786 | FS 2018 |
| 2019 | 978,949 | 170,864 | 594,147 | 765,011 | −82,525 | FS 2019 |
| 2020 | 1,003,461 | 55,671 | 699,069 | 754,740 | −67,158 | FS 2020; NAO 2022 |
| 2021 | 1,389,865 | 47,681 [DERIVED] | 901,816 | 949,497 | +304,214 ⚠ not comparable | FS/AR 2021–22 |
| 2022 | 1,760,044 | 552,863 | 886,718 | 1,439,581 | −352,544 | FS/AR 2022–23 |
| 2023 | 1,888,600 | 781,362 | 797,639 | 1,579,001 | −88,361 | FS/AR 2023 |
| 2024 | 2,259,416 | 991,236 [DERIVED] | 769,922 | 1,761,158 | −143,136 | FS/AR 2024 |
| 2025 | n/f (statement not filed; "≈2.5 bn BGN" per council report) | n/f | n/f | n/f | ≈ −426,000 [SNIP] | — |
| 31 Oct 2026 | n/f | EUR 915.5 m | EUR 403.4 m | EUR 1,318.9 m | n/f | Energy Ministry via press |

**Companion series** (not for the main chart unless noted). Values in BGN thousand unless stated.

| Series | Years and values | Comparability / source |
|---|---|---|
| Sales revenue | 2006 316,877; 2007 332,660; 2008 348,614; 2009 423,149; 2010 425,536; 2011 537,383; 2012 600,060; 2013 559,340; 2014 485,856; 2015 425,723; 2016 348,070; 2017 356,990; 2018 412,562; 2019 470,684; 2020 401,852; 2021 634,499; 2022 1,043,542; 2023 1,136,248; 2024 803,366 | FS. From 2022 dominated by the CHP premium paid by Фонд СЕС |
| Trade receivables, net | 2006 176,404; 2007 233,884; 2008 236,694; 2009 254,275; 2010 271,604; 2011 324,664; 2012 393,626; 2013 408,281; 2014 476,496; 2015 444,058; 2016 363,417; 2017 395,868 | FS. Comparable 2006–2017 |
| Trade receivables, net (IFRS 9) | 2018 181,941; 2019 202,755; 2020 199,935; 2021 184,822; 2022 225,055; 2023 237,741; 2024 169,924 | FS. Second series from 2018, not comparable with the first |
| Collection rate (%) | 2002 73.19; 2003 71.95; 2004 71.01; 2005 70.25; 2006 65.38; 2007 59.16; 2008 58.31; 2009 52.24; 2011 57.22 | AR, one definition. 2010 not stated directly (2011 is "+1.69 pp") |
| Customers | 2007 401,230; 2008 410,181; 2009 418,068; 2010 425,482; 2011 430,682; 2012 433,851; 2024 "over 460,000" | AR 2012 table for 2007–2012; 2024 rounded |
| Network losses (%) | 2008 18.02; 2009 17.52; 2010 18.03; 2011 17.18; 2012 17.54; 2013 17.46; 2014 18.25; 2015 17.47; 2016 18.14; 2017 18.78; 2018 19.22; 2019 20.87; 2020 19.25; 2021 19.14; 2022 19.48; 2023 20.51; 2024 22.04 | AR, one definition; consistent |
| Household hot-water price (BGN/MWh) | 2006–07 60.25; from 01.07.2008 68.33; Sept 2022 137.82; from 01.07.2026 EUR 73.30 (≈ BGN 143.4, KEVR draft) | Point values, not an annual series |

---

## (b) Timeline (12 items)

1. **29 Dec 1998, Sofiyanski.** The first rescheduling contract with Bulgargaz (Договор № 1) [FS references]. The gas debt that later passes to BEH is described as accumulating from 1998.
2. **2002–2003, Sofiyanski.** The state takes 42% against gas debts [PRESS]. State-guaranteed loans: EBRD EUR 30 m (Aug 2002) and World Bank EUR 26 m (Jul 2003) [FS/loan agreement]. Collection rate falls from 73% (2002) to 70% (2005) [AR].
3. **Apr–Jul 2006, Borisov.** CEO Valentin Dimitrov (in the boards since 1996) is removed and arrested. Final 3-year sentence in Feb 2015 [COURT].
4. **2008, Borisov.** The council hands its 58% to the state free of charge. The company ends the year with a BGN 63 m loss and liabilities of 430 m [FS].
5. **17 Mar 2009, Borisov.** Bulgargaz assigns BGN 215 m of the company's debt to BEH. This is the start of the BEH "cession" debt [FS].
6. **2010, Fandakova.** The state returns 100% to Sofia Municipality with its liabilities (BGN 549 m). The municipality has been registered as sole owner since 20 Dec 2010 [PRESS; Commercial Register].
7. **2014, Fandakova.** BGN 89 m of company cash is blocked in the failed KTB bank. Liabilities pass BGN 800 m [FS].
8. **11 Dec 2015, Fandakova.** A BGN 500 m debt to BEH is rescheduled over 20 years at 3.25%. A first going-concern warning follows in 2016 [NAO; FS].
9. **2018–2023, Fandakova.** The RDF waste-to-energy plant: EIB loan EUR 67 m (2018) and EU grant (2020). Tender litigation, BGN ≥100 m of EU money lost, EIA annulled (2023), project finally rejected (2024) [PRESS; court via NGO].
10. **2021–2022, Fandakova.** The gas-price shock.
    - 2021: a "profit" that comes only from a one-off servitude revaluation.
    - 2022: a record BGN 353 m loss.
    - Sept 2022: BEH and Bulgargaz agreements reschedule about BGN 1 bn.
    - The Audit Office (Sept 2022) finds only 33% of planned investment done [FS; NAO].
11. **Mar–Apr 2024, Terziev.** The Denkov cabinet allocates BGN 1.58 bn to buy the company's gas debt; the caretaker cabinet cancels it two weeks later [OFF via PRESS]. In Oct 2024 Bulgargaz freezes the company's account [PRESS].
12. **2025 – Nov 2026, Terziev.**
    - Losses: BGN 143 m (2024) and ≈ BGN 426 m (2025, press).
    - Mass outages in Dec 2025 – Jan 2026; KEVR orders compensation for 6,197 customers (Apr 2026).
    - Debts of EUR 1.32 bn at 31 Oct 2026 (EUR 915.5 m Bulgargaz, EUR 403.4 m BEH).
    - More than 500 network breaches in Nov 2026.
    - The mayor pushes an independent audit and a concession (WBG offer of Nov 2025); the council has deferred it [OFF; REG; PRESS].

---

## (c) Gaps

- **1995–2005**: no liabilities, results, revenue or receivables found. The earliest audited balance sheet is end-2006. Pre-2007 statements are not in the electronic Commercial Register; the deed starts with the 2007 statement. The paper company file is case 1084/1993 at Sofia City Court.
- **2006**: the split of debt to Bulgargaz is incomplete (non-current part not disclosed).
- **2009**: no clean Bulgargaz/BEH split. Only the combined "natural gas" 355,763 and the 214,963 cession.
- **2025**: the annual statement is not filed. The loss (≈426 m) and "≈2.5 bn debt" are from a Capital snippet and a council report and are not audited. **2026** has no year-end data yet.
- **Customers 2013–2023**: no absolute counts extracted. The OCR of the 2013 table is ambiguous (a figure of 436,470 seen; year unclear). Collection rate after 2011: not published in the same form.
- **Restatements**: series A uses first-reported figures. A chart using restated figures would differ in 2009, 2010, 2013, 2014 and 2019.
- **Heat prices**: only point values. A full KEVR decision series (dker.bg, 2008–2026) was not compiled, and the June 2026 figure is from the draft decision.
- **Not researched or not found**:
  - The gas-engine cogeneration investments (only a turbogenerator №3 project at TEC Sofia Iztok in 2021 was seen in AR 2021).
  - Details of the 2018 and 2020–21 cessions.
  - The 2015 Capital "503 m to BEH" figure (snippet only; the statement value is 500,465).
  - Council decision numbers for the 2008 and 2010 ownership transfers.
  - The full Audit Office 2007–2013 report.
  - S&P reports after Feb 2024.
  - The Greenpeace quota analysis itself (only press coverage read).
- **Web-search quota** ran out mid-research. Capital.bg articles (2008–2026) were not read directly.
