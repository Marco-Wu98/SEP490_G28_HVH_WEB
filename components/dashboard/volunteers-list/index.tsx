'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Eye,
  Filter as Funnel,
  ListFilter,
  Lock,
  MapPin,
  Plus,
  Star,
  Pencil,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null;
}

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    fullName: 'Nguyễn Văn An',
    cccd: '001234567890',
    phone: '0912345678',
    email: 'nguyenvanan@example.com',
    dob: '15/05/1990',
    events: 12,
    rating: 4.5,
    reputation: 85,
    status: 'active'
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    fullName: 'Trần Thị Bình',
    cccd: '001234567891',
    phone: '0987654321',
    email: 'tranthibinh@example.com',
    dob: '20/08/1995',
    events: 8,
    rating: 4.8,
    reputation: 92,
    status: 'active'
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    fullName: 'Lê Hoàng Cường',
    cccd: '001234567892',
    phone: '0901234567',
    email: 'lehoangcuong@example.com',
    dob: '10/12/1988',
    events: 5,
    rating: 4.2,
    reputation: 78,
    status: 'inactive'
  },
  {
    id: 4,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    fullName: 'Phạm Thị Dung',
    cccd: '001234567893',
    phone: '0923456789',
    email: 'phamthidung@example.com',
    dob: '25/03/1992',
    events: 15,
    rating: 4.9,
    reputation: 95,
    status: 'active'
  },
  {
    id: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    fullName: 'Hoàng Văn Em',
    cccd: '001234567894',
    phone: '0934567890',
    email: 'hoangvanem@example.com',
    dob: '05/07/1993',
    events: 3,
    rating: 3.8,
    reputation: 65,
    status: 'locked'
  },
  {
    id: 6,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    fullName: 'Vũ Minh Phúc',
    cccd: '001234567895',
    phone: '0945678901',
    email: 'vuminhphuc@example.com',
    dob: '12/11/1991',
    events: 9,
    rating: 4.1,
    reputation: 80,
    status: 'active'
  },
  {
    id: 7,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    fullName: 'Đặng Thị Hạnh',
    cccd: '001234567896',
    phone: '0956789012',
    email: 'dangthihanh@example.com',
    dob: '09/02/1994',
    events: 6,
    rating: 4.3,
    reputation: 82,
    status: 'active'
  },
  {
    id: 8,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    fullName: 'Bùi Quốc Huy',
    cccd: '001234567897',
    phone: '0967890123',
    email: 'buiquochuy@example.com',
    dob: '22/09/1989',
    events: 4,
    rating: 3.9,
    reputation: 70,
    status: 'inactive'
  },
  {
    id: 9,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
    fullName: 'Phan Thị Lan',
    cccd: '001234567898',
    phone: '0978901234',
    email: 'phanthilan@example.com',
    dob: '18/01/1996',
    events: 11,
    rating: 4.6,
    reputation: 88,
    status: 'active'
  },
  {
    id: 10,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
    fullName: 'Đỗ Đức Long',
    cccd: '001234567899',
    phone: '0989012345',
    email: 'doducbllong@example.com',
    dob: '03/06/1990',
    events: 7,
    rating: 4.0,
    reputation: 76,
    status: 'active'
  },
  {
    id: 11,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
    fullName: 'Lý Thị Mai',
    cccd: '001234567900',
    phone: '0911122233',
    email: 'lythimai@example.com',
    dob: '30/10/1997',
    events: 2,
    rating: 3.7,
    reputation: 60,
    status: 'inactive'
  },
  {
    id: 12,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
    fullName: 'Ngô Quang Nam',
    cccd: '001234567901',
    phone: '0922233344',
    email: 'ngoquangnam@example.com',
    dob: '14/04/1987',
    events: 14,
    rating: 4.7,
    reputation: 93,
    status: 'active'
  },
  {
    id: 13,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13',
    fullName: 'Tạ Thị Quyên',
    cccd: '001234567902',
    phone: '0933344455',
    email: 'tathiquyen@example.com',
    dob: '27/08/1993',
    events: 10,
    rating: 4.4,
    reputation: 86,
    status: 'active'
  },
  {
    id: 14,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14',
    fullName: 'Trương Minh Khoa',
    cccd: '001234567903',
    phone: '0944455566',
    email: 'truongminhkhoa@example.com',
    dob: '16/12/1992',
    events: 1,
    rating: 3.6,
    reputation: 58,
    status: 'locked'
  },
  {
    id: 15,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15',
    fullName: 'Nguyễn Thị Oanh',
    cccd: '001234567904',
    phone: '0955566677',
    email: 'nguyenthioanh@example.com',
    dob: '08/03/1998',
    events: 13,
    rating: 4.9,
    reputation: 97,
    status: 'active'
  }
];

