import { UserProfile, useUser } from '@clerk/nextjs';
import type { GetServerSideProps, NextPage } from 'next';
import React, { createContext } from 'react';
import { getAuth } from '@clerk/nextjs/server';

type ProfileCustomPage = {
  /*
   * This is the Component that will be rendered when the user navigates to the custom page.
   * It could be anything that can be rendered with React, such as a piece of JSX, a Fragment,
   * a string or a number, or an array of these. A portal will be used to render the component,
   * so the component will have access to its context.
   */
  component: React.ReactElement;
  /*
   * This is the path that will be used to navigate to the custom page. It must be unique.
   */
  path: string;
  /*
   * This is the name that will be displayed in the navigation sidebar for the custom page
   */
  name: string;
  /*
   * This is a unique ID for the custom page. If omitted, an ID will be generated (e.g. `custom-page-1`).
   */
  id?: string;
  /*
   * This is the icon that will be displayed in the navigation sidebar for the custom page.
   * If omitted, no icon will be displayed.
   */
  icon?: React.ReactElement;
};

const ThemeContext = createContext('no-color');

export const getServerSideProps: GetServerSideProps = async context => {
  const auth = getAuth(context.req);
  console.log('getServerSideProps', auth.userId);
  return { props: {} };
};

const UserProfilePage: NextPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/*<UserProfile customPage={<CustomPageComponent />} />*/}
      <ThemeContext.Provider value='black'>
        {/*<ThemePage />*/}
        <UserProfile
          routing={'path'}
          path={'/user'}
          customPages={[
            // { name: 'Custom Page', path: 'custom', component: <CustomPageComponent /> },
            // { name: 'Second Page 22222 as asdasd asd asd ', path: 'second', component: <SecondPage /> },
            // { name: 'Third Page', path: 'third', component: <SecondPage /> },
            { name: 'Theme Page', path: 'theme', component: <ThemePage /> },
          ]}
        />
        {/*<UserButton*/}
        {/*  afterSignOutUrl='/'*/}
        {/*  // userProfileProps={{*/}
        {/*  //   customPages: [{ name: 'Custom Page', path: 'custom', component: <ThemePage /> }],*/}
        {/*  // }}*/}
        {/*  userProfileMode={'navigation'}*/}
        {/*  userProfileUrl={'/user22'}*/}
        {/*/>*/}
      </ThemeContext.Provider>
    </div>
  );
};

const ThemePage = () => {
  const theme = React.useContext(ThemeContext);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Theme is {theme}</p>
    </div>
  );
};

const SecondPage = () => {
  const { user } = useUser();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>This is user {user?.id}!!!</p>
    </div>
  );
};

export default UserProfilePage;
