export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'services',
      displayName: 'menu.services',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'users',
      displayName: 'menu.users',
      meta: {
        icon: 'group',
      },
    },
    {
      name: 'patients',
      displayName: 'menu.patients',
      meta: {
        icon: 'group',
      },
    },

    {
      name: 'appointments',
      displayName: 'menu.appointments',
      meta: {
        icon: 'vuestic-iconset-files',
      },
    },
    {
      name: 'projects',
      displayName: 'menu.projects',
      meta: {
        icon: 'folder_shared',
      },
    },
    {
      name: 'auth',
      displayName: 'menu.auth',
      meta: {
        icon: 'login',
      },
      children: [
        {
          name: 'login',
          displayName: 'menu.login',
        },
        {
          name: 'signup',
          displayName: 'menu.signup',
        },
        {
          name: 'recover-password',
          displayName: 'menu.recover-password',
        },
      ],
    },


    {
      name: 'preferences',
      displayName: 'menu.preferences',
      meta: {
        icon: 'manage_accounts',
      },
    },
    {
      name: 'settings',
      displayName: 'menu.settings',
      meta: {
        icon: 'settings',
      },
    },
  ] as INavigationRoute[],
}
