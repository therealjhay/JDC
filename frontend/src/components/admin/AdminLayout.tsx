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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link to={backHref} className="text-gray-300 hover:text-white text-sm focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900 rounded-sm">
              {backLabel || '← Back'}
            </Link>
          )}
          <h1 className="text-xl font-bold text-navy-300">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </nav>
      {children}
    </div>
  );
}
