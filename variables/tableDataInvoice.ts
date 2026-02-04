type RowObj = {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
};

const tableDataInvoice: RowObj[] = [
  {
    item: 'Hỗ trợ cao cấp',
    quantity: 1,
    rate: 9.0,
    amount: 9.0
  },
  {
    item: 'Hà Nội Thiện Nguyện - Gói PRO',
    quantity: 3,
    rate: 99.0,
    amount: 297.0
  },
  {
    item: 'Phụ kiện dịch vụ',
    quantity: 1,
    rate: 89.0,
    amount: 89.0
  }
];

export default tableDataInvoice;
