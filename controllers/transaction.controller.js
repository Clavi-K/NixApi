const { Router } = require("express")

const service = require("../services/transaction.service")

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

router.get("/:id", async (req,res,next) => {
    const transactionId = req.params.id

    try {
        const result = await service.getById(transactionId)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }

})

module.exports = router

