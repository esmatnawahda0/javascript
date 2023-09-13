import type { NavbarRoute } from '../../elements';
import { TickShield, User } from '../../icons';
import { localizationKeys } from '../../localization';

const CLERK_ACCOUNT_ROUTE: NavbarRoute = {
  name: localizationKeys('userProfile.start.headerTitle__account'),
  id: 'account',
  icon: User,
  path: '/',
};

const CLERK_SECURITY_ROUTE: NavbarRoute = {
  name: localizationKeys('userProfile.start.headerTitle__security'),
  id: 'security',
  icon: TickShield,
  path: '',
};

export type UserProfileCustomPage = {
  url: string;
  mount: (el: HTMLDivElement) => void;
  unmount: (el?: HTMLDivElement) => void;
};

type CustomPage = {
  label: string;
  url?: string;
  mount?: (el: HTMLDivElement) => void;
  unmount?: (el?: HTMLDivElement) => void;
};

export const createUserProfileCustomPages = (customPages: CustomPage[], navigate: (to: string) => void) => {
  let clerkDefaultRoutes = [CLERK_ACCOUNT_ROUTE, CLERK_SECURITY_ROUTE];
  const routesWithoutDefaultRoutes: NavbarRoute[] = [];
  const userProfileCustomPages: UserProfileCustomPage[] = [];

  customPages.forEach((customPage, index: number) => {
    const { label, url, mount, unmount } = customPage;
    if (!url && !mount && !unmount && label === 'account') {
      // reordering account
      routesWithoutDefaultRoutes.push(CLERK_ACCOUNT_ROUTE);
      clerkDefaultRoutes = clerkDefaultRoutes.filter(({ id }) => id !== 'account');
    } else if (!url && !mount && !unmount && label === 'security') {
      // reordering security
      routesWithoutDefaultRoutes.push(CLERK_SECURITY_ROUTE);
      clerkDefaultRoutes = clerkDefaultRoutes.filter(({ id }) => id !== 'security');
    } else if (!!url && !!label && !mount && !unmount) {
      // external link
      routesWithoutDefaultRoutes.push({
        name: label,
        id: `custom-page-${index}`,
        icon: User,
        path: '',
        externalNavigate: () => navigate(url),
      });
    } else if (!!url && !!label && !!mount && !!unmount) {
      // custom page
      userProfileCustomPages.push({ url, mount, unmount });
      routesWithoutDefaultRoutes.push({
        name: label,
        id: `custom-page-${index}`,
        icon: User,
        path: url,
      });
    } else {
      console.error('Invalid custom page data: ', customPage);
    }
  });

  const userProfileRoutes = [...clerkDefaultRoutes, ...routesWithoutDefaultRoutes];

  return { userProfileRoutes, userProfileCustomPages };
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
