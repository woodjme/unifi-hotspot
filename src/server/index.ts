import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import indexRouter from '../routes/index';
import authoriseRouter from '../routes/authorise';
import { config } from '../utils/config';
import { expressPino } from '../utils/logger';

const app = express();
const unifiSiteIdentifier = config.unifiSiteIdentifier;

// middleware
app.use(expressPino);
app.use(express.static('public'));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(
  session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true,
  }),
);

// routes
app.get('/', (req: Request, res: Response) => {
  res.redirect(301, `/guest/s/${unifiSiteIdentifier}/`);
});
app.use(`/guest/s/${unifiSiteIdentifier}/`, indexRouter);
app.use('/authorise', authoriseRouter);
app.get('/health', (req: Request, res: Response) => {
  res.send('OK');
});

export default app;
