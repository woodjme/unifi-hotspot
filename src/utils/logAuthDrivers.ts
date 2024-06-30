import axios from 'axios';
import crypto from 'crypto';
import { logger } from './logger';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT as GoogleAuthJWT, CredentialBody } from 'google-auth-library';

interface FormData {
  [key: string]: any;
}

export const webhook = async (formData: FormData): Promise<void> => {
  // Post formData to webhook
  if (process.env.LOG_AUTH_WEBHOOK_URL) {
    try {
      await axios.post(process.env.LOG_AUTH_WEBHOOK_URL, formData);
    } catch (err) {
      logger.error(err);
      logger.error('Log Auth Webhook Failed');
      // throwing an error here will stop device authorisation -
      // bad if the webhook is down
    }
  } else {
    logger.error('Skipping webhook - LOG_AUTH_WEBHOOK_URL not set');
  }
};

export const googleSheets = async (formData: FormData): Promise<void> => {
  // Post formData to Google Sheets
  try {
    //Ensure LOG_AUTH_GOOGLE_CREDENTIALS is defined
    if (!process.env.LOG_AUTH_GOOGLE_CREDENTIALS) {
      throw new Error('LOG_AUTH_GOOGLE_CREDENTIALS is not set');
    }

    // Ensure LOG_AUTH_GOOGLE_SHEET_ID is defined
    const sheetId = process.env.LOG_AUTH_GOOGLE_SHEET_ID;
    if (!sheetId) {
      throw new Error('LOG_AUTH_GOOGLE_SHEET_ID is not set');
    }

    const credentialsBase64String = process.env.LOG_AUTH_GOOGLE_CREDENTIALS;
    if (!credentialsBase64String) {
      throw new Error('LOG_AUTH_GOOGLE_CREDENTIALS is not set');
    }

    const credential: CredentialBody = JSON.parse(
      Buffer.from(credentialsBase64String, 'base64').toString('utf-8'),
    );

    // Authenticate
    const serviceAccountAuth = new GoogleAuthJWT({
      email: credential.client_email,
      key: credential.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Setup Document
    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // Load the document properties and sheets
    await doc.loadInfo();

    // Get the first sheet in the document
    const sheet = doc.sheetsByIndex[0];

    // Add a new row with formData
    const newRow = await sheet.addRow(formData);

    logger.info(`Row added successfully: ${newRow}`);
  } catch (err) {
    logger.error(err);
    logger.error('Google Sheets Failed');
  }
};

export const mailchimp = async (formData: FormData): Promise<void> => {
  //Ensure LOG_AUTH_MAILCHIMP_SERVER_PREFIX is defined
  if (!process.env.LOG_AUTH_MAILCHIMP_SERVER_PREFIX) {
    throw new Error('LOG_AUTH_MAILCHIMP_SERVER_PREFIX is not set');
  }

  //Ensure LOG_AUTH_MAILCHIMP_API_KEY is defined
  if (!process.env.LOG_AUTH_MAILCHIMP_API_KEY) {
    throw new Error('LOG_AUTH_MAILCHIMP_API_KEY is not set');
  }

  //Ensure LOG_AUTH_MAILCHIMP_LIST_ID is defined
  if (!process.env.LOG_AUTH_MAILCHIMP_LIST_ID) {
    throw new Error('LOG_AUTH_MAILCHIMP_LIST_ID is not set');
  }

  // Ensure formData.email is defined
  if (!formData.email) {
    throw new Error('Form has no property set - email');
  }
  try {
    const userData = {
      email_address: formData.email,
      status: 'subscribed',
    };
    const subscriberHash = crypto
      .createHash('md5')
      .update(userData.email_address.toLowerCase())
      .digest('hex');

    const response = await axios({
      method: 'post',
      url: `https://${process.env.LOG_AUTH_MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.LOG_AUTH_MAILCHIMP_LIST_ID}/members/${subscriberHash}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `apikey ${process.env.LOG_AUTH_MAILCHIMP_API_KEY}`,
      },
      data: JSON.stringify(userData),
    });

    logger.info(`User added successfully: ${response.data}`);
  } catch (err) {
    logger.error(err);
    logger.error('Mailchimp Failed');
  }
};
