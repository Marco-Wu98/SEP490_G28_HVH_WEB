'use client';

import LineChart from '@/components/charts/LineChart';
import { Card } from '@/components/ui/card';
import { lineChartDataMain, lineChartOptionsMain } from '@/variables/charts';
import { HiChartBar } from 'react-icons/hi2';

function OverallRevenue() {
  const newOptions = {
    ...lineChartOptionsMain
  };

  return (
    <Card
      className={'w-full border-zinc-200 bg-white p-6 text-zinc-950 shadow-sm'}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 text-4xl text-zinc-950">
          <HiChartBar className="h-5 w-5" />
        </div>
        <div>
          <h5 className="text-sm font-medium leading-5 text-zinc-950">
            Mức sử dụng tín dụng trong năm qua
          </h5>
          <p className="mt-1 text-2xl font-bold leading-6 text-zinc-950">
            149,758
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="flex h-[350px] w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <LineChart chartData={lineChartDataMain} chartOptions={newOptions} />
        </div>
      </div>
    </Card>
  );
}

export default OverallRevenue;