type VolunteerActivityStatus = 'completed' | 'ongoing' | 'cancelled';

type VolunteerActivity = {
  id: string;
  eventName: string;
  date: string;
  location: string;
  role: string;
  rating: number;
  reputationGain: number;
  status: VolunteerActivityStatus;
};

const mockVolunteerActivitiesByUserId: Record<number, VolunteerActivity[]> = {
  1: [
    {
      id: 'v1-1',
      eventName: 'Chuong trinh Mua he xanh 2025',
      date: '15/06/2025',
      location: 'Huyen Binh Chanh, TP.HCM',
      role: 'Tinh nguyen vien',
      rating: 4.5,
      reputationGain: 4,
      status: 'completed'
    },
    {
      id: 'v1-2',
      eventName: 'Hien mau nhan dao',
      date: '20/08/2025',
      location: 'Benh vien Cho Ray',
      role: 'Tinh nguyen vien',
      rating: 4.8,
      reputationGain: 3,
      status: 'completed'
    },
    {
      id: 'v1-3',
      eventName: 'Trong cay xanh tai khu vuc noi thanh',
      date: '10/01/2026',
      location: 'Cong vien Tao Dan, Quan 1',
      role: 'Truong nhom',
      rating: 4.8,
      reputationGain: 5,
      status: 'completed'
    }
  ]
};

