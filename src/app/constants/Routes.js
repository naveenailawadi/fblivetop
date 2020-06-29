import { lazy } from 'react';

export default {
  home: {
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
  forgotPassword: {
    url: '/forgot-password',
    title: 'Forgot Password',
    component: lazy(() => import('../pages/ForgotPassword'))
  },
  resetPassword: {
    url: '/reset-password',
    title: 'Reset Password',
    component: lazy(() => import('../pages/ResetPassword'))
  },
  adminPanel: {
    url: '/admin',
    title: 'Admin Panel',
    protected: true,
    admin: true,
    component: lazy(() => import('../pages/AdminPanel'))
  },
};
