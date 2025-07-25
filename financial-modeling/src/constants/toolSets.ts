/**
 * Tool sets configuration based on Financial Modeling Prep API categories
 * Each set contains related functionality that users might want to access together
 */

export type ToolSet =
  | "search"
  | "company"
  | "quotes"
  | "statements"
  | "calendar"
  | "charts"
  | "news"
  | "analyst"
  | "market-performance"
  | "insider-trades"
  | "institutional"
  | "indexes"
  | "economics"
  | "crypto"
  | "forex"
  | "commodities"
  | "etf-funds"
  | "esg"
  | "technical-indicators"
  | "senate"
  | "sec-filings"
  | "earnings"
  | "dcf"
  | "bulk";

export interface ToolSetDefinition {
  name: string;
  description: string;
  modules: string[];
}

/**
 * Comprehensive tool sets mapping based on FMP API structure
 */
export const TOOL_SETS: Record<ToolSet, ToolSetDefinition> = {
  // Basic search and discovery
  search: {
    name: "Search & Directory",
    description:
      "Search for stocks, company information, and directory services",
    modules: ["search", "directory"],
  },

  // Core company data
  company: {
    name: "Company Profile & Info",
    description:
      "Company profiles, executives, employees, and core business information",
    modules: ["company"],
  },

  // Real-time market data
  quotes: {
    name: "Real-time Quotes",
    description: "Real-time stock quotes, price changes, and market data",
    modules: ["quotes"],
  },

  // Financial statements and analysis
  statements: {
    name: "Financial Statements",
    description:
      "Income statements, balance sheets, cash flow, ratios, and financial analysis",
    modules: ["statements"],
  },

  // Events and calendar data
  calendar: {
    name: "Financial Calendar",
    description:
      "Earnings calendar, dividends, IPOs, stock splits, and corporate events",
    modules: ["calendar", "earnings-transcript"],
  },

  // Price charts and historical data
  charts: {
    name: "Price Charts & History",
    description: "Historical price data, charts, and market movements",
    modules: ["chart"],
  },

  // News and press releases
  news: {
    name: "Financial News",
    description: "Market news, press releases, and financial articles",
    modules: ["news"],
  },

  // Analyst coverage
  analyst: {
    name: "Analyst Coverage",
    description:
      "Analyst estimates, price targets, ratings, and recommendations",
    modules: ["analyst"],
  },

  // Market performance metrics
  "market-performance": {
    name: "Market Performance",
    description:
      "Sector performance, market movements, gainers, losers, and most active stocks",
    modules: ["market-performance", "market-hours"],
  },

  // Insider trading data
  "insider-trades": {
    name: "Insider Trading",
    description: "Corporate insider trading activity and ownership changes",
    modules: ["insider-trades"],
  },

  // Institutional ownership
  institutional: {
    name: "Institutional Holdings",
    description: "13F filings, institutional ownership, and fund holdings",
    modules: ["form-13f"],
  },

  // Market indexes
  indexes: {
    name: "Market Indexes",
    description: "Stock market indexes, constituents, and index performance",
    modules: ["indexes"],
  },

  // Economic data
  economics: {
    name: "Economic Data",
    description: "Treasury rates, economic indicators, and macroeconomic data",
    modules: ["economics", "cot"],
  },

  // Cryptocurrency data
  crypto: {
    name: "Cryptocurrency",
    description: "Cryptocurrency prices, charts, and market data",
    modules: ["crypto"],
  },

  // Foreign exchange
  forex: {
    name: "Foreign Exchange",
    description: "Currency pairs, forex rates, and foreign exchange data",
    modules: ["forex"],
  },

  // Commodities trading
  commodities: {
    name: "Commodities",
    description: "Commodity prices, futures, and commodity market data",
    modules: ["commodity"],
  },

  // ETFs and mutual funds
  "etf-funds": {
    name: "ETFs & Mutual Funds",
    description: "ETF and mutual fund holdings, performance, and information",
    modules: ["fund", "fundraisers"],
  },

  // ESG and sustainability
  esg: {
    name: "ESG & Sustainability",
    description: "Environmental, Social, and Governance ratings and data",
    modules: ["esg"],
  },

  // Technical analysis
  "technical-indicators": {
    name: "Technical Indicators",
    description: "Technical analysis indicators like RSI, SMA, EMA, and more",
    modules: ["technical-indicators"],
  },

  // Government trading
  senate: {
    name: "Government Trading",
    description: "Congressional and Senate trading disclosures",
    modules: ["government-trading"],
  },

  // SEC filings
  "sec-filings": {
    name: "SEC Filings",
    description: "SEC filings, regulatory documents, and corporate disclosures",
    modules: ["sec-filings"],
  },

  // Earnings and transcripts
  earnings: {
    name: "Earnings & Transcripts",
    description: "Earnings reports, call transcripts, and earnings analysis",
    modules: ["earnings-transcript"],
  },

  // Valuation models
  dcf: {
    name: "DCF Valuation",
    description: "Discounted cash flow models and company valuations",
    modules: ["dcf"],
  },

  // Bulk data access
  bulk: {
    name: "Bulk Data",
    description: "Bulk data downloads for large-scale analysis",
    modules: ["bulk"],
  },
};

/**
 * Get modules for the specified tool sets
 * @param toolSets Array of tool set names to load
 * @returns Array of module names to register
 */
export function getModulesForToolSets(toolSets: ToolSet[]): string[] {
  const modules = new Set<string>();

  for (const toolSet of toolSets) {
    const definition = TOOL_SETS[toolSet];
    if (definition) {
      definition.modules.forEach((module) => modules.add(module));
    }
  }

  return Array.from(modules);
}

/**
 * Get all available tool sets for help/documentation
 */
export function getAvailableToolSets(): Array<{
  key: ToolSet;
  definition: ToolSetDefinition;
}> {
  return Object.entries(TOOL_SETS).map(([key, definition]) => ({
    key: key as ToolSet,
    definition,
  }));
}
