'use client';

import Footer from '@/components/footer/FooterAuthDefault';
import { PropsWithChildren, useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { HiBolt } from 'react-icons/hi2';

interface DefaultAuthLayoutProps extends PropsWithChildren {
  children: JSX.Element;
  viewProp: any;
}

export default function DefaultAuthLayout(props: DefaultAuthLayoutProps) {
  const { children } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div className="relative h-max bg-background text-foreground">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[66%] lg:h-[100vh] lg:max-w-[66%] lg:px-6 xl:pl-0 ">
        <a className="mt-10 w-fit text-zinc-950 dark:text-white" href="/">
          <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
            <FaChevronLeft className="mr-3 h-[13px] w-[8px] text-zinc-950 dark:text-white" />
            <p className="ml-0 text-sm text-zinc-950 dark:text-white">
              Quay lại trang web
            </p>
          </div>
        </a>
        {children}
        <div className="absolute right-0 hidden h-full min-h-[100vh] xl:block xl:w-[50vw] 2xl:w-[44vw]">
          <div className="absolute flex h-full w-full flex-col items-end justify-center bg-primary">
            <div
              className={`mb-[160px] mt-8 flex w-full items-center justify-center `}
            >
              <div className="me-2 flex h-[76px] w-[76px] items-center justify-center rounded-md bg-card text-primary">
                <HiBolt className="h-9 w-9" />
              </div>
              <h5 className="text-4xl font-bold leading-5 text-primary-foreground">
                Hà Nội Thiện Nguyện
              </h5>
            </div>
            <div
              className={`flex w-full flex-col items-center justify-center text-2xl font-semibold text-primary-foreground`}
            >
              <h4 className="mb-5 flex w-[600px] items-center justify-center rounded-md text-center text-2xl font-semibold">
                “Hà Nội Thiện Nguyện giúp bạn tìm thấy những dự án ý nghĩa chỉ
                trong vài lần chạm, biến việc giúp đỡ cộng đồng trở nên hiện đại
                và dễ dàng hơn bao giờ hết.”
              </h4>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
