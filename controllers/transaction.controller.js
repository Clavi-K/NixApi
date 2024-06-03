/* ===== REQUIRED IMPORTS ===== */

const service = require("../services/transaction.service")
const { Router } = require("express")

/* ========== */

/* ===== ROUTER ===== */

const router = Router()

/* ========== */

/* ===== ROUTES ===== */

router.post("/create", async (req, res, next) => {
    const newTransaction = req.body

    try {
        const result = await service.create(newTransaction)
        return res.status(201).send(result)
    } catch (e) {
        next(e)
    }

})

router.get("/getAll", async (req, res, next) => {

    try {
        const results = await service.getAll()
        return res.status(200).send({ data: results })
    } catch (e) {
        next(e)
    }

})

router.get("/filteredGet", async (req, res, next) => {
    const { type, walletId, categoryId, fromDate, toDate, fromAmount, toAmount } = req.query
    try {
        const result = await service.getBetweenDates({ type, walletId, categoryId, fromDate, toDate, fromAmount, toAmount })
        return res.status(200).send(result)
    } catch (e) {
        next(e)
    }

})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */