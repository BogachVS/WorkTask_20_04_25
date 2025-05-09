import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import createError from 'http-errors';
import express from 'express';
import logger from 'morgan';

import sequelize from './db.config.js';

import SubscriptionRouter from './routes/SubscriptionRoutes.js';
import ProjectRouter from './routes/ProjectRoutes.js';
import UserRouter from './routes/UserRoutes.js';
import AuthRouter from './routes/AuthRoutes.js';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./controllers/*.js', './routes/*.js'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
}, swaggerUi.serve, swaggerUi.setup(specs));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/subscriptions', SubscriptionRouter);
app.use('/projects', ProjectRouter);
app.use('/users', UserRouter);
app.use('/auth', AuthRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

sequelize.sync();

export default app;
