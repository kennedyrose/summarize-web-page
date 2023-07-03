import cheerio from 'cheerio'
import unfluff from 'unfluff'
import fetch from 'isomorphic-fetch'
import get from 'lodash/get.js'
import { Configuration, OpenAIApi } from 'openai'

const defaultOptions = {
	inputType: `url`,
	outputType: `array`,
	prompt: `Summarize the following content in bullet points. Each bullet point should be on its own line should not have any hyphen or number at the start.`,
	model: `gpt-3.5-turbo`,
	inputTokens: 3500,
}


export default async function summarize(input, userOptions){
	const options = {
		...defaultOptions,
		...userOptions,
	}
	if(!options.inputCharacters){
		options.inputCharacters = options.inputTokens * 4
	}

	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	})
	options.openai = new OpenAIApi(configuration)

	let html = options.inputType === `html` ? input : ``
	let text = options.inputType === `text` ? input : ``
	let output = {
		summary: ``,
		tokens: 0,
		apiCalls: 0,
	}

	// Fetch HTML
	if(options.inputType === `url`){
		output.url = input
		const response = await fetch(input)
		html = await response.text()
	}

	// Extract text from HTML
	if(html){
		const $ = cheerio.load(html)
		text = unfluff(html).text
		output.title = $(`title`).text()
		output.description = $(`meta[name="description"]`).attr(`content`)
	}

	// Summarize text
	if(text){
		const res = await articleToSummary(text, options)
		output.summary = res.summary
		output.tokens += res.tokens
		output.apiCalls++
		if(options.outputType === `array`){
			output.summary = output.summary.split(`\n`)
		}
	}

	// Return summary
	return output
}



async function articleToSummary(article, options){
	// Split article into paragraphs
	article = article.trim()
	const lines = article.split(`\n`)

	// Split paragraphs into chunks no greater than inputCharacters
	const chunks = []
	let chunk = ``
	for(let line of lines){
		if(chunk.length + line.length > options.inputCharacters){
			chunks.push(chunk)
			chunk = ``
		}
		chunk += `${line}\n`
	}
	chunks.push(chunk)

	// Summarize each chunk
	const summaries = await Promise.all(chunks.map(chunk => summarizeText(chunk, options)))

	// Join chunks
	const result = []
	let tokens = 0
	for(let i = 0; i < summaries.length; i++){
		result.push(summaries[i].summary)
		tokens += summaries[i].tokens
	}

   const summary = result.join(`\n`)
	return {
		summary,
		tokens,
	}
}

async function summarizeText(article, options){
	const response = await options.openai.createChatCompletion({
		model: options.model,
		messages: [
			{role: `system`, content: options.prompt},
			{role: `user`, content: article},
		],
	})
	const tokens = get(response, `data.usage.total_tokens`)
	const message = get(response, `data.choices[0].message.content`, ``).trim()

	let summary = message.split(`\n`)
	summary = summary.map(line => {
		// Remove hyphens from start of line
		if(line.startsWith(`- `)){
			line = line.slice(2)
		}
		return line.trim()
	})
	summary = summary.join(`\n`)
	return {
		summary,
		tokens,
	}
}