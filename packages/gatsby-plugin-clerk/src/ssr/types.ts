import type { AuthenticateRequestOptions, Organization, Session, User } from '@clerk/backend';
import type { ServerSideAuth } from '@clerk/types';
import type { GetServerDataProps } from 'gatsby';

export type WithServerAuthResult<CallbackReturn> = (props: GetServerDataProps) => Promise<Awaited<CallbackReturn>>;

export type GetServerDataPropsWithAuth<Options extends WithServerAuthOptions = any> = GetServerDataProps & {
  auth: ServerSideAuth;
} & (Options extends { loadSession: true } ? { session: Session | null } : object) &
  (Options extends { loadUser: true } ? { user: User | null } : object) &
  (Options extends { loadOrg: true } ? { organization: Organization | null } : object);

export type WithServerAuthCallback<Return, Options extends WithServerAuthOptions> = (
  props: GetServerDataPropsWithAuth<Options>,
) => Return;

export type WithServerAuthOptions = {
  loadUser?: boolean;
  loadSession?: boolean;
  loadOrg?: boolean;
  jwtKey?: string;
  authorizedParties?: string[];
  audience?: AuthenticateRequestOptions['audience'];
};
