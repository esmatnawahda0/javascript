import type { UserProfileProps } from '@clerk/types';
import React from 'react';

import { withRedirectToHomeUserGuard } from '../../common';
import { ComponentContext, withCoreUserGuard } from '../../contexts';
import { Flow } from '../../customizables';
import { ProfileCard, withCardStateProvider } from '../../elements';
import { User } from '../../icons';
import { Route, Switch } from '../../router';
import type { UserProfileCtx } from '../../types';
import { UserProfileNavbar } from './UserProfileNavbar';
import { UserProfileRoutes } from './UserProfileRoutes';
import { VerificationSuccessPage } from './VerifyWithLink';

const _UserProfile = (props: UserProfileProps) => {
  return (
    <Flow.Root flow='userProfile'>
      <Flow.Part>
        <Switch>
          {/* PublicRoutes */}
          <Route path='verify'>
            <VerificationSuccessPage />
          </Route>
          <Route>
            <AuthenticatedRoutes customPages={props.customPages} />
          </Route>
        </Switch>
      </Flow.Part>
    </Flow.Root>
  );
};

const AuthenticatedRoutes = withCoreUserGuard((props: any) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const customPagesRoutes = props.customPages?.map((customPage: any) => ({
    name: customPage.name,
    id: customPage.id,
    icon: User,
    path: `${customPage.path}`,
  }));
  return (
    <ProfileCard sx={{ height: '100%' }}>
      <UserProfileNavbar
        contentRef={contentRef}
        customPagesRoutes={customPagesRoutes}
      >
        <UserProfileRoutes
          contentRef={contentRef}
          customPages={props.customPages}
        />
      </UserProfileNavbar>
    </ProfileCard>
  );
});

export const UserProfile = withRedirectToHomeUserGuard(withCardStateProvider(_UserProfile));

export const UserProfileModal = (props: UserProfileProps): JSX.Element => {
  const userProfileProps: UserProfileCtx = {
    ...props,
    routing: 'virtual',
    componentName: 'UserProfile',
    mode: 'modal',
  };

  return (
    <Route path='user'>
      <ComponentContext.Provider value={userProfileProps}>
        {/*TODO: Used by InvisibleRootBox, can we simplify? */}
        <div>
          <UserProfile {...userProfileProps} />
        </div>
      </ComponentContext.Provider>
    </Route>
  );
};
