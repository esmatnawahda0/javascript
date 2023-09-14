import type { UserProfileProps } from '@clerk/types';
import React from 'react';

import { withRedirectToHomeUserGuard } from '../../common';
import { ComponentContext, withCoreUserGuard } from '../../contexts';
import { Flow } from '../../customizables';
import { ProfileCard, withCardStateProvider } from '../../elements';
import { Route, Switch, useRouter } from '../../router';
import type { UserProfileCtx } from '../../types';
import { createUserProfileCustomPages } from './createUserProfileCustomPages';
import { UserProfileNavbar } from './UserProfileNavbar';
import { UserProfileRoutes } from './UserProfileRoutes';
import { VerificationSuccessPage } from './VerifyWithLink';

const _UserProfile = (props: UserProfileProps) => {
  const { navigate } = useRouter();
  return (
    <Flow.Root flow='userProfile'>
      <Flow.Part>
        <Switch>
          {/* PublicRoutes */}
          <Route path='verify'>
            <VerificationSuccessPage />
          </Route>
          <Route>
            <AuthenticatedRoutes
              customPages={props.customPages}
              externalNavigate={navigate}
            />
          </Route>
        </Switch>
      </Flow.Part>
    </Flow.Root>
  );
};

const AuthenticatedRoutes = withCoreUserGuard((props: any) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  const customPages = props.customPages || [];
  const { userProfileRoutes, userProfileCustomPages, isAccountFirst } = createUserProfileCustomPages(
    customPages || [],
    props.externalNavigate,
  );

  return (
    <ProfileCard sx={{ height: '100%' }}>
      <UserProfileNavbar
        contentRef={contentRef}
        userProfileRoutes={userProfileRoutes}
      >
        <UserProfileRoutes
          contentRef={contentRef}
          userProfileCustomPages={userProfileCustomPages}
          isAccountFirst={isAccountFirst}
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
