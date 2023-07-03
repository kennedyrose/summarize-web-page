# Summarize Web Page

A Node.js module that outputs a summary of bullet points for a given URL. Uses OpenAI's API.

## Installation  

```bash
npm install @kennedyrose/summarize-web-page
```

or

```bash
yarn add @kennedyrose/summarize-web-page
```

## Usage
```js
import summarize from '@kennedyrose/summarize-web-page'

summarize(`https://kennedyrose.com/how-to-start-your-own-webflow-agency`, {
		apiKey: `YOUR_OPEN_AI_KEY`,
	})
	.then(console.log)
	.catch(console.error)
```

### Example Output
```js
{
  summary: [
    'Starting Snap, a subscription-based web development and hosting service/micro-agency with tools like Webflow',
    'Clients can easily update their own sites after development',
    'Need to use a combination of code-based and no-code tools for certain tasks',
    'Choose a specific niche to specialize in and provide solutions to pain points',
    'Stand out from other agencies by targeting a specific market or solving unique problems',
    'Write copy before designing the website to determine layout and images',
    'Build your own website using Webflow and customize it to differentiate from templates',
    "Payment requests can be sent via email with Stripe's customer portal, no need for a client dashboard",
    'Pricing can be customized for each client or offer personalized quotes',
    'Create ongoing value for customers to generate monthly recurring revenue',
    'Cold emailing and direct messaging can be effective for reaching ideal clients',
    'Ideal clients are those already using Webflow, as they understand the value the agency provides',
    'Use No-Code Movers, a list of thousands of Webflow sites, to find potential clients',
    'Listen to feedback and pivot frequently until finding the right fit',
    'Subscribe to the blog for more information on running a Webflow agency or SaaS business.'
  ],
  tokens: 1239,
  url: 'https://kennedyrose.com/how-to-start-your-own-webflow-agency',
  title: 'How to Start Your Own Webflow Agency',
  description: 'A few months ago, we publicly launched Snap, a subscription-based web development and hosting service/micro-agency. We use a number of tools, some are code-based, but many are no-code like Webflow. Webflow helps us do frontend development at an expon...'
}
```

## Configuration

Additional options can be supplied in the second argument.

```js
import summarize from '@kennedyrose/summarize-web-page'

summarize(`https://kennedyrose.com/how-to-start-your-own-webflow-agency`, {
		prompt: `Summarize the following content in bullet points. Each bullet point should be on its own line should not have any hyphen or number at the start.`,
		model: `gpt-3.5-turbo`,
		apiKey: `YOUR_OPEN_AI_KEY`,
	})
	.then(console.log)
	.catch(console.error)
```