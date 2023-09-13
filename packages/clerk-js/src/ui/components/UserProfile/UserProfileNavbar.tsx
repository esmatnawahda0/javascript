import React from 'react';

import type { NavbarRoute } from '../../elements';
import { Breadcrumbs, NavBar, NavbarContextProvider } from '../../elements';
import type { PropsOfComponent } from '../../styledSystem';
import { pageToRootNavbarRouteMap } from './createUserProfileCustomPages';

export const UserProfileNavbar = (
  props: React.PropsWithChildren<Pick<PropsOfComponent<typeof NavBar>, 'contentRef'>> & {
    userProfileRoutes: NavbarRoute[];
  },
) => {
  return (
    <NavbarContextProvider>
      <NavBar
        routes={props.userProfileRoutes}
        contentRef={props.contentRef}
      />
      {props.children}
    </NavbarContextProvider>
  );
};

export const UserProfileBreadcrumbs = (props: Pick<PropsOfComponent<typeof Breadcrumbs>, 'title'>) => {
  return (
    <Breadcrumbs
      {...props}
      pageToRootNavbarRoute={pageToRootNavbarRouteMap}
    />
  );
};
