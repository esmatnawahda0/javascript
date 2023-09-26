import { isValidUrl } from '../../utils';
import type { NavbarRoute } from '../elements';
import { TickShield, User } from '../icons';
import { localizationKeys } from '../localization';
import { ExternalElementMounter } from './index';

const CLERK_ACCOUNT_ROUTE: NavbarRoute = {
  name: localizationKeys('userProfile.start.headerTitle__account'),
  id: 'account',
  icon: User,
  path: 'account',
};

const CLERK_SECURITY_ROUTE: NavbarRoute = {
  name: localizationKeys('userProfile.start.headerTitle__security'),
  id: 'security',
  icon: TickShield,
  path: 'account',
};

export type CustomPageContent = {
  url: string;
  mount: (el: HTMLDivElement) => void;
  unmount: (el?: HTMLDivElement) => void;
};

export type CustomPage = {
  label: string;
  url?: string;
  mountIcon?: (el: HTMLDivElement) => void;
  unmountIcon?: (el?: HTMLDivElement) => void;
  mount?: (el: HTMLDivElement) => void;
  unmount?: (el?: HTMLDivElement) => void;
};

const sanitizeCustomPageURL = (url: string): string => {
  if (!url) {
    throw new Error('URL is required for custom pages');
  }
  if (isValidUrl(url)) {
    throw new Error('Absolute URLs are not supported for custom pages');
  }
  return (url as string).charAt(0) === '/' && (url as string).length > 1 ? (url as string).substring(1) : url;
};

const sanitizeCustomLinkURL = (url: string): string => {
  if (!url) {
    throw new Error('URL is required for custom links');
  }
  if (isValidUrl(url)) {
    return url;
  }
  return (url as string).charAt(0) === '/' ? url : `/${url}`;
};

export const createCustomPages = (customPages: CustomPage[]) => {
  let clerkDefaultRoutes = [{ ...CLERK_ACCOUNT_ROUTE }, { ...CLERK_SECURITY_ROUTE }];
  const routesWithoutDefaults: NavbarRoute[] = [];
  const contents: CustomPageContent[] = [];

  customPages.forEach((customPage, index: number) => {
    const { label, url, mount, unmount, mountIcon, unmountIcon } = customPage;
    if (!url && !mount && !unmount && !mountIcon && !unmountIcon && label === 'account') {
      // reordering account
      routesWithoutDefaults.push({ ...CLERK_ACCOUNT_ROUTE });
      clerkDefaultRoutes = clerkDefaultRoutes.filter(({ id }) => id !== 'account');
    } else if (!url && !mount && !unmount && !mountIcon && !unmountIcon && label === 'security') {
      // reordering security
      routesWithoutDefaults.push({ ...CLERK_SECURITY_ROUTE });
      clerkDefaultRoutes = clerkDefaultRoutes.filter(({ id }) => id !== 'security');
    } else if (!!url && !!label && !mount && !unmount && !!mountIcon && !!unmountIcon) {
      // external link
      routesWithoutDefaults.push({
        name: label,
        id: `custom-page-${index}`,
        icon: () => (
          <ExternalElementMounter
            mount={mountIcon}
            unmount={unmountIcon}
          />
        ),
        path: sanitizeCustomLinkURL(url),
        external: true,
      });
    } else if (!!url && !!label && !!mount && !!unmount && !!mountIcon && !!unmountIcon) {
      // custom page
      const pageURL = sanitizeCustomPageURL(url);
      contents.push({ url: pageURL, mount, unmount });
      routesWithoutDefaults.push({
        name: label,
        id: `custom-page-${index}`,
        icon: () => (
          <ExternalElementMounter
            mount={mountIcon}
            unmount={unmountIcon}
          />
        ),
        path: pageURL,
      });
    } else {
      console.error('Invalid custom page data: ', customPage);
    }
  });

  // Set the path of the first route to '/' or if the first route is account or security, set the path of both account and security to '/'
  let routes = [...clerkDefaultRoutes, ...routesWithoutDefaults];
  if (routes[0].external) {
    throw new Error('The first route cannot be a <UserProfile.Link /> component');
  }
  if (routes[0].id === 'account' || routes[0].id === 'security') {
    routes = routes.map(r => {
      if (r.id === 'account' || r.id === 'security') {
        return { ...r, path: '/' };
      }
      return r;
    });
  } else {
    routes[0].path = '/';
  }

  return { routes, contents, isAccountFirst: routes[0].id === 'account' || routes[0].id === 'security' };
};

export const pageToRootNavbarRouteMap = {
  profile: CLERK_ACCOUNT_ROUTE,
  'email-address': CLERK_ACCOUNT_ROUTE,
  'phone-number': CLERK_ACCOUNT_ROUTE,
  'connected-account': CLERK_ACCOUNT_ROUTE,
  'web3-wallet': CLERK_ACCOUNT_ROUTE,
  username: CLERK_ACCOUNT_ROUTE,
  'multi-factor': CLERK_SECURITY_ROUTE,
  password: CLERK_SECURITY_ROUTE,
};
