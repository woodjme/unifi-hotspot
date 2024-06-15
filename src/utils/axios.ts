import axios from 'axios';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();

const instance = axios.create({
  baseURL: process.env.UNIFI_URL || process.env.URI,
  httpAgent: new HttpCookieAgent({
    jar
  }),
  httpsAgent: new HttpsCookieAgent({
    jar,
    rejectUnauthorized: false
  })
});

export default instance;
