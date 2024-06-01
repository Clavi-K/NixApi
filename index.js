const express = require("express")

const app = express()

const router = express.Router()

router.get("/test", (req,res) => res.send("Vercel?"))

app.use(express.json())

app.use("/", router)

app.listen(8080, () => console.log("listening on port 8080"))