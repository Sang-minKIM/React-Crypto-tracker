import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
interface ChartProps {
  coinId: string;
  name: string;
}
interface IData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}
function Chart() {
  const { coinId, name } = useOutletContext<ChartProps>();
  const { isLoading, data } = useQuery<IData[]>(
    ["price in chart", coinId],
    () => fetchCoinHistory(coinId)
  );
  const isDark = useRecoilValue(isDarkAtom);
  const exceptData = data ?? [];
  const chartData = exceptData?.map((i) => {
    return {
      x: i.time_close,
      y: [
        Number(i.open).toFixed(2),
        Number(i.high).toFixed(2),
        Number(i.low).toFixed(2),
        Number(i.close).toFixed(2),
      ],
    };
  });

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: chartData,
            },
          ]}
          options={{
            chart: {
              type: "candlestick",
              height: 350,
              background: "transparent",
              toolbar: {
                show: false,
              },
            },
            title: {
              text: `${name} chart`,
              align: "center",
              style: {
                fontSize: "17px",
              },
            },
            xaxis: {
              type: "datetime",
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#ff5e57",
                  downward: "#0fbcf9",
                },
                wick: {
                  useFillColor: true,
                },
              },
            },
            theme: {
              mode: isDark ? "dark" : "light",
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
