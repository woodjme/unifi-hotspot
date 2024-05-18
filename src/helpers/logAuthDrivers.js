const axios = require('axios')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const { auth } = require('google-auth-library')

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
    if (
      process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.LOG_AUTH_GOOGLE_SHEET_ID
    ) {
      try {
        // Setup Document
        const doc = new GoogleSpreadsheet(process.env.LOG_AUTH_GOOGLE_SHEET_ID)

        // Authenticate
        const authClient = await auth.getClient({
          credentials: {
            client_email: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.LOG_AUTH_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
          },
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })

        // Apply the authentication client to the document
        await doc.useAuth(authClient)

        // Load the document properties and sheets
        await doc.loadInfo()

        // Get the first sheet in the document
        const sheet = doc.sheetsByIndex[0]

        // Add a new row with formData
        const newRow = await sheet.addRow(formData)

        console.log('Row added successfully:', newRow)
      } catch (err) {
        console.error(err)
        console.error('Google Sheets Failed')
      }
    } else {
      console.error('Skipping Google Sheets - required env vars not set')
    }
  }
}
