import express, { Request, Response } from 'express';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
const indexRouter = express.Router();

indexRouter.route('/').get((req: Request, res: Response) => {
  req.session.macAddr = req.query.id as string;
  req.session.accessPoint = req.query.ap as string;
  req.session.time = req.query.t as string;
  req.session.url = req.query.url as string;
  req.session.ssid = req.query.ssid as string;
  logger.debug(`Session: ${JSON.stringify(req.session)}`);

  switch (config.auth) {
    case 'none':
      res.sendFile(`${process.env.PWD}/public/noAuth.html`);
      break;
    case 'simple':
      res.sendFile(`${process.env.PWD}/public/simple.html`);
      break;
    case 'userInfo':
      res.sendFile(`${process.env.PWD}/public/userInfo.html`);
      break;
    case 'custom':
      res.sendFile(`${process.env.PWD}/public/custom.html`);
      break;
    default:
      res.sendFile(`${process.env.PWD}/public/simple.html`);
  }
});

export default indexRouter;
