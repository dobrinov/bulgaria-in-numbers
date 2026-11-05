// Регистър на източниците за всеки показател в сайта.
//
// eurostat — сваля се автоматично от API на Евростат (npm run update-data):
//   { page, key, field: 'values' | 'eu', dataset, params, scale?, semester?, round? }
//   params са филтрите на Евростат; geo се добавя автоматично (BG или EU27_2020 за field 'eu').
//   scale умножава стойността (напр. 0.001 за млн. → млрд.). semester: 'S2' за полугодишни редове.
//
// manual — няма API; скриптът ги изброява в отчета с адреса, откъдето се обновяват.

const EU = 'eu';

export const EUROSTAT = [
  // Население
  { page: 'population', key: 'natural', dataset: 'demo_gind', params: { indic_de: 'NATGROW' } },
  { page: 'population', key: 'migration', dataset: 'demo_gind', params: { indic_de: 'CNMIGRAT' } },
  { page: 'population', key: 'age', dataset: 'demo_pjanind', params: { indic_de: 'MEDAGEPOP' } },
  { page: 'population', key: 'old', dataset: 'demo_pjanind', params: { indic_de: 'PC_Y65_MAX' } },

  // Доходи
  { page: 'income', key: 'gdpPps', dataset: 'prc_ppp_ind', params: { na_item: 'VI_PPS_EU27_2020_HAB', ppp_cat: 'GDP' } },
  { page: 'income', key: 'aic', dataset: 'prc_ppp_ind', params: { na_item: 'VI_PPS_EU27_2020_HAB', ppp_cat: 'A01' } },
  { page: 'income', key: 'pli', dataset: 'prc_ppp_ind', params: { na_item: 'PLI_EU27_2020', ppp_cat: 'A01' } },
  { page: 'income', key: 'arope', dataset: 'ilc_peps01n', params: { unit: 'PC', age: 'TOTAL', sex: 'T' } },
  { page: 'income', key: 'arope', field: EU, dataset: 'ilc_peps01n', params: { unit: 'PC', age: 'TOTAL', sex: 'T' } },
  { page: 'income', key: 'gini', dataset: 'ilc_di12', params: { statinfo: 'GINI_HND', age: 'TOTAL' } },
  { page: 'income', key: 'gini', field: EU, dataset: 'ilc_di12', params: { statinfo: 'GINI_HND', age: 'TOTAL' } },
  { page: 'income', key: 'minw', dataset: 'earn_mw_cur', params: { currency: 'EUR' }, semester: 'S2' },
  { page: 'income', key: 'house', dataset: 'prc_hpi_a', params: { purchase: 'TOTAL', unit: 'RCH_A_AVG' } },
  { page: 'income', key: 'house', field: EU, dataset: 'prc_hpi_a', params: { purchase: 'TOTAL', unit: 'RCH_A_AVG' } },

  // Здраве и образование
  { page: 'health', key: 'life', dataset: 'demo_mlexpec', params: { age: 'Y_LT1', sex: 'T', unit: 'YR' } },
  { page: 'health', key: 'life', field: EU, dataset: 'demo_mlexpec', params: { age: 'Y_LT1', sex: 'T', unit: 'YR' } },
  { page: 'health', key: 'infant', dataset: 'demo_minfind', params: { unit: 'RT', indic_de: 'INFMORRT' } },
  { page: 'health', key: 'infant', field: EU, dataset: 'demo_minfind', params: { unit: 'RT', indic_de: 'INFMORRT' } },
  { page: 'health', key: 'hspend', dataset: 'hlth_sha11_hf', params: { icha11_hf: 'TOT_HF', unit: 'PC_GDP' } },
  { page: 'health', key: 'hspend', field: EU, dataset: 'hlth_sha11_hf', params: { icha11_hf: 'TOT_HF', unit: 'PC_GDP' } },
  { page: 'health', key: 'doctors', dataset: 'hlth_rs_prs2', params: { unit: 'P_HTHAB', wstatus: 'PRACT', med_spec: 'PHYS' } },
  { page: 'health', key: 'early', dataset: 'edat_lfse_14', params: { sex: 'T', unit: 'PC', wstatus: 'POP' } },
  { page: 'health', key: 'early', field: EU, dataset: 'edat_lfse_14', params: { sex: 'T', unit: 'PC', wstatus: 'POP' } },
  { page: 'health', key: 'tertiary', dataset: 'edat_lfse_03', params: { sex: 'T', unit: 'PC', isced11: 'ED5-8', age: 'Y25-34' } },
  { page: 'health', key: 'tertiary', field: EU, dataset: 'edat_lfse_03', params: { sex: 'T', unit: 'PC', isced11: 'ED5-8', age: 'Y25-34' } },
  { page: 'health', key: 'edspend', dataset: 'gov_10a_exp', params: { cofog99: 'GF09', na_item: 'TE', sector: 'S13', unit: 'PC_GDP' } },

  // Икономика
  { page: 'economy', key: 'gdp', dataset: 'nama_10_gdp', params: { unit: 'CP_MEUR', na_item: 'B1GQ' }, scale: 0.001, round: 3 },
  { page: 'economy', key: 'unemployment', dataset: 'une_rt_a', params: { age: 'Y15-74', sex: 'T', unit: 'PC_ACT' } },
  { page: 'economy', key: 'inflation', dataset: 'prc_hicp_aind', params: { coicop: 'CP00', unit: 'RCH_A_AVG' } },

  // Бюджет и дълг (НСИ публикува същите числа; Евростат се обновява по-късно)
  { page: 'budget', key: 'rev', dataset: 'gov_10a_main', params: { na_item: 'TR', sector: 'S13', unit: 'PC_GDP' } },
  { page: 'budget', key: 'interest', dataset: 'gov_10a_main', params: { na_item: 'D41PAY', sector: 'S13', unit: 'MIO_EUR' } },
  { page: 'budget', key: 'exp', dataset: 'gov_10a_main', params: { na_item: 'TE', sector: 'S13', unit: 'PC_GDP' } },
  { page: 'budget', key: 'debtPct', dataset: 'gov_10dd_edpt1', params: { na_item: 'GD', sector: 'S13', unit: 'PC_GDP' } },
  { page: 'budget', key: 'balPct', dataset: 'gov_10dd_edpt1', params: { na_item: 'B9', sector: 'S13', unit: 'PC_GDP' } },

  // Данъци (млн. € → млрд. €)
  { page: 'taxes', key: 'total', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D2_D5_D91_D61_M_D995' }, scale: 0.001, round: 3 },
  { page: 'taxes', key: 'pct', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'PC_GDP', na_item: 'D2_D5_D91_D61_M_D995' } },
  { page: 'taxes', key: 'vat', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D211' }, scale: 0.001, round: 3 },
  { page: 'taxes', key: 'pit', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D51A_C1' }, scale: 0.001, round: 3 },
  { page: 'taxes', key: 'cit', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D51B_C2' }, scale: 0.001, round: 3 },
  { page: 'taxes', key: 'excise', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D214A' }, scale: 0.001, round: 3 },
  { page: 'taxes', key: 'social', dataset: 'gov_10a_taxag', params: { sector: 'S13_S212', unit: 'MIO_EUR', na_item: 'D61' }, scale: 0.001, round: 3 },

  // Администрация
  { page: 'admin', key: 'pay', dataset: 'gov_10a_main', params: { na_item: 'D1PAY', sector: 'S13', unit: 'MIO_EUR' }, scale: 0.001, round: 4 },

  // Сигурност
  { page: 'security', key: 'roads', dataset: 'tran_sf_roadus', params: { unit: 'NR', sex: 'T', age: 'TOTAL', pers_cat: 'TOTAL' } },
  { page: 'security', key: 'police', dataset: 'crim_just_job', params: { isco08: 'OC5412', unit: 'P_HTHAB', sex: 'T' }, scale: 0.001, round: 5 },
  { page: 'security', key: 'spend', dataset: 'gov_10a_exp', params: { cofog99: 'GF0301', na_item: 'TE', sector: 'S13', unit: 'MIO_EUR' } },

  // Правосъдие
  { page: 'justice', key: 'trust', dataset: 'sdg_16_40', params: { lev_perc: 'VG_FG' } },
  { page: 'justice', key: 'trust', field: EU, dataset: 'sdg_16_40', params: { lev_perc: 'VG_FG' } },
  { page: 'justice', key: 'prison', dataset: 'crim_pris_age', params: { age: 'TOTAL', sex: 'T', unit: 'P_HTHAB' } },
  { page: 'justice', key: 'judges', dataset: 'crim_just_job', params: { isco08: 'OC2612A', unit: 'P_HTHAB', sex: 'T' } },
  { page: 'justice', key: 'conv', dataset: 'crim_just_sex', params: { leg_stat: 'PER_CNV', sex: 'T', unit: 'P_HTHAB' } },

  // Енергетика (цена: € → евроцента)
  { page: 'energy', key: 'price', dataset: 'nrg_pc_204', params: { nrg_cons: 'KWH2500-4999', unit: 'KWH', currency: 'EUR', tax: 'I_TAX', siec: 'E7000' }, semester: 'S2', scale: 100, round: 2 },
  { page: 'energy', key: 'price', field: EU, dataset: 'nrg_pc_204', params: { nrg_cons: 'KWH2500-4999', unit: 'KWH', currency: 'EUR', tax: 'I_TAX', siec: 'E7000' }, semester: 'S2', scale: 100, round: 2 },
  { page: 'energy', key: 'cold', dataset: 'ilc_mdes01', params: { hhcomp: 'TOTAL', rskpovth: 'TOTAL', unit: 'PC' } },
  { page: 'energy', key: 'cold', field: EU, dataset: 'ilc_mdes01', params: { hhcomp: 'TOTAL', rskpovth: 'TOTAL', unit: 'PC' } },
  { page: 'energy', key: 'ren', dataset: 'nrg_ind_ren', params: { nrg_bal: 'REN', unit: 'PC' } },
  { page: 'energy', key: 'ren', field: EU, dataset: 'nrg_ind_ren', params: { nrg_bal: 'REN', unit: 'PC' } },
  { page: 'energy', key: 'rese', dataset: 'nrg_ind_ren', params: { nrg_bal: 'REN_ELC', unit: 'PC' } },
  { page: 'energy', key: 'rese', field: EU, dataset: 'nrg_ind_ren', params: { nrg_bal: 'REN_ELC', unit: 'PC' } },
  { page: 'energy', key: 'imp', dataset: 'nrg_ind_id', params: { siec: 'TOTAL', unit: 'PC' } },
  { page: 'energy', key: 'imp', field: EU, dataset: 'nrg_ind_id', params: { siec: 'TOTAL', unit: 'PC' } },
  { page: 'energy', key: 'intens', dataset: 'nrg_ind_ei', params: { nrg_bal: 'EI_GDP_PPS', unit: 'KGOE_TEUR_PPS' } },
  { page: 'energy', key: 'intens', field: EU, dataset: 'nrg_ind_ei', params: { nrg_bal: 'EI_GDP_PPS', unit: 'KGOE_TEUR_PPS' } },
];

// Източници без API — обновяват се ръчно (или от Claude по подсказката в .claude/commands/update-data.md).
export const MANUAL = [
  { what: 'Население към 31.12 (страна и области), раждания и умирания по области', where: 'НСИ — https://www.nsi.bg/statistical-data/206 (файлове Pop_6.1.1, Pop_6.1.7)', files: ['src/pages/population.js (pop)', 'src/data/oblasts.js', 'src/lib/format.js (POPULATION)'], when: 'април–юни' },
  { what: 'Изселили се българи', where: 'НСИ — Pop_5.8_Migration_DR_EN.xlsx', files: ['src/pages/population.js (emig)'], when: 'април–юни' },
  { what: 'Дефицит и дълг (окончателни), млн. лв./€', where: 'НСИ — нотификационни таблици (април предварителни, октомври окончателни)', files: ['src/pages/budget.js (bal, debt, BAL_BGN, DEBT_BGN)'], when: 'април и октомври' },
  { what: 'Разходи по функции (COFOG)', where: 'Евростат gov_10a_exp (декември–февруари)', files: ['src/pages/budget.js (секция „За какво харчи държавата“)'], when: 'зима' },
  { what: 'Средна заплата (страна и области), безработица по области', where: 'НСИ — Labour_2.2.2, Labour_3.2.3; Статистически справочник', files: ['src/pages/economy.js (wage)', 'src/data/oblasts.js'], when: 'май–юни' },
  { what: 'Максимален осигурителен доход', where: 'Закон за бюджета на ДОО / НОИ', files: ['src/pages/economy.js (maxIns)'], when: 'януари' },
  { what: 'Пенсии и брой пенсионери', where: 'НОИ — статистически бюлетини STATB4<година>.pdf', files: ['src/pages/income.js (pension)'], when: 'пролет' },
  { what: 'БВП на човек по области', where: 'Евростат nama_10r_3gdp (EUR_HAB, NUTS 3)', files: ['src/data/oblasts.js (LATEST.gdp, SERIES.gdp)'], when: 'февруари–март' },
  { what: 'Престъпления и разкриваемост (страна и ОДМВР)', where: 'МВР — Полицейска статистика, годишен бюлетин (STAT_<година>.xlsx)', files: ['src/pages/security.js', 'src/data/oblasts.js'], when: 'януари–февруари' },
  { what: 'Щатна численост на МВР', where: 'МВР / Доклад за състоянието на администрацията', files: ['src/pages/security.js (staff)'], when: 'при публикуване' },
  { what: 'Щатове и заети места в администрацията', where: 'Министерски съвет — Доклад за състоянието на администрацията (iisda.government.bg)', files: ['src/pages/admin.js'], when: 'май' },
  { what: 'Служители в изпълнителната власт, обществен сектор', where: 'НСИ — Labour_1.1.5, Labour_2.1.1', files: ['src/pages/admin.js'], when: 'пролет' },
  { what: 'Натовареност на съдилищата', where: 'ВСС — обобщени статистически таблици (vss.justice.bg/page/view/1082)', files: ['src/pages/justice.js (fast, courts)'], when: 'март–април' },
  { what: 'Осъдени (общо, за подкуп), осъдени по области', where: 'НСИ — Престъпления и осъдени лица; JST_3.1.xlsx', files: ['src/pages/justice.js', 'src/data/oblasts.js (LATEST.conv)'], when: 'юни' },
  { what: 'Индекс за възприятие на корупцията', where: 'Transparency International — CPI (публикува се в края на януари)', files: ['src/pages/justice.js (cpi)'], when: 'февруари' },
  { what: 'Осигурени лица', where: 'НОИ — отчет за изпълнението на бюджета на ДОО', files: ['src/pages/taxes.js („Кой плаща“)'], when: 'пролет' },
  { what: 'Здраве по области (лекари, легла, продължителност на живота, детска смъртност)', where: 'НСИ — Zdr_2.2.3, Zdr_2.1.2, Pop_3.4, Pop_2.5', files: ['src/data/oblasts.js (LATEST)'], when: 'юни' },
  { what: 'Производство на ток по източници', where: 'Евростат nrg_bal_peh', files: ['src/pages/energy.js (секция за източниците)'], when: 'февруари' },
  { what: 'Нетен износ на ток, парникови емисии', where: 'Евростат nrg_cb_e, sdg_13_10 / env_air_gge', files: ['src/pages/energy.js (exp, ghg)'], when: 'пролет' },
  { what: 'PISA', where: 'ОИСР (на всеки 3 години)', files: ['src/pages/health.js (таблица PISA)'], when: 'декември' },
];
