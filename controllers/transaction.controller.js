const { Router } = require("express")

const service = require("../services/transaction.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", async (req, res, next) => {
    const newTransaction = req.body

    try {
        const result = await service.create(newTransaction)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }
})

router.get("/", async (req, res, next) => {
    const filters = req.query

    try {
        const result = await service.get(filters)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }

})

router.put("/", auth, async (req, res, next) => {
    const transaction = req.body

    try {
        const result = await service.update(transaction)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

module.exports = router

