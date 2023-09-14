import { ProfileCardContent } from '../../elements';
import { Route, Switch } from '../../router';
import type { PropsOfComponent } from '../../styledSystem';
import { ConnectedAccountsPage } from './ConnectedAccountsPage';
import type { UserProfileCustomPage } from './createUserProfileCustomPages';
import { DeletePage } from './DeletePage';
import { EmailPage } from './EmailPage';
import { ExternalElementMounter } from './ExternalElementMounter';
import { MfaBackupCodeCreatePage } from './MfaBackupCodeCreatePage';
import { MfaPage } from './MfaPage';
import { PasswordPage } from './PasswordPage';
import { PhonePage } from './PhonePage';
import { ProfilePage } from './ProfilePage';
import {
  RemoveConnectedAccountPage,
  RemoveEmailPage,
  RemoveMfaPhoneCodePage,
  RemoveMfaTOTPPage,
  RemovePhonePage,
  RemoveWeb3WalletPage,
} from './RemoveResourcePage';
import { RootPage } from './RootPage';
import { UsernamePage } from './UsernamePage';
import { Web3Page } from './Web3Page';

export const UserProfileRoutes = (
  props: PropsOfComponent<typeof ProfileCardContent> & {
    userProfileCustomPages: UserProfileCustomPage[];
    isAccountFirst: boolean;
  },
) => {
  const accountPathPrefix = props.isAccountFirst ? '' : 'account/';
  return (
    <ProfileCardContent contentRef={props.contentRef}>
      <Switch>
        {/* Custom Pages */}
        {props.userProfileCustomPages?.map((customPage, index) => (
          <Route
            index={!props.isAccountFirst && index === 0}
            path={!props.isAccountFirst && index === 0 ? undefined : customPage.url}
            key={`custom-page-${index}`}
          >
            <ExternalElementMounter
              mount={customPage.mount}
              unmount={customPage.unmount}
            />
          </Route>
        ))}
        <Route path={`${accountPathPrefix}profile`}>
          <ProfilePage />
        </Route>
        <Route path={`${accountPathPrefix}email-address`}>
          <Switch>
            <Route path=':id/remove'>
              <RemoveEmailPage />
            </Route>
            <Route path=':id'>
              <EmailPage />
            </Route>
            <Route index>
              <EmailPage />
            </Route>
          </Switch>
        </Route>
        <Route path={`${accountPathPrefix}phone-number`}>
          <Switch>
            <Route path=':id/remove'>
              <RemovePhonePage />
            </Route>
            <Route path=':id'>
              <PhonePage />
            </Route>
            <Route index>
              <PhonePage />
            </Route>
          </Switch>
        </Route>
        <Route path={`${accountPathPrefix}multi-factor`}>
          <Switch>
            <Route path='totp/remove'>
              <RemoveMfaTOTPPage />
            </Route>
            <Route path='backup_code/add'>
              <MfaBackupCodeCreatePage />
            </Route>
            <Route path=':id/remove'>
              <RemoveMfaPhoneCodePage />
            </Route>
            <Route path=':id'>
              <MfaPage />
            </Route>
            <Route index>
              <MfaPage />
            </Route>
          </Switch>
        </Route>
        <Route path={`${accountPathPrefix}connected-account`}>
          <Switch>
            <Route path=':id/remove'>
              <RemoveConnectedAccountPage />
            </Route>
            <Route index>
              <ConnectedAccountsPage />
            </Route>
          </Switch>
        </Route>
        <Route path={`${accountPathPrefix}web3-wallet`}>
          <Switch>
            <Route path=':id/remove'>
              <RemoveWeb3WalletPage />
            </Route>
            <Route index>
              <Web3Page />
            </Route>
          </Switch>
        </Route>
        <Route path={`${accountPathPrefix}username`}>
          <UsernamePage />
        </Route>
        {/*<Route path='security'>*/}
        <Route path={`${accountPathPrefix}password`}>
          <PasswordPage />
        </Route>
        <Route path={`${accountPathPrefix}delete`}>
          <DeletePage />
        </Route>
        <Route
          path={props.isAccountFirst ? undefined : 'account'}
          index={props.isAccountFirst}
        >
          <RootPage />
        </Route>
      </Switch>
    </ProfileCardContent>
  );
};
