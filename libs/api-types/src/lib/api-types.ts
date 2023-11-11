export interface StockValue {
  timeStamp: number;
  price: number;
}

export interface AnalyzerResult {
  maxProfit: number;
  bestBi: number;
  bestSi: number;
} 

export interface IntervalAnalyzerDto {
  maxProfit: number;
  bestBuyPrice: number;
  bestSellPrice: number;
  bestBuyTime: number;
  bestSellTime: number;
  interval: [number, number][];
} 

