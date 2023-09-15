import type {
  CreateOrganizationProps,
  OrganizationListProps,
  OrganizationProfileProps,
  OrganizationSwitcherProps,
  SignInProps,
  SignUpProps,
  UserButtonProps,
  UserProfileProps,
} from '@clerk/types';
import type { PropsWithChildren } from 'react';
import React, { createElement } from 'react';

import type { MountProps, UserProfileCustomLinkProps, UserProfileCustomPageProps, WithClerkProp } from '../types';
import { useCustomPages } from '../utils/useCustomPages';
import { withClerk } from './withClerk';

// README: <Portal/> should be a class pure component in order for mount and unmount
// lifecycle props to be invoked correctly. Replacing the class component with a
// functional component wrapped with a React.memo is not identical to the original
// class implementation due to React intricacies such as the useEffect’s cleanup
// seems to run AFTER unmount, while componentWillUnmount runs BEFORE.

// More information can be found at https://clerkinc.slack.com/archives/C015S0BGH8R/p1624891993016300

// The function Portal implementation is commented out for future reference.

// const Portal = React.memo(({ props, mount, unmount }: MountProps) => {
//   const portalRef = React.createRef<HTMLDivElement>();

//   useEffect(() => {
//     if (portalRef.current) {
//       mount(portalRef.current, props);
//     }
//     return () => {
//       if (portalRef.current) {
//         unmount(portalRef.current);
//       }
//     };
//   }, []);

//   return <div ref={portalRef} />;
// });

// Portal.displayName = 'ClerkPortal';
class Portal extends React.PureComponent<MountProps, {}> {
  private portalRef = React.createRef<HTMLDivElement>();

  componentDidUpdate(prevProps: Readonly<MountProps>) {
    if (prevProps.props.appearance !== this.props.props.appearance) {
      this.props.updateProps({ node: this.portalRef.current, props: this.props.props });
    }
  }

  componentDidMount() {
    if (this.portalRef.current) {
      this.props.mount(this.portalRef.current, this.props.props);
    }
  }

  componentWillUnmount() {
    if (this.portalRef.current) {
      this.props.unmount(this.portalRef.current);
    }
  }

  render() {
    return (
      <>
        <div ref={this.portalRef} />
        {this.props?.customPagesPortals?.map((portal, index) => createElement(portal, { key: index }))}
      </>
    );
  }
}

export const SignIn = withClerk(({ clerk, ...props }: WithClerkProp<SignInProps>) => {
  return (
    <Portal
      mount={clerk.mountSignIn}
      unmount={clerk.unmountSignIn}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'SignIn');

export const SignUp = withClerk(({ clerk, ...props }: WithClerkProp<SignUpProps>) => {
  return (
    <Portal
      mount={clerk.mountSignUp}
      unmount={clerk.unmountSignUp}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'SignUp');

function UserProfilePage({ children }: PropsWithChildren<UserProfileCustomPageProps>) {
  console.error('text for misuse of UserProfile.Page');
  return <div>{children}</div>;
}
UserProfilePage.displayName = 'UserProfilePage';

function UserProfileLink({ children }: PropsWithChildren<UserProfileCustomLinkProps>) {
  console.error('text for misuse of UserProfile.Link');
  return <div>{children}</div>;
}
UserProfileLink.displayName = 'UserProfileLink';

export { UserProfileLink, UserProfilePage };

export const UserProfile = withClerk(({ clerk, ...props }: WithClerkProp<PropsWithChildren<UserProfileProps>>) => {
  const { customPages, customPagesPortals } = useCustomPages(props.children);
  return (
    <Portal
      mount={clerk.mountUserProfile}
      unmount={clerk.unmountUserProfile}
      updateProps={(clerk as any).__unstable__updateProps}
      props={{ ...props, customPages }}
      customPagesPortals={customPagesPortals}
    />
  );
}, 'UserProfile');

// type UserProfileExportType = typeof _UserProfile & {
//   Page: ({ children }: PropsWithChildren<UserProfileCustomPageProps>) => React.JSX.Element;
//   Link: ({ children }: PropsWithChildren<UserProfileCustomLinkProps>) => React.JSX.Element;
// };
// export const UserProfile: UserProfileExportType = Object.assign(_UserProfile, {
//   Page: UserProfilePage,
//   Link: UserProfileLink,
// });

export const UserButton = withClerk(({ clerk, ...props }: WithClerkProp<UserButtonProps>) => {
  // @ts-ignore
  // props.userProfileProps.customPages = props?.userProfileProps?.customPages?.map((customPage, index) => ({
  //   ...customPage,
  //   ...useCustomPageMounter(customPage.component),
  //   id: `custom-${index}`,
  // }));
  return (
    <Portal
      mount={clerk.mountUserButton}
      unmount={clerk.unmountUserButton}
      updateProps={(clerk as any).__unstable__updateProps}
      props={{ ...props }}
      // @ts-ignore
      customPages={props?.userProfileProps?.customPages}
    />
  );
}, 'UserButton');

export const OrganizationProfile = withClerk(({ clerk, ...props }: WithClerkProp<OrganizationProfileProps>) => {
  return (
    <Portal
      mount={clerk.mountOrganizationProfile}
      unmount={clerk.unmountOrganizationProfile}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'OrganizationProfile');

export const CreateOrganization = withClerk(({ clerk, ...props }: WithClerkProp<CreateOrganizationProps>) => {
  return (
    <Portal
      mount={clerk.mountCreateOrganization}
      unmount={clerk.unmountCreateOrganization}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'CreateOrganization');

export const OrganizationSwitcher = withClerk(({ clerk, ...props }: WithClerkProp<OrganizationSwitcherProps>) => {
  return (
    <Portal
      mount={clerk.mountOrganizationSwitcher}
      unmount={clerk.unmountOrganizationSwitcher}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'OrganizationSwitcher');

export const OrganizationList = withClerk(({ clerk, ...props }: WithClerkProp<OrganizationListProps>) => {
  return (
    <Portal
      mount={clerk.mountOrganizationList}
      unmount={clerk.unmountOrganizationList}
      updateProps={(clerk as any).__unstable__updateProps}
      props={props}
    />
  );
}, 'OrganizationList');