export default function VolunteersList(props: Props) {
  type Volunteer = (typeof mockUsers)[0];
  type SortKey =
    | 'none'
    | 'id'
    | 'fullName'
    | 'cccd'
    | 'phone'
    | 'email'
    | 'dob'
    | 'events'
    | 'rating'
    | 'reputation'
    | 'status';
  type SortOrder = 'asc' | 'desc';
  type SortCriterion = { key: Exclude<SortKey, 'none'>; order: SortOrder };
  type ValueFilterKey = 'fullName' | 'cccd' | 'phone' | 'email' | 'status';

  const [users, setUsers] = useState(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<Volunteer | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedLockUser, setSelectedLockUser] = useState<Volunteer | null>(
    null
  );
  const [openLockModal, setOpenLockModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedEditUser, setSelectedEditUser] = useState<Volunteer | null>(
    null
  );
  const [activityQuery, setActivityQuery] = useState('');
  const [activityStatusFilter, setActivityStatusFilter] = useState<
    'all' | VolunteerActivityStatus
  >('all');
  const [editVolunteer, setEditVolunteer] = useState({
    fullName: '',
    cccd: '',
    phone: '',
    email: '',
    dob: ''
  });
  const [newVolunteer, setNewVolunteer] = useState({
    fullName: '',
    cccd: '',
    phone: '',
    email: '',
    password: '',
    dob: '',
    address: ''
  });
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [dobFrom, setDobFrom] = useState('');
  const [dobTo, setDobTo] = useState('');
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([]);
  const [columnValueFilters, setColumnValueFilters] = useState<
    Partial<Record<ValueFilterKey, string[]>>
  >({});
  const pageSize = 10;

  const setSortForKey = (key: SortKey, order: SortOrder) => {
    if (key === 'none') return;
    setSortCriteria((prev) => {
      const next = prev.filter((c) => c.key !== key);
      next.unshift({ key, order });
      return next;
    });
    setCurrentPage(1);
  };

  const clearSortForKey = (key: SortKey) => {
    if (key === 'none') return;
    setSortCriteria((prev) => prev.filter((c) => c.key !== key));
    setCurrentPage(1);
  };
  const formatDobForInput = (dob: string) => {
    if (!dob) return '';
    if (dob.includes('/')) {
      const [day, month, year] = dob.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dob;
  };

  const formatDobForDisplay = (dob: string) => {
    if (!dob) return '';
    if (dob.includes('-')) {
      const [year, month, day] = dob.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dob;
  };

  const normalizeForFilter = (value: unknown) => String(value ?? '').trim();

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      // remove accents/diacritics
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  const getFilterValueForKey = (user: Volunteer, key: ValueFilterKey) => {
    switch (key) {
      case 'fullName':
        return normalizeForFilter(user.fullName);
      case 'cccd':
        return normalizeForFilter(user.cccd);
      case 'phone':
        return normalizeForFilter(user.phone);
      case 'email':
        return normalizeForFilter(user.email).toLowerCase();
      case 'status':
        return normalizeForFilter(user.status);
      default:
        return '';
    }
  };

  const getUniqueValuesForKey = (key: ValueFilterKey) => {
    const values = users
      .map((u) => getFilterValueForKey(u, key))
      .filter(Boolean);
    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  };

  const ValueFilterDropdown = (props: {
    columnKey: ValueFilterKey;
    label: string;
  }) => {
    const { columnKey, label } = props;
    const values = useMemo(
      () => getUniqueValuesForKey(columnKey),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [users]
    );
    const applied = columnValueFilters[columnKey] ?? [];
    const hasActiveFilter = applied.length > 0;
    const isSearchFilteringThisColumn =
      Boolean(searchQuery.trim()) &&
      ((searchField === 'name' && columnKey === 'fullName') ||
        (searchField === 'cccd' && columnKey === 'cccd') ||
        (searchField === 'phone' && columnKey === 'phone') ||
        (searchField === 'email' && columnKey === 'email'));
    const isSortActive = sortCriteria.some((c) => c.key === columnKey);
    const isActive =
      hasActiveFilter || isSearchFilteringThisColumn || isSortActive;

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [localSelected, setLocalSelected] = useState<string[]>(applied);

    const filteredValues = useMemo(() => {
      const q = normalizeText(search);
      if (!q) return values;
      const tokens = q.split(' ').filter(Boolean);
      return values.filter((v) => {
        const nv = normalizeText(v);
        return tokens.every((t) => nv.includes(t));
      });
    }, [values, search]);

    const setApplied = (next: string[]) => {
      setColumnValueFilters((prev) => ({
        ...prev,
        [columnKey]: next
      }));
      setCurrentPage(1);
    };

    return (
      <DropdownMenu
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setSearch('');
            setLocalSelected(applied);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 p-0 ${
              isActive ? 'text-primary' : 'text-zinc-500'
            }`}
            aria-label={`Bộ lọc cột ${label}`}
          >
            {isActive ? (
              <Funnel className="h-4 w-4" />
            ) : (
              <ListFilter className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[320px] p-2 bg-white text-zinc-900 border border-zinc-200 shadow-lg"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey(columnKey, 'asc');
            }}
            className="gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Sắp xếp A đến Z
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey(columnKey, 'desc');
            }}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            Sắp xếp Z đến A
          </DropdownMenuItem>

          {isSortActive ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  clearSortForKey(columnKey);
                }}
                className="gap-2 text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900"
              >
                <X className="h-4 w-4" />
                Xóa sắp xếp
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <DropdownMenuSeparator />
          )}

          <div className="px-1 pb-2">
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                onClick={() => setLocalSelected(values)}
              >
                Chọn tất cả {values.length ? values.length : ''}
              </Button>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm text-destructive"
                onClick={() => setLocalSelected([])}
              >
                Xóa
              </Button>
            </div>

            <div className="mt-2 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 py-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm"
                className="h-8 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="mt-2 max-h-56 overflow-auto rounded-md border border-zinc-200 bg-white">
              {filteredValues.length === 0 ? (
                <div className="p-3 text-sm text-zinc-500">
                  Không có kết quả
                </div>
              ) : (
                filteredValues.map((v) => {
                  const checked = localSelected.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-zinc-50"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setLocalSelected((prev) =>
                          prev.includes(v)
                            ? prev.filter((x) => x !== v)
                            : [...prev, v]
                        );
                      }}
                    >
                      <span
                        className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                          checked
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-white border-zinc-300'
                        }`}
                      >
                        {checked ? '✓' : ''}
                      </span>
                      <span className="truncate">{v}</span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-50"
                onClick={() => {
                  setOpen(false);
                  setLocalSelected(applied);
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                className="h-9"
                onClick={() => {
                  setApplied(localSelected);
                  setOpen(false);
                }}
              >
                OK
              </Button>
            </div>

            {hasActiveFilter && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-full justify-start gap-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  onClick={() => {
                    setApplied([]);
                    setOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc cột
                </Button>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const DobFilterDropdown = () => {
    const [open, setOpen] = useState(false);
    const [localFrom, setLocalFrom] = useState(dobFrom);
    const [localTo, setLocalTo] = useState(dobTo);
    const hasActive = Boolean(dobFrom || dobTo);
    const isSortActive = sortCriteria.some((c) => c.key === 'dob');
    const isActive = hasActive || isSortActive;

    return (
      <DropdownMenu
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen) {
            setLocalFrom(dobFrom);
            setLocalTo(dobTo);
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 p-0 ${isActive ? 'text-primary' : 'text-zinc-500'}`}
            aria-label="Bộ lọc cột Ngày sinh"
          >
            {isActive ? (
              <Funnel className="h-4 w-4" />
            ) : (
              <ListFilter className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[320px] p-2 bg-white text-zinc-900 border border-zinc-200 shadow-lg"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey('dob', 'asc');
            }}
            className="gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Sắp xếp tăng dần
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey('dob', 'desc');
            }}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            Sắp xếp giảm dần
          </DropdownMenuItem>

          {isSortActive ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  clearSortForKey('dob');
                }}
                className="gap-2 text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900"
              >
                <X className="h-4 w-4" />
                Xóa sắp xếp
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          ) : (
            <DropdownMenuSeparator />
          )}

          <div className="px-1 pb-2">
            <p className="text-sm font-medium text-zinc-900">
              Lọc theo khoảng ngày
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={localFrom}
                onChange={(e) => setLocalFrom(e.target.value)}
                className="bg-white border-zinc-200 text-zinc-900 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Input
                type="date"
                value={localTo}
                onChange={(e) => setLocalTo(e.target.value)}
                className="bg-white border-zinc-200 text-zinc-900 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-50"
                onClick={() => {
                  setOpen(false);
                  setLocalFrom(dobFrom);
                  setLocalTo(dobTo);
                }}
              >
                Hủy
              </Button>
              <Button
                type="button"
                className="h-9"
                onClick={() => {
                  setDobFrom(localFrom);
                  setDobTo(localTo);
                  setCurrentPage(1);
                  setOpen(false);
                }}
              >
                OK
              </Button>
            </div>

            {hasActive && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-full justify-start gap-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  onClick={() => {
                    setDobFrom('');
                    setDobTo('');
                    setCurrentPage(1);
                    setOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc cột
                </Button>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const SortOnlyDropdown = (props: { sortKey: SortKey; label: string }) => {
    const { sortKey, label } = props;
    const isActive =
      sortKey !== 'none' && sortCriteria.some((c) => c.key === sortKey);
    const isSearchFilteringThisColumn =
      Boolean(searchQuery.trim()) && sortKey === 'id' && searchField === 'id';
    const isApplied = isActive || isSearchFilteringThisColumn;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 p-0 ${
              isApplied ? 'text-primary' : 'text-zinc-500'
            }`}
            aria-label={`Sắp xếp cột ${label}`}
          >
            {isApplied ? (
              <Funnel className="h-4 w-4" />
            ) : (
              <ListFilter className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[220px] p-1 bg-white text-zinc-900 border border-zinc-200 shadow-lg"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey(sortKey, 'asc');
            }}
            className="gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Sắp xếp tăng dần
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSortForKey(sortKey, 'desc');
            }}
            className="gap-2"
          >
            <ArrowDown className="h-4 w-4" />
            Sắp xếp giảm dần
          </DropdownMenuItem>
          {isActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  clearSortForKey(sortKey);
                }}
                className="gap-2 text-zinc-600 data-[highlighted]:bg-zinc-50 data-[highlighted]:text-zinc-900"
              >
                <X className="h-4 w-4" />
                Xóa sắp xếp
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const filteredUsers = useMemo(() => {
    const parseDob = (dob: string) => {
      const [day, month, year] = dob.split('/').map(Number);
      return new Date(year, month - 1, day);
    };

    const parseYmdStartOfDay = (ymd: string) => {
      const [year, month, day] = ymd.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    };

    const parseYmdEndOfDay = (ymd: string) => {
      const [year, month, day] = ymd.split('-').map(Number);
      return new Date(year, month - 1, day, 23, 59, 59, 999);
    };

    const fromDate = dobFrom ? parseYmdStartOfDay(dobFrom) : null;
    const toDate = dobTo ? parseYmdEndOfDay(dobTo) : null;

    let result = users.filter((user) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      switch (searchField) {
        case 'id':
          return String(user.id).includes(query);
        case 'name':
          return user.fullName.toLowerCase().includes(query);
        case 'cccd':
          return user.cccd.includes(query);
        case 'phone':
          return user.phone.includes(query);
        case 'email':
          return user.email.toLowerCase().includes(query);
        default:
          return true;
      }
    });

    (Object.keys(columnValueFilters) as ValueFilterKey[]).forEach((key) => {
      const selected = columnValueFilters[key] ?? [];
      if (selected.length === 0) return;
      result = result.filter((u) => {
        const v = getFilterValueForKey(u, key);
        return selected.includes(v);
      });
    });

    if (fromDate || toDate) {
      result = result.filter((user) => {
        const userDate = parseDob(user.dob);
        if (fromDate && userDate < fromDate) return false;
        if (toDate && userDate > toDate) return false;
        return true;
      });
    }

    if (sortCriteria.length > 0) {
      result = [...result].sort((a, b) => {
        for (const criterion of sortCriteria) {
          const order = criterion.order === 'asc' ? 1 : -1;
          const key = criterion.key;

          if (key === 'id') {
            const diff = a.id - b.id;
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'events') {
            const diff = a.events - b.events;
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'rating') {
            const diff = a.rating - b.rating;
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'reputation') {
            const diff = a.reputation - b.reputation;
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'dob') {
            const diff = parseDob(a.dob).getTime() - parseDob(b.dob).getTime();
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'fullName') {
            const diff = a.fullName.localeCompare(b.fullName);
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'email') {
            const diff = a.email.localeCompare(b.email);
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'phone') {
            const diff = a.phone.localeCompare(b.phone);
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'cccd') {
            const diff = a.cccd.localeCompare(b.cccd);
            if (diff !== 0) return diff * order;
            continue;
          }
          if (key === 'status') {
            const diff = a.status.localeCompare(b.status);
            if (diff !== 0) return diff * order;
            continue;
          }
        }
        return 0;
      });
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    users,
    searchField,
    searchQuery,
    dobFrom,
    dobTo,
    sortCriteria,
    columnValueFilters
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const volunteerActivities = useMemo(() => {
    if (!selectedUser) return [];
    return mockVolunteerActivitiesByUserId[selectedUser.id] ?? [];
  }, [selectedUser]);

  const filteredVolunteerActivities = useMemo(() => {
    const query = activityQuery.trim().toLowerCase();

    return volunteerActivities.filter((activity) => {
      const matchesQuery =
        !query ||
        activity.eventName.toLowerCase().includes(query) ||
        activity.location.toLowerCase().includes(query);
      const matchesStatus =
        activityStatusFilter === 'all' ||
        activity.status === activityStatusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [activityQuery, activityStatusFilter, volunteerActivities]);

  const handleView = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setActivityQuery('');
      setActivityStatusFilter('all');
      setOpenDetailModal(true);
    }
  };

  const handleLock = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedLockUser(user);
      setOpenLockModal(true);
    }
  };

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setSelectedEditUser(user);
    setEditVolunteer({
      fullName: user.fullName,
      cccd: user.cccd,
      phone: user.phone,
      email: user.email,
      dob: formatDobForInput(user.dob)
    });
    setOpenEditModal(true);
  };

  const handleConfirmLock = () => {
    if (!selectedLockUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedLockUser.id
          ? {
              ...user,
              status: user.status === 'locked' ? 'active' : 'locked'
            }
          : user
      )
    );
    setOpenLockModal(false);
  };

  const handleConfirmEdit = () => {
    if (!selectedEditUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedEditUser.id
          ? {
              ...user,
              fullName: editVolunteer.fullName,
              cccd: editVolunteer.cccd,
              phone: editVolunteer.phone,
              email: editVolunteer.email,
              dob: formatDobForDisplay(editVolunteer.dob)
            }
          : user
      )
    );
    setOpenEditModal(false);
  };

  const handleAddVolunteer = () => {
    if (
      !newVolunteer.fullName ||
      !newVolunteer.cccd ||
      !newVolunteer.phone ||
      !newVolunteer.email ||
      !newVolunteer.password
    ) {
      return;
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      fullName: newVolunteer.fullName,
      cccd: newVolunteer.cccd,
      phone: newVolunteer.phone,
      email: newVolunteer.email,
      dob: newVolunteer.dob || '01/01/2000',
      events: 0,
      rating: 0,
      reputation: 0,
      status: 'active' as const
    };

    setUsers((prev) => [...prev, newUser]);
    setNewVolunteer({
      fullName: '',
      cccd: '',
      phone: '',
      email: '',
      password: '',
      dob: '',
      address: ''
    });
    setOpenAddModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">active</Badge>
        );
      case 'inactive':
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">inactive</Badge>
        );
      case 'locked':
        return <Badge className="bg-red-500 hover:bg-red-600">locked</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Quản Lý Tình Nguyện Viên"
      description="Quản lý danh sách tình nguyện viê4n"
    >
      <div className="w-full">
        <div className="sticky top-0 z-30 -mx-1 mb-4 px-1 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:flex-1 md:items-center">
              <Select
                value={searchField}
                onValueChange={(value) => {
                  setSearchField(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[200px] !bg-white !border-zinc-200 !text-zinc-900">
                  <SelectValue placeholder="Chọn tiêu chí" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="name">Tên</SelectItem>
                  <SelectItem value="cccd">CCCD</SelectItem>
                  <SelectItem value="phone">Số điện thoại</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Nhập từ khóa tìm kiếm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400"
              />
            </div>
            <Button
              onClick={() => setOpenAddModal(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[1200px] bg-white">
              <TableHeader className="bg-white">
                <TableRow className="bg-white">
                  <TableHead className="w-[60px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>ID</span>
                      <SortOnlyDropdown sortKey="id" label="ID" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Avatar</span>
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Họ và tên</span>
                      <ValueFilterDropdown
                        columnKey="fullName"
                        label="Họ và tên"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[130px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>CCCD</span>
                      <ValueFilterDropdown columnKey="cccd" label="CCCD" />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Số điện thoại</span>
                      <ValueFilterDropdown
                        columnKey="phone"
                        label="Số điện thoại"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Email</span>
                      <ValueFilterDropdown columnKey="email" label="Email" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Ngày sinh</span>
                      <DobFilterDropdown />
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px] text-center whitespace-nowrap">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-full text-center">Số sự kiện</span>
                      <SortOnlyDropdown sortKey="events" label="Số sự kiện" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-full text-center">Rating TB</span>
                      <SortOnlyDropdown sortKey="rating" label="Rating TB" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[110px] text-center">
                    <div className="flex items-center justify-between gap-2">
                      <span className="w-full text-center">Điểm uy tín</span>
                      <SortOnlyDropdown
                        sortKey="reputation"
                        label="Điểm uy tín"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px]">
                    <div className="flex items-center justify-between gap-2">
                      <span>Trạng thái</span>
                      <ValueFilterDropdown
                        columnKey="status"
                        label="Trạng thái"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px] text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-zinc-50">
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.cccd}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.dob}</TableCell>
                    <TableCell className="text-center">{user.events}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-semibold">{user.rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold">{user.reputation}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(user.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(user.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleLock(user.id)}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Trang {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Sau
            </Button>
          </div>
        </div>

        {/* Detail Modal */}
        <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
          <DialogContent className="max-w-6xl overflow-hidden border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50 p-0 shadow-2xl shadow-blue-100/50">
            <DialogHeader>
              <div className="border-b border-blue-100/80 bg-white/70 px-6 pt-6 pb-4 backdrop-blur-sm">
                <DialogTitle className="text-xl font-semibold text-slate-900">
                  Chi tiết thông tin tình nguyện viên
                </DialogTitle>
                <DialogDescription className="mt-1 text-slate-500">
                  Thông tin chi tiết về tình nguyện viên được chọn
                </DialogDescription>
              </div>
            </DialogHeader>

            {selectedUser && (
              <div className="grid gap-5 px-6 pb-6 pt-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-100/35">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border border-white shadow-lg shadow-blue-100/50 ring-4 ring-blue-50">
                      <AvatarImage
                        src={selectedUser.avatar}
                        alt={selectedUser.fullName}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 text-2xl font-semibold text-white">
                        {selectedUser.fullName
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      {selectedUser.fullName}
                    </h3>
                    <p className="text-sm text-slate-500">Tình nguyện viên</p>
                    <Badge
                      className={`mt-3 rounded-full px-3 py-1 ${
                        selectedUser.status === 'active'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                          : selectedUser.status === 'locked'
                            ? 'border border-rose-200 bg-rose-50 text-rose-700'
                            : 'border border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {selectedUser.status === 'active'
                        ? 'Hoạt động'
                        : selectedUser.status === 'locked'
                          ? 'Bị khóa'
                          : 'Không hoạt động'}
                    </Badge>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-zinc-200 pt-4 text-sm">
                    <p className="text-zinc-700">
                      <span className="font-semibold text-zinc-500">CCCD:</span>{' '}
                      {selectedUser.cccd}
                    </p>
                    <p className="text-zinc-700">
                      <span className="font-semibold text-zinc-500">
                        Số điện thoại:
                      </span>{' '}
                      {selectedUser.phone}
                    </p>
                    <p className="text-zinc-700">
                      <span className="font-semibold text-zinc-500">
                        Email:
                      </span>{' '}
                      {selectedUser.email}
                    </p>
                    <p className="text-zinc-700">
                      <span className="font-semibold text-zinc-500">
                        Ngày sinh:
                      </span>{' '}
                      {selectedUser.dob}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-100/35">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Lịch sử hoạt động thiện nguyện
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Danh sách các hoạt động đã tham gia (
                    {filteredVolunteerActivities.length} hoạt động)
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        value={activityQuery}
                        onChange={(e) => setActivityQuery(e.target.value)}
                        placeholder="Tìm kiếm theo tên hoạt động..."
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={activityStatusFilter}
                      onValueChange={(value) =>
                        setActivityStatusFilter(
                          value as 'all' | VolunteerActivityStatus
                        )
                      }
                    >
                      <SelectTrigger className="bg-white border-zinc-200 text-zinc-900">
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-zinc-900 border border-zinc-200">
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {filteredVolunteerActivities.length === 0 ? (
                      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">
                        Không có hoạt động phù hợp.
                      </div>
                    ) : (
                      filteredVolunteerActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-semibold text-zinc-900">
                              {activity.eventName}
                            </p>
                            <Badge
                              className={`rounded-full px-2.5 py-0.5 text-xs ${
                                activity.status === 'completed'
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : activity.status === 'ongoing'
                                    ? 'border border-blue-200 bg-blue-50 text-blue-700'
                                    : 'border border-rose-200 bg-rose-50 text-rose-700'
                              }`}
                            >
                              {activity.status === 'completed'
                                ? 'Hoàn thành'
                                : activity.status === 'ongoing'
                                  ? 'Đang diễn ra'
                                  : 'Đã hủy'}
                            </Badge>
                          </div>

                          <div className="mt-2 space-y-1 text-sm text-zinc-600">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <p className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4" />
                                {activity.date}
                              </p>
                              <p className="inline-flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {activity.location}
                              </p>
                            </div>
                            <p className="inline-flex items-center gap-1.5">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              Rating: {activity.rating}
                              <ShieldCheck className="h-4 w-4 ml-3 text-blue-500" />
                              +{activity.reputationGain} điểm uy tín
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Volunteer Modal */}
        <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-white">
                Cập nhật thông tin tình nguyện viên
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Chỉnh sửa thông tin cơ bản của tình nguyện viên
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Họ và tên
                </label>
                <Input
                  placeholder="Nhập họ và tên đầy đủ"
                  value={editVolunteer.fullName}
                  onChange={(e) =>
                    setEditVolunteer({
                      ...editVolunteer,
                      fullName: e.target.value
                    })
                  }
                  className="mt-1 text-zinc-900 placeholder:text-zinc-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Số CCCD
                  </label>
                  <Input
                    placeholder="Nhập 12 số CCCD"
                    value={editVolunteer.cccd}
                    onChange={(e) =>
                      setEditVolunteer({
                        ...editVolunteer,
                        cccd: e.target.value
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Số điện thoại
                  </label>
                  <Input
                    placeholder="Nhập số điện thoại"
                    value={editVolunteer.phone}
                    onChange={(e) =>
                      setEditVolunteer({
                        ...editVolunteer,
                        phone: e.target.value
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={editVolunteer.email}
                  onChange={(e) =>
                    setEditVolunteer({
                      ...editVolunteer,
                      email: e.target.value
                    })
                  }
                  className="mt-1 bg-blue-50 border-blue-200 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ngày sinh
                </label>
                <Input
                  type="date"
                  value={editVolunteer.dob}
                  onChange={(e) =>
                    setEditVolunteer({
                      ...editVolunteer,
                      dob: e.target.value
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={() => setOpenEditModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirmEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lock Confirmation Modal */}
        <Dialog open={openLockModal} onOpenChange={setOpenLockModal}>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-zinc-900 dark:text-white">
                Xác nhận thay đổi trạng thái
              </DialogTitle>
              <DialogDescription>
                <span className="text-red-600">
                  {selectedLockUser
                    ? `Bạn có chắc muốn ${
                        selectedLockUser.status === 'locked'
                          ? 'mở khóa'
                          : 'khóa'
                      } tài khoản này không?`
                    : 'Bạn có chắc muốn thay đổi trạng thái tài khoản này không?'}
                </span>
              </DialogDescription>
            </DialogHeader>

            {selectedLockUser && (
              <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                <p className="font-semibold">{selectedLockUser.fullName}</p>
                <p>ID: {selectedLockUser.id}</p>
                <p>Email: {selectedLockUser.email}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setOpenLockModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Hủy
              </Button>
              <Button
                onClick={handleConfirmLock}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Volunteer Modal */}
        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">
                Tạo tài khoản tình nguyện viên mới
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin tình nguyện viên mới
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Basic Information Section */}
              <div>
                <h3 className="font-semibold text-sm text-red-600 dark:text-zinc-300 mb-3">
                  Thông tin bắt buộc
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Nhập họ và tên đầy đủ"
                      value={newVolunteer.fullName}
                      onChange={(e) =>
                        setNewVolunteer({
                          ...newVolunteer,
                          fullName: e.target.value
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Số CCCD <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập 12 số CCCD"
                        value={newVolunteer.cccd}
                        onChange={(e) =>
                          setNewVolunteer({
                            ...newVolunteer,
                            cccd: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={newVolunteer.phone}
                        onChange={(e) =>
                          setNewVolunteer({
                            ...newVolunteer,
                            phone: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="Nhập địa chỉ email"
                      value={newVolunteer.email}
                      onChange={(e) =>
                        setNewVolunteer({
                          ...newVolunteer,
                          email: e.target.value
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                      value={newVolunteer.password}
                      onChange={(e) =>
                        setNewVolunteer({
                          ...newVolunteer,
                          password: e.target.value
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Information Section */}
              <div>
                <h3 className="font-semibold text-sm text-yellow-600 dark:text-zinc-300 mb-3">
                  Thông tin bổ sung
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={newVolunteer.dob}
                      onChange={(e) =>
                        setNewVolunteer({
                          ...newVolunteer,
                          dob: e.target.value
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Địa chỉ
                    </label>
                    <Input
                      placeholder="Nhập địa chỉ đầy đủ"
                      value={newVolunteer.address}
                      onChange={(e) =>
                        setNewVolunteer({
                          ...newVolunteer,
                          address: e.target.value
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  onClick={() => setOpenAddModal(false)}
                  className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleAddVolunteer}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tạo tài khoản
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
