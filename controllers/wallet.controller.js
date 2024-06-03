/* ===== REQUIRED IMPORTS ===== */

const service = require("../services/wallet.service")
const { Router } = require("express")

/* ========== */

/* ===== ROUTER ===== */

const router = Router()

/* ========== */

/* ===== ROUTES ===== */

router.post("/create", async (req, res, next) => {
    const newWallet = req.body

    try {
        const result = await service.create(newWallet)
        return res.status(201).send(result)
    } catch (e) {
        next(e)
    }

})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */