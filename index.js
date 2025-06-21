const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require("dotenv");
const e = require("express");
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const port = 3000;

dotenv.config();
const app = express();
app.use(express.json());

const genAi = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" })

// setting multer
const upload = multer({ dest: "uploads/" })

// async function run(){
//     try {
//         let prompt = "Write a short story about a cat"
//         let result = await model.generateContent(prompt)
//         let response = result.response
//         console.log(response.text())
//     } catch (error) {
//         console.log(error)
//     }
// }

// run()

const imageGenerativePart = (filePath) => ({
    inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimeType: "image/png"
    }
})


// endpoint for generating text
app.post("/generate-text", async (req, res) => {
    const { prompt } = req.body
    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        res.status(200).json({
            output: response.text()
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// endpoint for generating image
app.post("/generate-from-image", upload.single("image"), async (req, res) => {
    const prompt = req.body.prompt || "Describe the image in detail";
    const image = imageGenerativePart(req.file.path);
    try {
        const result = await model.generateContent([prompt, image]);
        const response = result.response;
        res.status(200).json({
            output: response.text()
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(req.file.path);
    }
})

app.post("/generate-from-document", upload.single("document"), async (req, res) => {
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString("base64");
    const mimeType = req.file?.mimetype;

    try {
        const documentPart = {
            inlineData: {
                data: base64, mimeType
            }
        };
        const result = await model.generateContent(['Analyze the document and provide a summary', documentPart]);
        const response = result.response;
        res.json({ output: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message })
    } finally {
        fs.unlinkSync(filePath);
    }
})

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
    const audioBuffer = fs.readFileSync(req.file.path);
    const base64Audio = audioBuffer.toString("base64");
    const audioPart = {
        inlineData: {
            data: base64Audio,
            mimeType: req.file?.mimetype
        }
    };
    try {
        const result = await model.generateContent([
            "Transcribe the audio file and provide a summary", audioPart
        ]);
        const response = result.response;
        res.json({output: response.text()});
    } catch (error) {
        res.status(500).json({error: error.message})
    } finally {
        fs.unlinkSync(req.file.path);
    }
})



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})