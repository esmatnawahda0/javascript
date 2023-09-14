import React from 'react';

import { useCustomElementPortal } from './useCustomElementPortal';

type CustomPage = {
  label: string;
  url?: string;
  mountIcon?: (el: HTMLDivElement) => void;
  unmountIcon?: (el?: HTMLDivElement) => void;
  mount?: (el: HTMLDivElement) => void;
  unmount?: (el?: HTMLDivElement) => void;
};

const errorInDevMode = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(message);
  }
};

export const useCustomPages = (userProfileChildren: any) => {
  const customPages: CustomPage[] = [];
  const customPagesPortals: React.ComponentType[] = [];
  React.Children.forEach(userProfileChildren, child => {
    if (child?.type?.displayName !== 'UserProfilePage' && child?.type?.displayName !== 'UserProfileLink') {
      errorInDevMode(
        'text for only allowing UserProfile.Page and UserProfile.Link as children of UserProfile. This component will be ignored.',
      );
      return;
    }

    const { children, label, url, labelIcon } = child.props;

    if (child?.type?.name === 'UserProfilePage') {
      if (isReorderItem(child.props)) {
        // This is a reordering item
        customPages.push({ label });
      } else if (isCustomPage(child.props)) {
        // this is a custom page
        const { CustomElementPortal, mount, unmount } = useCustomElementPortal(children);
        const {
          CustomElementPortal: labelPortal,
          mount: mountIcon,
          unmount: unmountIcon,
        } = useCustomElementPortal(labelIcon);
        customPages.push({
          url,
          label,
          mountIcon,
          unmountIcon,
          mount,
          unmount,
        });
        customPagesPortals.push(CustomElementPortal);
        customPagesPortals.push(labelPortal);
      } else {
        errorInDevMode('text for misuse of UserProfile.Page. Wrong props.');
        return;
      }
    }

    if (child?.type?.name === 'UserProfileLink') {
      if (isExternalLink(child.props)) {
        // This is an external link
        const {
          CustomElementPortal: labelPortal,
          mount: mountIcon,
          unmount: unmountIcon,
        } = useCustomElementPortal(labelIcon);
        customPages.push({ label, url, mountIcon, unmountIcon });
        customPagesPortals.push(labelPortal);
      } else {
        errorInDevMode('text for misuse of UserProfile.Link. Wrong props.');
        return;
      }
    }
  });

  return { customPages, customPagesPortals };
};

const isReorderItem = (childProps: any): boolean => {
  const { children, label, url, labelIcon } = childProps;
  return !children && !url && !labelIcon && (label === 'account' || label === 'security');
};

const isCustomPage = (childProps: any): boolean => {
  const { children, label, url, labelIcon } = childProps;
  return !!children && !!url && !!labelIcon && !!label;
};

const isExternalLink = (childProps: any): boolean => {
  const { children, label, url, labelIcon } = childProps;
  return !children && !!url && !!labelIcon && !!label;
};
