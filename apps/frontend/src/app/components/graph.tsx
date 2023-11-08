import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import CurrencyInput from 'react-currency-input-field';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GraphComponentProps {}

const GraphComponent: React.FC<GraphComponentProps> = () => {
    const [data, setData] = useState([]);
    const [dateTimeValue, updateDateTime] = useState<Value>([
        new Date(1698181200000),
        new Date(1699045199000),
    ]);
    const [bestBuyTime, setBestBuyTime] = useState(0);
    const [bestSellTime, setBestSellTime] = useState(0);
    const [bestBuyPrice, setbestBuyPrice] = useState(0);
    const [bestSellPrice, setBestSellPrice] = useState(0);
    const [profit, setProfit] = useState<number | undefined>(0);

    useEffect(() => {
        const startDate = 1698181200000;
        const endDate = 1699045199000;
        const loadData = async (apiUrl: string) => {
            const res = await axios.get(apiUrl);
            setData(res.data);
        };
        loadData(
            `http://localhost:4939/api/graph?startDate=${startDate}&endDate=${endDate}`
        );
    }, []);

    useEffect(() => {
        const chartUpdatedEvent = () => {
            const chart = ApexCharts.getChartByID('stockChart');
            if (bestBuyTime && bestSellPrice) {
                chart?.addPointAnnotation({
                    x: bestBuyTime,
                    y: bestBuyPrice,
                    label: {
                        text: 'Best BUY: $' + bestBuyPrice,
                        style: { background: '#FDB01A' },
                    },
                });

                chart?.addPointAnnotation({
                    x: bestSellTime,
                    y: bestSellPrice,
                    label: {
                        text: 'Best SELL: $' + bestSellPrice,
                        style: { background: '#FDB01A' },
                    },
                });
            }
        };
        chartUpdatedEvent();
    }, [bestBuyPrice, bestBuyTime, bestSellPrice, bestSellTime, data]);

    const loadIntervalData = async (apiUrl: string) => {
        const res = await axios.get(apiUrl);
        setData(res.data.interval);
        setBestBuyTime(res.data.bestBuyTime);
        setBestSellTime(res.data.bestSellTime);
        setbestBuyPrice(res.data.bestBuyPrice);
        setBestSellPrice(res.data.bestSellPrice);
    };

    const buttonClick = async () => {
        const dateRangeArray = dateTimeValue as [Date, Date];
        const startDate = Date.parse(dateRangeArray[0].toString());
        const endDate = Date.parse(dateRangeArray[1].toString());
        const apiUrl = `http://localhost:4939/api?startDate=${startDate}&endDate=${endDate}&amount=${111}`;

        await loadIntervalData(apiUrl);
    };

    const validateValue = (value: string | undefined): void => {
        const rawValue = value === undefined ? 'undefined' : value;
        const parsedValue = parseFloat(rawValue.toString()).toFixed(2);

        const potentialProfit = ( parseFloat(parsedValue.toString()) / bestBuyPrice)*bestSellPrice;
        setProfit( potentialProfit || 0);
    };

    const series: ApexAxisChartSeries = [
        {
            name: 'ZOD-MOTORS',
            data: data?.map((item) => item),
        },
    ];

    const options: ApexOptions = {
        chart: {
            id: 'stockChart',
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true,
            },
            toolbar: {
                autoSelected: 'zoom',
            },
        },
        stroke: {
            width: 1,
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
        },
        title: {
            text: 'Stock Price Movement',
            align: 'left',
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
            },
        },
        yaxis: {
            labels: {
                formatter: function (val: number) {
                    return '$' + val.toFixed(2);
                },
            },
            title: {
                text: 'Price',
            },
        },
        xaxis: {
            type: 'datetime',
            title: {
                text: 'Date Time',
            },
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val: number) {
                    return '$' + val.toFixed(2);
                },
            },
            x: {
                formatter: function (val: number) {
                    return new Date(val).toString();
                },
            },
        },
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
            />
            <DateTimeRangePicker
                minDate={new Date(1698181200000)}
                maxDate={new Date(1699045199000)}
                onChange={updateDateTime}
                value={dateTimeValue}
            />
            <p>
                <CurrencyInput
                    prefix="$"
                    id="input-example"
                    name="input-name"
                    placeholder="Please enter a number"
                    defaultValue={1000}
                    decimalsLimit={2}
                    onValueChange={validateValue}
                />
            </p>
            <p>Profit: {profit}</p>
            <Button onClick={buttonClick} variant="primary">
                Submit
            </Button>
        </div>
    );
};

export default GraphComponent;
