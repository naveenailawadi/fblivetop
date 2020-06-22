import { lazy } from 'react';

export default {
  root: {
    url: '/'
  },
  signIn: {
    url: '/sign-in',
    title: 'Sign In',
    component: lazy(() => import('../pages/SignIn'))
  },
  signUp: {
    url: '/register',
    title: 'Register',
    component: lazy(() => import('../pages/SignUp'))
  },
};
