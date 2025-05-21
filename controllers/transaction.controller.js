const { Router } = require("express")

const service = require("../services/transaction.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", async (req, res, next) => {
    const newTransaction = req.body
    const { user } = req
    
    try {
        const result = await service.create(user._id, newTransaction)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }
})

router.get("/", auth, async (req, res, next) => {
    const filters = req.query
    const { user } = req

    try {
        const result = await service.get(user._id, filters)
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

