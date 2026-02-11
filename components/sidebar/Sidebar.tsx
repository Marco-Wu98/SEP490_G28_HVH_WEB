'use client';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  renderThumb,
  renderTrack,
  renderView
} from '@/components/scrollbar/Scrollbar';
import Links from '@/components/sidebar/components/Links';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { IRoute } from '@/types/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { PropsWithChildren, useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { HiX } from 'react-icons/hi';
import { HiBolt } from 'react-icons/hi2';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { UserContext, UserDetailsContext } from '@/contexts/layout';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const { routes } = props;

  const user = useContext(UserContext);
  const userDetails = useContext(UserDetailsContext);
  const handleSignOut = async (e) => {
    e.preventDefault();
    supabase.auth.signOut();
    router.push('/dashboard/signin');
  };
  // SIDEBAR
  return (
    <div
      className={`lg:!z-99 fixed !z-[99] min-h-full w-[300px] transition-all md:!z-[99] xl:!z-0 ${
        props.variant === 'auth' ? 'xl:hidden' : 'xl:block'
      } ${props.open ? '' : '-translate-x-[120%] xl:translate-x-[unset]'}`}
    >
      <Card
        className={`m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-zinc-200 pe-4 dark:border-zinc-800 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]`}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
          universal={true}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <span
                className="absolute top-4 block cursor-pointer text-zinc-200 dark:text-white/40 xl:hidden"
                onClick={() => props.setOpen(false)}
              >
                <HiX />
              </span>
              <div className={`mt-8 flex items-center justify-center`}>
                <Image
                  src="/img/logo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-sm mr-5"
                />
                <h5 className="me-2 text-2xl font-bold leading-5 text-zinc-950 dark:text-white">
                  <span className="block">Hà Nội</span>
                  <span className="mt-2   block">Thiện Nguyện</span>
                </h5>
              </div>
              <div className="mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10" />
              {/* Nav item */}
              <ul>
                <Links routes={routes} />
              </ul>
            </div>
          </div>
        </Scrollbars>
      </Card>
    </div>
  );
}

// PROPS

export default Sidebar;
