import { GoogleGenAI } from "@google/genai";


const genAi = new GoogleGenAI(process.env.api_key)
const model = genAigenAi.genGenerativeModel({model: "models/gemini-1.5-flash"})

const genAI = new GoogleGenAI

async function run() {
    try {
        let prompt = `write story about ai and magic`
        let result = await model.generateContent(prompt)
        let response = result.response
        console.log(response.text())
    } catch (error) {
        console.log(error)
    }
}

run();