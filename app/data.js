// StatAtlas data: 24 countries, 9 indicators, 216 figures.
// Every figure comes from the World Bank's World Development Indicators,
// fetched from the World Bank API on 2026-11-26. Years are shown per
// indicator below; nothing here is estimated or invented. Where the Bank
// has no value for a country, the value is null and the site shows a dash.

export const SOURCE_NOTE = 'World Bank, World Development Indicators';
export const FETCHED_ON = '2026-11-26';

export const INDICATORS = [
  { id: 'pop', label: 'Population', unit: 'people', code: 'SP.POP.TOTL', year: 2023,
    about: 'Total population, mid-year.', format: 'pop', higherIsBetter: true },
  { id: 'gdppc', label: 'GDP per capita', unit: 'current US$', code: 'NY.GDP.PCAP.CD', year: 2023,
    about: 'Gross domestic product divided by mid-year population.', format: 'money', higherIsBetter: true },
  { id: 'growth', label: 'GDP growth', unit: 'annual %', code: 'NY.GDP.MKTP.KD.ZG', year: 2023,
    about: 'Annual percentage growth of GDP at market prices, constant local currency.', format: 'pct', higherIsBetter: true },
  { id: 'life', label: 'Life expectancy', unit: 'years', code: 'SP.DYN.LE00.IN', year: 2023,
    about: 'Years a newborn would live if mortality patterns at birth stayed the same.', format: 'years', higherIsBetter: true },
  { id: 'unemp', label: 'Unemployment', unit: '% of labour force', code: 'SL.UEM.TOTL.ZS', year: 2023,
    about: 'Share of the labour force without work but available for and seeking employment (ILO modelled). Lower is better.', format: 'pct', higherIsBetter: false },
  { id: 'infl', label: 'Inflation', unit: 'annual %', code: 'FP.CPI.TOTL.ZG', year: 2023,
    about: 'Annual change in consumer prices. Lower is steadier.', format: 'pct', higherIsBetter: false },
  { id: 'internet', label: 'Internet users', unit: '% of population', code: 'IT.NET.USER.ZS', year: 2023,
    about: 'People who used the Internet in the last 3 months.', format: 'pct', higherIsBetter: true },
  { id: 'co2', label: 'CO2 per capita', unit: 'tonnes', code: 'EN.GHG.CO2.PC.CE.AR5', year: 2022,
    about: 'Carbon dioxide emissions per person, from fuel combustion and industry. Lower is cleaner.', format: 'tonnes', higherIsBetter: false },
  { id: 'fertility', label: 'Fertility rate', unit: 'births per woman', code: 'SP.DYN.TFRT.IN', year: 2023,
    about: 'Children a woman would have if she lived through her childbearing years at current rates.', format: 'num', higherIsBetter: false },
];

export const COUNTRIES = [
  { code: 'USA', name: 'United States', capital: 'Washington, D.C.', region: 'North America', income: 'High income', pop: 336755052, gdppc: 82587.0, growth: 2.93, life: 78.39, unemp: 3.64, infl: 4.12, internet: 93.5, co2: 14.42, fertility: 1.62 },
  { code: 'CHN', name: 'China', capital: 'Beijing', region: 'East Asia', income: 'Upper-middle income', pop: 1410710000, gdppc: 12951.0, growth: 5.42, life: 77.95, unemp: 4.67, infl: 0.23, internet: 90.6, co2: 8.86, fertility: 1.0 },
  { code: 'IND', name: 'India', capital: 'New Delhi', region: 'South Asia', income: 'Lower-middle income', pop: 1438069596, gdppc: 2434.0, growth: 7.21, life: 72.0, unemp: 4.17, infl: 5.65, internet: 60.3, co2: 1.97, fertility: 1.98 },
  { code: 'JPN', name: 'Japan', capital: 'Tokyo', region: 'East Asia', income: 'High income', pop: 124516650, gdppc: 35215.0, growth: 0.72, life: 84.04, unemp: 2.6, infl: 3.27, internet: 85.0, co2: 8.4, fertility: 1.2 },
  { code: 'DEU', name: 'Germany', capital: 'Berlin', region: 'Western Europe', income: 'High income', pop: 83287273, gdppc: 54777.0, growth: -0.87, life: 81.04, unemp: 3.07, infl: 5.95, internet: 92.5, co2: 7.91, fertility: 1.39 },
  { code: 'GBR', name: 'United Kingdom', capital: 'London', region: 'Northern Europe', income: 'High income', pop: 68526000, gdppc: 49920.0, growth: 0.27, life: 81.24, unemp: 4.03, infl: 6.79, internet: 95.4, co2: 4.81, fertility: 1.56 },
  { code: 'FRA', name: 'France', capital: 'Paris', region: 'Western Europe', income: 'High income', pop: 68372286, gdppc: 44700.0, growth: 1.44, life: 82.83, unemp: 7.33, infl: 4.88, internet: 86.8, co2: 4.51, fertility: 1.66 },
  { code: 'ITA', name: 'Italy', capital: 'Rome', region: 'Southern Europe', income: 'High income', pop: 58984216, gdppc: 39280.0, growth: 0.92, life: 83.35, unemp: 7.63, infl: 5.62, internet: 87.0, co2: 5.61, fertility: 1.21 },
  { code: 'CAN', name: 'Canada', capital: 'Ottawa', region: 'North America', income: 'High income', pop: 40049088, gdppc: 54848.0, growth: 1.95, life: 81.63, unemp: 5.42, infl: 3.88, internet: 94.1, co2: 14.78, fertility: 1.27 },
  { code: 'KOR', name: 'South Korea', capital: 'Seoul', region: 'East Asia', income: 'High income', pop: 51712619, gdppc: 35674.0, growth: 1.58, life: 83.43, unemp: 2.67, infl: 3.6, internet: 97.4, co2: 11.87, fertility: 0.72 },
  { code: 'BRA', name: 'Brazil', capital: 'Brasília', region: 'South America', income: 'Upper-middle income', pop: 211140729, gdppc: 10378.0, growth: 3.24, life: 75.85, unemp: 7.95, infl: 4.59, internet: 84.2, co2: 2.28, fertility: 1.62 },
  { code: 'AUS', name: 'Australia', capital: 'Canberra', region: 'Oceania', income: 'High income', pop: 26659922, gdppc: 65058.0, growth: 3.58, life: 83.05, unemp: 3.67, infl: 5.6, internet: 96.1, co2: 14.53, fertility: 1.5 },
  { code: 'ESP', name: 'Spain', capital: 'Madrid', region: 'Southern Europe', income: 'High income', pop: 48352528, gdppc: 33493.0, growth: 2.46, life: 83.93, unemp: 12.18, infl: 3.53, internet: 95.4, co2: 4.99, fertility: 1.12 },
  { code: 'MEX', name: 'Mexico', capital: 'Mexico City', region: 'North America', income: 'Upper-middle income', pop: 129739759, gdppc: 13831.0, growth: 3.11, life: 75.07, unemp: 2.77, infl: 5.53, internet: 81.2, co2: 3.52, fertility: 1.91 },
  { code: 'IDN', name: 'Indonesia', capital: 'Jakarta', region: 'South-eastern Asia', income: 'Upper-middle income', pop: 281190067, gdppc: 4876.0, growth: 5.05, life: 71.15, unemp: 3.31, infl: 3.67, internet: 69.2, co2: 2.59, fertility: 2.13 },
  { code: 'NLD', name: 'Netherlands', capital: 'Amsterdam', region: 'Western Europe', income: 'High income', pop: 17877117, gdppc: 63516.0, growth: -0.6, life: 81.86, unemp: 3.54, infl: 3.84, internet: 97.0, co2: 7.52, fertility: 1.43 },
  { code: 'SAU', name: 'Saudi Arabia', capital: 'Riyadh', region: 'Western Asia', income: 'High income', pop: 33702731, gdppc: 36157.0, growth: 0.54, life: 78.73, unemp: 4.01, infl: 2.47, internet: 100, co2: 19.28, fertility: 2.28 },
  { code: 'CHE', name: 'Switzerland', capital: 'Bern', region: 'Western Europe', income: 'High income', pop: 8888822, gdppc: 104450.0, growth: 0.83, life: 84.16, unemp: 4.04, infl: 2.14, internet: 97.3, co2: 3.93, fertility: 1.33 },
  { code: 'TUR', name: 'Türkiye', capital: 'Ankara', region: 'Western Asia', income: 'Upper-middle income', pop: 85325965, gdppc: 13375.0, growth: 5.05, life: 77.16, unemp: 9.39, infl: 53.86, internet: 86.0, co2: 5.23, fertility: 1.51 },
  { code: 'NGA', name: 'Nigeria', capital: 'Abuja', region: 'Western Africa', income: 'Lower-middle income', pop: 227882945, gdppc: 2139.0, growth: 3.32, life: 54.46, unemp: 3.07, infl: 24.66, internet: 40.1, co2: 0.58, fertility: 4.48 },
  { code: 'RUS', name: 'Russia', capital: 'Moscow', region: 'Eastern Europe', income: 'Upper-middle income', pop: 143826130, gdppc: 13987.0, growth: 4.07, life: 73.25, unemp: 3.08, infl: 5.87, internet: 92.2, co2: 13.14, fertility: 1.41 },
  { code: 'ARG', name: 'Argentina', capital: 'Buenos Aires', region: 'South America', income: 'Upper-middle income', pop: 45538401, gdppc: 14262.0, growth: -1.86, life: 77.39, unemp: 6.14, infl: 133.49, internet: 89.2, co2: 4.3, fertility: 1.5 },
  { code: 'SWE', name: 'Sweden', capital: 'Stockholm', region: 'Northern Europe', income: 'High income', pop: 10536632, gdppc: 54950.0, growth: -0.2, life: 83.31, unemp: 7.61, infl: 8.55, internet: 95.7, co2: 3.6, fertility: 1.45 },
  { code: 'SGP', name: 'Singapore', capital: 'Singapore', region: 'South-eastern Asia', income: 'High income', pop: 5917648, gdppc: 86383.0, growth: 1.45, life: 83.1, unemp: 3.44, infl: 4.83, internet: 94.3, co2: 10.0, fertility: 0.97 },
];
