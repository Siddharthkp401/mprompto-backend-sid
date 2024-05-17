import express from 'express';
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import fileContentRoute from './fileContent.route.js';
import urlContentRoute from './urlContent.route.js';
import companyContentRoute from './companyContent.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/file-content',
    route: fileContentRoute,
  },
  {
    path: '/url-content',
    route: urlContentRoute,
  },
  {
    path: '/company-content',
    route: companyContentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
