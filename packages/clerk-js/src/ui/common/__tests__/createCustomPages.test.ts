import type { CustomPage } from '../createCustomPages';
import { createCustomPages } from '../createCustomPages';

describe('createCustomPages', () => {
  it('should return the default pages if no custom pages are passed', () => {
    const { routes, contents, isAccountFirst } = createCustomPages([]);
    expect(routes.length).toEqual(2);
    expect(routes[0].id).toEqual('account');
    expect(routes[1].id).toEqual('security');
    expect(contents.length).toEqual(0);
    expect(isAccountFirst).toEqual(true);
  });

  it('should return the custom pages after the default pages', () => {
    const customPages: CustomPage[] = [
      {
        label: 'Custom1',
        url: '/custom1',
        mount: () => undefined,
        unmount: () => undefined,
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
      {
        label: 'Custom2',
        url: '/custom2',
        mount: () => undefined,
        unmount: () => undefined,
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
    ];
    const { routes, contents, isAccountFirst } = createCustomPages(customPages);
    expect(routes.length).toEqual(4);
    expect(routes[0].id).toEqual('account');
    expect(routes[1].id).toEqual('security');
    expect(routes[2].name).toEqual('Custom1');
    expect(routes[3].name).toEqual('Custom2');
    expect(contents.length).toEqual(2);
    expect(contents[0].url).toEqual('/custom1');
    expect(contents[1].url).toEqual('/custom2');
    expect(isAccountFirst).toEqual(true);
  });

  it('should reorder the default pages when their label is used to target them', () => {
    const customPages: CustomPage[] = [
      {
        label: 'Custom1',
        url: '/custom1',
        mount: () => undefined,
        unmount: () => undefined,
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
      { label: 'account' },
      { label: 'security' },
      {
        label: 'Custom2',
        url: '/custom2',
        mount: () => undefined,
        unmount: () => undefined,
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
    ];
    const { routes, contents, isAccountFirst } = createCustomPages(customPages);
    expect(routes.length).toEqual(4);
    expect(routes[0].name).toEqual('Custom1');
    expect(routes[1].id).toEqual('account');
    expect(routes[2].id).toEqual('security');
    expect(routes[3].name).toEqual('Custom2');
    expect(contents.length).toEqual(2);
    expect(contents[0].url).toEqual('/custom1');
    expect(contents[1].url).toEqual('/custom2');
    expect(isAccountFirst).toEqual(false);
  });

  it('adds an external link to the navbar routes', () => {
    const customPages: CustomPage[] = [
      {
        label: 'Custom1',
        url: '/custom1',
        mount: () => undefined,
        unmount: () => undefined,
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
      {
        label: 'Link1',
        url: '/link1',
        mountIcon: () => undefined,
        unmountIcon: () => undefined,
      },
    ];
    const { routes, contents, isAccountFirst } = createCustomPages(customPages);
    expect(routes.length).toEqual(4);
    expect(routes[0].id).toEqual('account');
    expect(routes[1].id).toEqual('security');
    expect(routes[2].name).toEqual('Custom1');
    expect(routes[3].name).toEqual('Link1');
    expect(contents.length).toEqual(1);
    expect(contents[0].url).toEqual('/custom1');
    expect(isAccountFirst).toEqual(true);
  });
});
