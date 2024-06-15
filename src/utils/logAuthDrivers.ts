import axios from 'axios';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { logger } from './logger';

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
  if (
    process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
    process.env.LOG_AUTH_GOOGLE_SHEET_ID
  ) {
    try {
      // Setup Document
      const doc = new GoogleSpreadsheet(process.env.LOG_AUTH_GOOGLE_SHEET_ID);

      // Authenticate
      await doc.useServiceAccountAuth({
        client_email: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      });

      // Get sheet
      await doc.loadInfo();
      const sheet = doc.sheetsByIndex[0];

      // Add Row
      await sheet.addRow(formData);
    } catch (err) {
      logger.error(err);
      logger.error('Google Sheets Failed');
    }
  } else {
    logger.error('Skipping Google Sheets - required env vars not set');
  }
};
