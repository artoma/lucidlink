import { StockValue } from "@lucidlink-interview/api-types";
import { Injectable } from "@nestjs/common";


@Injectable()
export class DataService {
  	private stockValues: StockValue[] = [];

  	generateStaticData(dateTime: number) {

    	dateTime = parseInt(dateTime.toString());

		const minMaxValues = [
			{ min: 21, max: 40 },
			{ min: 40, max: 44 },
			{ min: 30, max: 44 },
			{ min: 22, max: 44 },
			{ min: 27, max: 60 },
			{ min: 35, max: 40 },
			{ min: 25, max: 47 },
			{ min: 16, max: 35 },
			{ min: 35, max: 60 },
			{ min: 19, max: 40 },
		];
		for (let i = 0; i < 10; i++) {
			const day: StockValue[] = this.generateDayData(
				minMaxValues[i].min,
				minMaxValues[i].max,
				dateTime
			);
			this.stockValues.push(...day);
			dateTime += 86400000;
		}
  }

	private generateDayData(
		min: number,
		max: number,
		startOfTheDay: number
	): StockValue[] {

		const dayDataSet: StockValue[] = [];
		startOfTheDay = parseInt(startOfTheDay.toString());

		for (let i = 0; i < 86400; i++) {
			const n = Math.random() * (max - min) + min;
			const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
			dayDataSet.push({
					timeStamp: startOfTheDay,
					price: rounded,
				} as StockValue);
			startOfTheDay += 1000;
		}
		return dayDataSet;
	}

  	getData(): StockValue[] {
    	return this.stockValues;
  	}
}