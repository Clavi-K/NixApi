const { Router } = require("express")

const service = require("../services/wallet.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", auth, async (req, res) => {
    const newWallet = req.body
    const { user } = req

    try {
        const result = await service.create(user._id, newWallet)
        return res.status(201).send(result)
    } catch (e) {
        return res.status(500).send({ error: e.toString() })
    }

})

router.get("/", auth, async (req, res) => {
    const { id } = req.query
    const { user } = req
    try {
        const result = await service.get(user._id, id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({ error: e.toString() })
    }
})

router.put("/", auth, async (req, res) => {
    const wallet = req.body
    const { user } = req

    try {
        const result = await service.update(user._id, wallet)
        console.log("result ", result)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({ error: e.toString() })
    }

})

router.delete("/", auth, async (req, res) => {
    const { id } = req.query
    const { user } = req

    try {
        const result = await service.delete(user._id, id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({ error: e.toString() })
    }

})

module.exports = router

