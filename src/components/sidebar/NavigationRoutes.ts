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
      visible: 'dashboard_index',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'fa-solid fa-chart-line',
      },
    },
    {
      name: 'services',
      displayName: 'menu.services',
      visible: 'services_index',
      meta: {
        icon: 'fa-solid fa-list',
      },
    },
    {
      name: 'users',
      visible: 'practitioner_index',
      displayName: 'menu.users',
      meta: {
        icon: 'fa-solid fa-user-group',
      },
    },
    {
      name: 'patients',
      visible: 'patients_index',
      displayName: 'menu.patients',
      meta: {
        icon: 'fa-solid fa-user-plus',
      },
    },

    {
      name: 'appointments',
      visible: 'appointments_index',
      displayName: 'menu.appointments',
      meta: {
        icon: 'fa-regular fa-calendar-check',
      },
    },
    {
      name: 'projects',
      visible: 'dashboard_index',
      displayName: 'menu.projects',
      meta: {
        icon: 'fa-solid fa-user-shield',
      },
    },
    {
      name: 'auth',
      visible: 'dashboard_index',
      displayName: 'menu.auth',
      meta: {
        icon: 'fa-solid fa-arrow-right-to-bracket',
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
      visible: 'dashboard_index',
      displayName: 'menu.preferences',
      meta: {
        icon: 'fa-solid fa-user-gear',
      },
    },
    {
      name: 'settings',
      visible: 'dashboard_index',
      displayName: 'menu.settings',
      meta: {
        icon: 'fa-solid fa-gear',
      },
    },
  ] as INavigationRoute[],
}
