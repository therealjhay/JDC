'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({ title, backHref, backLabel, actions, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link href={backHref} className="text-gray-300 hover:text-white text-sm focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm">
              {backLabel || '← Back'}
            </Link>
          )}
          <h1 className="text-xl font-bold text-yellow-400">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </nav>
      {children}
    </div>
  );
}
