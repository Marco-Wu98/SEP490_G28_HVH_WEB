/*eslint-disable*/
'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import type { IRoute } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import {
  Activity,
  Building,
  CalendarCheck,
  Clock3,
  ShieldAlert,
  Users
} from 'lucide-react';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  title?: string;
  description?: string;
  routes?: IRoute[];
  colorVariant?: 'admin' | 'organizer';
  signInPath?: string;
}

const growthSeries = [
  {
    name: 'TNV mới',
    data: [220, 260, 300, 345, 380, 420]
  },
  {
    name: 'Giờ uy tín (x100)',
    data: [180, 210, 260, 290, 330, 390]
  }
];

const growthOptions: any = {
  chart: {
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  colors: ['#0f766e', '#1d4ed8'],
  stroke: {
    width: [3, 3],
    curve: 'smooth'
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: '#e4e4e7',
    strokeDashArray: 4
  },
  xaxis: {
    categories: ['T11', 'T12', 'T1', 'T2', 'T3', 'T4'],
    labels: { style: { colors: '#52525b', fontWeight: 600 } }
  },
  yaxis: {
    labels: { style: { colors: '#52525b', fontWeight: 600 } }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  tooltip: {
    theme: 'dark'
  }
};

const domainSeries = [34, 23, 19, 14, 10];

const domainOptions: any = {
  chart: {
    type: 'donut',
    fontFamily: 'inherit'
  },
  labels: ['Môi trường', 'Giáo dục', 'Y tế', 'Cộng đồng', 'Khác'],
  colors: ['#2563eb', '#0d9488', '#f59e0b', '#e11d48', '#6b7280'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  plotOptions: {
    pie: {
      donut: {
        size: '72%'
      }
    }
  },
  stroke: {
    width: 0
  }
};

const kpis = [
  {
    label: 'Tổng TNV đã xác thực',
    value: '12,584',
    trend: '+8.3% so với tháng trước',
    icon: Users
  },
  {
    label: 'Tổng tổ chức hoạt động',
    value: '486',
    trend: '+3.1% so với tháng trước',
    icon: Building
  },
  {
    label: 'Tổng giờ uy tín tích lũy',
    value: '1,204,672h',
    trend: '+11.2% so với tháng trước',
    icon: Clock3
  },
  {
    label: 'Tổng sự kiện đã tổ chức',
    value: '3,972',
    trend: '+5.6% so với tháng trước',
    icon: CalendarCheck
  }
];

const integrityAlerts = [
  {
    title: 'Tỷ lệ vắng mặt bất thường',
    description: '3 tổ chức có tỷ lệ check-in < 45% trong 14 ngày gần nhất.',
    severity: 'Cao',
    events: [
      {
        name: 'Hiến máu nhân đạo - Đợt 2',
        organization: 'CLB Tình Nguyện Thanh Xuân'
      },
      {
        name: 'Dọn rác Hồ Tây cuối tuần',
        organization: 'Nhóm Thiện Nguyện Cầu Giấy'
      },
      {
        name: 'Lớp học kỹ năng cho trẻ em',
        organization: 'Quỹ Hỗ trợ Xanh Hà Nội'
      }
    ]
  },
  {
    title: 'Tài khoản bị khóa mới',
    description: '8 tài khoản TNV bị khóa do vi phạm chính sách hành vi.',
    severity: 'Thấp',
    accounts: ['Lê Minh Đức', 'Phạm Thu Thảo', 'Hoàng Nam']
  }
];

const quickHealthMetrics = [
  { label: 'Tỷ lệ check-in trung bình', value: '86.2%' },
  { label: 'Khiếu nại tồn đọng', value: '17' }
];

export default function Main(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title={props.title ?? 'Bảng điều khiển'}
      description={props.description ?? 'Tổng quan chiến lược toàn hệ thống'}
      routes={props.routes}
      colorVariant={props.colorVariant}
      signInPath={props.signInPath}
    >
      <div className="mx-auto w-full max-w-7xl pb-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card
                key={kpi.label}
                className="border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-500">
                      {kpi.label}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-950">
                      {kpi.value}
                    </p>
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      {kpi.trend}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
                    <Icon className="h-5 w-5 text-zinc-700" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
          {quickHealthMetrics.map((metric) => (
            <Card
              key={metric.label}
              className="border-zinc-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                {metric.label}
              </p>
              <p className="mt-2 text-xl font-bold text-zinc-950">
                {metric.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="border-zinc-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Tăng trưởng 6 tháng
                </h3>
                <p className="text-sm text-zinc-500">
                  Biến động TNV mới và giờ uy tín theo tháng
                </p>
              </div>
              <Badge className="bg-zinc-900 text-white hover:bg-zinc-900">
                Global Analytics
              </Badge>
            </div>
            <div className="h-[320px] w-full">
              <ApexChart
                type="line"
                options={growthOptions}
                series={growthSeries}
                height="100%"
                width="100%"
              />
            </div>
          </Card>

          <Card className="border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-950">
              Phân bổ lĩnh vực
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Tỷ trọng hoạt động theo domain tình nguyện
            </p>
            <div className="mx-auto mt-2 h-[230px] max-w-[300px]">
              <ApexChart
                type="donut"
                options={domainOptions}
                series={domainSeries}
                height="100%"
                width="100%"
              />
            </div>
            <div className="mt-1 space-y-2">
              {domainOptions.labels.map((label: string, idx: number) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: domainOptions.colors[idx] }}
                    />
                    <p className="text-sm font-medium text-zinc-800">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    {domainSeries[idx]}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-5">
          <Card className="border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-zinc-700" />
              <h3 className="text-lg font-bold text-zinc-950">
                Cảnh báo gian lận
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {integrityAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-900">
                      {alert.title}
                    </p>
                    <Badge
                      className={
                        alert.severity === 'Cao'
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                          : alert.severity === 'Trung bình'
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                      }
                    >
                      <ShieldAlert className="mr-1 h-3.5 w-3.5" />
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600">
                    {alert.description}
                  </p>
                  {alert.events && (
                    <div className="mt-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                        Sự kiện liên quan
                      </p>
                      <div className="mt-2 space-y-2">
                        {alert.events.map((event) => (
                          <div
                            key={`${event.name}-${event.organization}`}
                            className="flex flex-col gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <p className="text-sm font-semibold text-zinc-900">
                              {event.name}
                            </p>
                            <Badge
                              variant="outline"
                              className="border-zinc-300 text-zinc-700"
                            >
                              {event.organization}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {alert.accounts && (
                    <div className="mt-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                        Tài khoản liên quan
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {alert.accounts.map((account) => (
                          <Badge
                            key={account}
                            className="bg-zinc-900 text-white hover:bg-zinc-900"
                          >
                            {account}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
