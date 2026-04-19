/*eslint-disable*/
'use client';

import DashboardLayout from '@/components/layout';
import { organizerRoutes } from '@/components/routes';
import { User } from '@supabase/supabase-js';
import type { IRoute } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import {
  Award,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Clock3,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
  title?: string;
  description?: string;
  routes?: IRoute[];
  signInPath?: string;
}

const monthlyActivitySeries = [
  {
    name: 'Đơn đăng ký tham gia',
    data: [48, 56, 61, 72, 78, 84]
  },
  {
    name: 'Người tham gia thực tế',
    data: [31, 39, 44, 52, 58, 65]
  }
];

const monthlyActivityOptions: any = {
  chart: {
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  colors: ['#0f766e', '#2563eb'],
  stroke: {
    width: 3,
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
  tooltip: {
    theme: 'dark'
  }
};

const defaultTopHosts = [
  { name: 'Trần Đức Lợi', events: 18, hours: 420 },
  { name: 'Nguyễn Minh Châu', events: 15, hours: 366 },
  { name: 'Phạm Bảo Ngọc', events: 13, hours: 314 },
  { name: 'Lê Khánh Linh', events: 12, hours: 295 },
  { name: 'Võ Gia Hân', events: 10, hours: 248 }
];

const safeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const firstNumber = (
  source: Record<string, any> | null | undefined,
  keys: string[],
  fallback = 0
) => {
  if (!source) return fallback;

  for (const key of keys) {
    const nextValue = source[key];
    const normalized = safeNumber(nextValue);
    if (normalized !== 0 || nextValue === 0) {
      return normalized;
    }
  }

  return fallback;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

const getVietnamGreeting = () => {
  const currentHour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh'
    }).format(new Date())
  );

  if (currentHour >= 5 && currentHour < 12) {
    return 'Chào buổi sáng';
  }

  if (currentHour >= 12 && currentHour < 18) {
    return 'Chào buổi chiều';
  }

  return 'Chào buổi tối';
};

