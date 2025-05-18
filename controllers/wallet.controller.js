/* ===== REQUIRED IMPORTS ===== */

const service = require("../services/wallet.service")
const { auth } = require("../middlewares")

const { Router } = require("express")

/* ========== */

/* ===== ROUTER ===== */

const router = Router()

/* ========== */

/* ===== ROUTES ===== */

router.post("/", async (req, res, next) => {
    const newWallet = req.body

    try {
        const result = await service.create(newWallet)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }

})

router.get("/", async (req, res, next) => {
    const { id } = req.params

    try {
        const result = await service.getByIds(id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */