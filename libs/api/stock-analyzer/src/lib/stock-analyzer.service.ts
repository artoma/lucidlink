import { Injectable } from '@nestjs/common';
import {
    StockValue,
    IntervalAnalyzerResult,
    AnalyzerResult,
} from '@lucidlink-interview/api-types';
import { DataService } from '@lucidlink-interview/data';

@Injectable()
export class StockAnalyzerService {
    constructor(private dataService: DataService) {}

    mostProfitInterval(
        startDate: number,
        endDate: number
    ): IntervalAnalyzerResult {
        const stockData: StockValue[] = this.dataService.getData();
        const interval: StockValue[] = stockData.filter(
            (item) => item.timeStamp >= startDate && item.timeStamp <= endDate
        );
        const maxProfitInterval = this.findMaxProfitInterval(interval);
        const shortInterval = interval.slice(
            maxProfitInterval.bestBi - 100,
            maxProfitInterval.bestSi + 100
        );

        return {
            maxProfit: maxProfitInterval.maxProfit,
            bestBuyPrice: interval[maxProfitInterval.bestBi].price,
            bestSellPrice: interval[maxProfitInterval.bestSi].price,
            bestBuyTime: interval[maxProfitInterval.bestBi].timeStamp,
            bestSellTime: interval[maxProfitInterval.bestSi].timeStamp,
            interval: shortInterval.map((item) => [item.timeStamp, item.price]),
        } as IntervalAnalyzerResult;
    }

    private findMaxProfitInterval(
        intervalValues: StockValue[]
    ): AnalyzerResult {
        let maxProfit = 0;
        let bestBPrice = intervalValues[0].price;
        let bi = 0;
        let bestBi = 0;
        let bestSi = 0;

        for (let i = 1; i < intervalValues.length; i++) {
            const currProfit = intervalValues[i].price - bestBPrice;

            if (currProfit > maxProfit) {
                maxProfit = currProfit;
                bestSi = i;
                bestBi = bi;
            }

            if (bestBPrice >= intervalValues[i].price) {
                bestBPrice = intervalValues[i].price;
                bi = i;
            }
        }
        return { maxProfit, bestBi, bestSi } as AnalyzerResult;
    }

    getGraphData() {
        return this.dataService.getData();
    }
}
