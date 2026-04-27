import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({ title, backHref, backLabel, actions, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4">
          {backHref && (
            <Link to={backHref} className="text-gray-300 hover:text-white text-sm font-medium transition-colors">
              {backLabel || '← Back'}
            </Link>
          )}
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-white">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2 sm:gap-4">{actions}</div>}
      </nav>
      {children}
    </div>
  );
}
