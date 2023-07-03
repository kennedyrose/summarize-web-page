import summarize from './src/index.js'

summarize(`https://kennedyrose.com/how-to-start-your-own-webflow-agency`, {
    apiKey: process.env.OPENAI_API_KEY,
  })
  .then(console.log)
  .catch(console.error)