export default function OrganizerMainDashboard(props: Props) {
  const organizationName =
    props.userDetails?.organization_name ||
    props.userDetails?.organizationName ||
    'Tổ chức của bạn';
  const greeting = getVietnamGreeting();
  const displayName =
    props.user?.user_metadata?.username ||
    props.user?.user_metadata?.full_name ||
    props.user?.email?.split('@')[0] ||
    organizationName;

  const totalHosts = firstNumber(props.userDetails, [
    'totalHosts',
    'hostCount',
    'hostsCount'
  ]);
  const totalEvents = firstNumber(props.userDetails, [
    'hostedEventCount',
    'totalEvents',
    'eventCount'
  ]);
  const activeEvents = firstNumber(props.userDetails, [
    'ongoingEventCount',
    'activeEventCount',
    'currentEventCount'
  ]);
  const endedEventsThisMonth = firstNumber(
    props.userDetails,
    [
      'endedEventCountThisMonth',
      'finishedEventCountThisMonth',
      'monthlyEndedEventCount'
    ],
    totalEvents
  );
  const monthlyApplications = firstNumber(props.userDetails, [
    'monthlyApplicationCount',
    'applicationCountThisMonth',
    'applicationsThisMonth'
  ]);
  const monthlyAttendedApplications = firstNumber(props.userDetails, [
    'monthlyAttendedApplicationCount',
    'attendedApplicationCountThisMonth',
    'attendedApplicationsThisMonth'
  ]);
  const monthlyCreditHour = firstNumber(
    props.userDetails,
    ['monthlyCreditHour', 'creditHourThisMonth', 'monthlyHours'],
    firstNumber(props.userDetails, ['creditHour'])
  );
  const avgRating = firstNumber(props.userDetails, [
    'avgRating',
    'averageRating',
    'rating'
  ]);
  const ratingCount = firstNumber(props.userDetails, [
    'ratingCount',
    'totalRatingCount',
    'reviewCount'
  ]);

  const topHosts = (
    Array.isArray(props.userDetails?.topHostsLastMonth)
      ? props.userDetails.topHostsLastMonth
      : Array.isArray(props.userDetails?.topHosts)
        ? props.userDetails.topHosts
        : defaultTopHosts
  ) as Array<{
    name: string;
    events: number;
    hours: number;
  }>;

  const metricCards = [
    {
      label: 'Số lượt rate',
      value: ratingCount > 0 ? formatNumber(ratingCount) : '--',
      detail:
        ratingCount > 0
          ? 'Số lượng đánh giá đã ghi nhận'
          : 'Chưa có dữ liệu lượt rate',
      icon: Star,
      cardClass: 'from-amber-50 to-white',
      iconClass: 'text-amber-700'
    },
    {
      label: 'Số host trong tổ chức',
      value: formatNumber(totalHosts),
      detail:
        totalHosts > 0 ? 'Host đang hoạt động và quản lý' : 'Chưa có dữ liệu',
      icon: Users,
      cardClass: 'from-emerald-50 to-white',
      iconClass: 'text-emerald-700'
    },
    {
      label: 'Số sự kiện đang diễn ra của tổ chức',
      value: formatNumber(activeEvents),
      detail:
        activeEvents > 0
          ? 'Đang được theo dõi theo thời gian thực'
          : 'Chưa cập nhật',
      icon: CalendarCheck,
      cardClass: 'from-sky-50 to-white',
      iconClass: 'text-sky-700'
    },
    {
      label: 'Số sự kiện đã kết thúc trong tháng',
      value: formatNumber(endedEventsThisMonth),
      detail:
        endedEventsThisMonth > 0
          ? `Tổng sự kiện của tổ chức: ${formatNumber(totalEvents)}`
          : 'Chưa có số liệu tháng này',
      icon: ClipboardList,
      cardClass: 'from-violet-50 to-white',
      iconClass: 'text-violet-700'
    },
    {
      label: 'Tỉ lệ vắng mặt trong tháng',
      value:
        monthlyApplications > 0
          ? `${(((monthlyApplications - monthlyAttendedApplications) / monthlyApplications) * 100).toFixed(1)}%`
          : '--',
      detail:
        monthlyApplications > 0
          ? `Tính từ ${formatNumber(monthlyApplications)} đơn đăng ký`
          : 'Chưa có dữ liệu hàng tháng',
      icon: TrendingUp,
      cardClass: 'from-rose-50 to-white',
      iconClass: 'text-rose-700'
    },
    {
      label: 'Số giờ credit hour tích lũy trong tháng',
      value: `${formatNumber(monthlyCreditHour)}h`,
      detail:
        monthlyCreditHour > 0
          ? 'Credit hour đã ghi nhận trong tháng'
          : 'Chưa có dữ liệu credit hour',
      icon: Clock3,
      cardClass: 'from-cyan-50 to-white',
      iconClass: 'text-cyan-700'
    }
  ];

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title={props.title ?? 'Bảng điều khiển tổ chức'}
      description={props.description ?? 'Hiệu suất vận hành và nhân sự nội bộ'}
      routes={props.routes ?? organizerRoutes}
      colorVariant="organizer"
      signInPath={props.signInPath ?? '/signin/password_signin'}
    >
      <div className="mx-auto w-full max-w-7xl pb-10">
        <Card className="overflow-hidden border-zinc-200 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">
                Bảng điều khiển organizer
              </Badge>
              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                {greeting}, Quản trị viên {displayName}!
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
                Theo dõi nhanh tình trạng host, tiến độ sự kiện và các chỉ số
                vận hành quan trọng của tổ chức trong một màn hình.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                  Host
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatNumber(totalHosts)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                  Sự kiện
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatNumber(totalEvents)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                  Rating
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : '--'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-400">
                  Credit hour
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {formatNumber(monthlyCreditHour)}h
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.label}
                className="border-zinc-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`rounded-2xl bg-gradient-to-br ${metric.cardClass} p-4`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-600">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950">
                        {metric.value}
                      </p>
                      <p className="mt-2 text-xs font-medium text-zinc-600">
                        {metric.detail}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/80 shadow-sm">
                      <Icon className={`h-5 w-5 ${metric.iconClass}`} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
          <Card className="border-zinc-200 bg-white p-5 shadow-sm xl:col-span-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-zinc-700" />
                  <h3 className="text-lg font-bold text-zinc-950">
                    Số đơn đăng ký và số người tham gia thực tế theo tháng
                  </h3>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  So sánh số đơn đăng ký với số người tham gia thực tế, từ đó
                  theo dõi tỷ lệ tham gia và tỷ lệ vắng mặt của tổ chức.
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ApexChart
                type="line"
                options={monthlyActivityOptions}
                series={monthlyActivitySeries}
                height="100%"
                width="100%"
              />
            </div>
          </Card>

          <Card className="border-zinc-200 bg-white p-5 shadow-sm xl:col-span-5">
            <div className="mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-zinc-700" />
              <div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Top host của tháng trước
                </h3>
                <p className="text-sm text-zinc-500">
                  Xếp hạng theo số sự kiện và credit hour.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {topHosts.slice(0, 5).map((host, index) => (
                <div
                  key={`${host.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {host.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatNumber(safeNumber(host.hours))}h credit hour
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-zinc-300 text-zinc-700"
                  >
                    {formatNumber(safeNumber(host.events))} sự kiện
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Sự kiện đang diễn ra
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-950">
                  {formatNumber(activeEvents)}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Sự kiện kết thúc tháng này
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-950">
                  {formatNumber(endedEventsThisMonth)}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Credit hour tháng này
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-950">
                  {formatNumber(monthlyCreditHour)}h
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
