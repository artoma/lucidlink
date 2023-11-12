import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import AvailableFunds from './available-funds';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const GraphComponent: React.FC = () => {
    const [data, setData] = useState([]);
    const [dateTimeValue, updateDateTime] = useState<Value>([
        new Date(1698181200000),
        new Date(1699045199000),
    ]);
    const [bestBuyTime, setBestBuyTime] = useState(0);
    const [bestSellTime, setBestSellTime] = useState(0);
    const [bestBuyPrice, setbestBuyPrice] = useState(0);
    const [bestSellPrice, setBestSellPrice] = useState(0);
    const [profit, setProfit] = useState<number | 0>(0);
    const [stocksCount, setStocksCount] = useState<number | 0>(0);
    const [disableButton, setDisableButton] = useState(true);
    const [funds, setFunds] = useState(0.0);
    const [bestBuyTimeInfo, setBestBuyTimeInfo] = useState('');
    const [bestSellTimeInfo, setBestSellTimeInfo] = useState('');

    useEffect(() => {
        const loadData = async (apiUrl: string) => {
            const res = await axios.get(apiUrl);
            setData(res.data);
        };
        loadData(`http://localhost:4939/api/graph`);
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

    useEffect(() => {
        if (bestBuyTime > 0 && bestSellTime > 0) {
            setBestBuyTimeInfo(new Date(bestBuyTime).toString());
            setBestSellTimeInfo(new Date(bestSellTime).toString());
        }
    }, [bestBuyTime, bestSellTime]);

    const loadIntervalData = async (apiUrl: string) => {
        const res = await axios.get(apiUrl);
        setData(res.data.interval);
        setBestBuyTime(res.data.bestBuyTime);
        setBestSellTime(res.data.bestSellTime);
        setbestBuyPrice(res.data.bestBuyPrice);
        setBestSellPrice(res.data.bestSellPrice);

        const _stockCount = funds / res.data.bestBuyPrice;
        setStocksCount(_stockCount || 0);
        const buyPrice = _stockCount * res.data.bestBuyPrice;
        const sellPrice = _stockCount * res.data.bestSellPrice;
        setProfit(sellPrice - buyPrice || 0);
    };

    const buttonClick = async () => {
        const dateRangeArray = dateTimeValue as [Date, Date];
        const startDate = Date.parse(dateRangeArray[0].toString());
        const endDate = Date.parse(dateRangeArray[1].toString());
        const apiUrl = `http://localhost:4939/api?startDate=${startDate}&endDate=${endDate}`;

        await loadIntervalData(apiUrl);
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
    const getFunds = (_funds: number) => {
        setFunds(_funds);
        setDisableButton(false);
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
            />
            <Container fluid="md">
                <Row className="my-3">
                    <Col>
                        <label className="control-label">Select period: </label>
                        <DateTimeRangePicker
                            className="form-control"
                            nativeInputAriaLabel=""
                            minDate={new Date(1698181200000)}
                            maxDate={new Date(1699045199000)}
                            onChange={updateDateTime}
                            value={dateTimeValue}
                        />

                        <AvailableFunds getFunds={getFunds} />

                        <Button
                            disabled={disableButton}
                            className="my-1"
                            onClick={buttonClick}
                            variant="primary"
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <b>Result:</b>
                        <br />
                        Buy Date: {bestBuyTimeInfo} <br />
                        Sell Date: {bestSellTimeInfo} <br />
                        Stocks you can buy: {stocksCount.toFixed(2)} <br />
                        Profit: ${profit.toFixed(2)}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default GraphComponent;
