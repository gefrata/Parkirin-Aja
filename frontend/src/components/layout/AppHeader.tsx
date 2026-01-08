'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { buildBreadcrumbs } from '@/lib/buildBreadcrumbs';
import { Breadcrumbs } from './Breadcrumbs';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  autoBreadcrumbs?: boolean;
  action?: ReactNode; // ⬅️ PAGE ACTION
}

export function AppHeader({
  title,
  subtitle,
  autoBreadcrumbs = true,
  action,
}: AppHeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = autoBreadcrumbs
    ? buildBreadcrumbs(pathname)
    : [];

  return (
    <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center px-4">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />

          <div className="hidden md:flex flex-col">
            <h1 className="text-xl font-bold text-gray-900">
              {title}
            </h1>

            {breadcrumbs.length > 0 ? (
              <Breadcrumbs items={breadcrumbs} />
            ) : (
              subtitle && (
                <p className="text-sm text-gray-500">
                  {subtitle}
                </p>
              )
            )}
          </div>
        </div>

        {/* RIGHT */}
        {action && (
          <div className="ml-auto flex items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
