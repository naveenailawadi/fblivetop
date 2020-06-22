import { lazy } from 'react';

export default {
  root: {
    url: '/',
    title: 'Streaming Form',
    component: lazy(() => import('../pages/StreamingForm')),
    protected: true,
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
