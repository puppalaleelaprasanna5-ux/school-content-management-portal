import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  /** Description text (alias: description). */
  subtitle?: string;
  description?: string;
  breadcrumbs?: Crumb[];
  /** Custom actions node (takes precedence over primary/secondary). */
  actions?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  primaryAction,
  secondaryAction,
}: PageHeaderProps) {
  const desc = description ?? subtitle;
  const actionContent =
    actions ??
    (primaryAction || secondaryAction ? (
      <>
        {secondaryAction}
        {primaryAction}
      </>
    ) : null);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-400"
          >
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="transition-colors hover:text-slate-600">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-slate-600" : undefined}>{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight size={12} className="text-slate-300" />}
                </span>
              );
            })}
          </nav>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>

        {desc && <p className="mt-1.5 text-sm text-slate-500">{desc}</p>}
      </div>

      {actionContent && (
        <div className="flex shrink-0 items-center gap-2">{actionContent}</div>
      )}
    </header>
  );
}
