export interface StockValue {
  timeStamp: number;
  price: number;
}

export interface AnalyzerResult {
  maxProfit: number;
  bestBi: number;
  bestSi: number;
} 

export interface IntervalAnalyzerResult {
  maxProfit: number;
  bestBuyPrice: number;
  bestSellPrice: number;
  bestBuyTime: number;
  bestSellTime: number;
  interval: [];
} 

export interface DailyPrices {
  total: number,
  offset: number,
  results: DailyPrice[],
  responseStatus: string | null
}
export interface DailyPrice {
  date: string,
  open: number,
  high: number,
  low: number,
  last: number,
  volume: number
}

export interface APIResponse {
  results: DailyPrice[]
}