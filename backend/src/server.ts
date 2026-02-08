import express from "express"
import cors from "cors"
const app = express()

/*  Middleware  */
app.use(cors())

app.get("/api", (req, res) => {
	res.json({ message: "api goes here ..." })
})

/* health check  */
app.get("/health", (req, res) => {
	res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(
		`Server is running. Test it out at http://localhost:${PORT}/health`,
	)
})
