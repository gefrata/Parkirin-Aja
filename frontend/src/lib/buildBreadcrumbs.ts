import { routeMap } from './routeMap';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = pathname;

  while (currentPath) {
    const route = routeMap[currentPath];

    if (!route) break;

    breadcrumbs.unshift({
      label: route.label,
      href: currentPath,
    });

    currentPath = route.parent || '';
  }

  // halaman aktif → tanpa link
  if (breadcrumbs.length > 0) {
    breadcrumbs[breadcrumbs.length - 1].href = undefined;
  }

  return breadcrumbs;
}