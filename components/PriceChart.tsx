"use client"
import { getPriceHistory } from '@/app/actions';
import { RechartsDevtools } from '@recharts/devtools';
import { log } from 'node:console';
import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

const PriceChart = ({ productId }: any) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const history: any = await getPriceHistory(productId);

                const chartData = history.map((item: any) => ({
                    date: new Date(item.checked_at).toLocaleDateString(),
                    price: parseFloat(item.price),
                }));
                setData(chartData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    console.log(data, "dataa");

    return (
        <div>
            {loading ? (
                <p>Loading chart...</p>
            ) : data.length === 0 ? (
                <p>No data available for chart.</p>
            ) :
                <div className="w-full">
                    <h4 className="text-sm font-semibold mb-4 text-gray-700">
                        Price History
                    </h4>
                    <LineChart
                        style={{ width: 300, height: 300, maxWidth: 600 }}
                        responsive
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 5,
                            left: 0,
                        }}
                    >
                        <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="price" stroke="purple" strokeWidth={2} name="Price" />
                        <XAxis
                            dataKey="date"

                        />
                        <YAxis width="auto" label={{ value: 'price', position: 'insideLeft', angle: -90 }} name='Price' />
                        <Legend align="right" />
                        <Tooltip

                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                            }}
                        />
                        <RechartsDevtools />
                    </LineChart>
                </div>}

        </div>
    )
}

export default PriceChart