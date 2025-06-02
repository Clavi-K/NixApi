const { Router } = require("express")

const service = require("../services/transaction.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", auth, async (req, res) => {
    const newTransaction = req.body
    const { user } = req

    try {
        const result = await service.create(user._id, newTransaction)
        return res.status(201).send(result)
    } catch (e) {
        return res.status(500).send(e.toString())
    }
})

router.get("/", auth, async (req, res) => {
    const filters = req.query
    const { user } = req

    try {
        const result = await service.get(user._id, filters)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send(e.toString())
    }

})

router.put("/", auth, async (req, res) => {
    const transaction = req.body
    const { user } = req

    try {
        const result = await service.update(user._id, transaction)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send(e.toString())
    }
})

router.delete("/", auth, async (req, res) => {
    const { id } = req.query
    const { user } = req

    try {
        const result = await service.delete(user._id, id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send(e.toString())
    }

})

module.exports = router

