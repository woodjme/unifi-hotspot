const axios = require('axios')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const mailchimp = require('@mailchimp/mailchimp_marketing');

module.exports = {
  webhook: async (formData) => {
    // Post formData to webhook
    if (process.env.LOG_AUTH_WEBHOOK_URL) {
      try {
        return await axios.post(process.env.LOG_AUTH_WEBHOOK_URL, formData)
      } catch (err) {
        console.error(err)
        console.error('Log Auth Webhook Failed')
        // throwing an error here will stop device authorisation -
        // bad if the webhook is down
      }
    } else {
      console.error('Skipping webhook - LOG_AUTH_WEBHOOK_URL not set')
    }
  },
  googleSheets: async (formData) => {
    // Post formData to Google Sheets
    if (process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.LOG_AUTH_GOOGLE_SHEET_ID) {
      try {
        // Setup Document
        const doc = new GoogleSpreadsheet(process.env.LOG_AUTH_GOOGLE_SHEET_ID)

        // Authenticate
        await doc.useServiceAccountAuth({
          client_email: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
        })

        // Get sheet
        await doc.loadInfo()
        const sheet = doc.sheetsByIndex[0]

        // Add Row
        return await sheet.addRow(formData)
      } catch (err) {
        console.error(err)
        console.error('Google Sheets Failed')
      }
    } else {
      console.error('Skipping Google Sheets - required env vars not set')
    }
  },
  mailchimp: async (formData) => {
    // Add email to Mailchimp list
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_SERVER_PREFIX && process.env.MAILCHIMP_LIST_ID) {
      try {
        mailchimp.setConfig({
          apiKey: process.env.MAILCHIMP_API_KEY,
          server: process.env.MAILCHIMP_SERVER_PREFIX
        });

        const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
          email_address: formData.email,
          status: 'subscribed'
        });

        return response;
      } catch (err) {
        console.error(err);
        console.error('Mailchimp Failed');
      }
    } else {
      console.error('Skipping Mailchimp - required env vars not set');
    }
  }
}
