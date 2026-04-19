'use client';

// Keep chart client-only to avoid SSR issues with ApexCharts.
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function ExampleChart(props: any) {
  const { chartData, chartOptions } = props;

  return (
    <ApexChart
      type="line"
      options={chartOptions}
      series={chartData}
      height="100%"
      width="100%"
    />
  );
}
