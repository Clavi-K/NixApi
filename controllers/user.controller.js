/* ===== REQUIRED IMPORTS ===== */

const service = require("../services/user.service")
const { Router } = require("express")

/* ========== */

/* ===== ROUTER ===== */

const router = Router()

/* ========== */

/* ===== ROUTES ===== */

router.get("/", (req, res) => {
    return res.status(200).send("This is a placeholder")
})

router.post("/", async (req, res, next) => {
    const newUser = req.body

    try {
        const result = await service.create(newUser)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }

})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */