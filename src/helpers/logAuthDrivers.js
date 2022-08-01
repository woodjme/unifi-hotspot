const axios = require('axios')

module.exports = {
  webhook: async (formData) => {
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
  }
}
