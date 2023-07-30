const express = require("express")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const dotenv = require("dotenv")
dotenv.config()

const FLASK_SERVER_URL = process.env.FLASK_SERVER_URL || "http://localhost:5000"

const app = express()
const port = process.env.PORT || 4004

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (_, res) => {
	res.status(200).send({ text: "Hello World!"})
})

app.get("/files/:fileId", async(req, res) => {
	const { fileId } = req.params
	const response = await fetch(`${FLASK_SERVER_URL}/files/${fileId}`)
	
	// the response could be a video file or a png file, get that and send that as it is to the client
	const data = await response.buffer()

	// set the content type of the response to the type of the file
	res.set("Content-Type", response.headers.get("content-type"))

	// send the file to the client
	res.status(200).send(data)
})

app.get("/ip/files/:fileId", async(req, res) => {
	const { fileId } = req.params
	const response = await fetch(`${FLASK_SERVER_URL}/ip/files/${fileId}`)
	
	// the response could be a video file or a png file, get that and send that as it is to the client
	const data = await response.buffer()

	// set the content type of the response to the type of the file
	res.set("Content-Type", response.headers.get("content-type"))

	// send the file to the client
	res.status(200).send(data)
})

app.post("/generate", async(req, res) => {
	let { story, title } = req.body
	try {
		const response = await fetch(`${FLASK_SERVER_URL}/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ story, title })
		})
		console.log(response)
		const data = await response.json()
		res.status(200).send(data)
	} catch (error) {
		console.log(error)
		res.status(500).send({ error: "Something went wrong" })
	}
})
