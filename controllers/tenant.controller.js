/* ===== REQUIRED IMPORTS ===== */

const service = require("../services/tenant.service")
const { Router } = require("express")

/* ========== */

/* ===== ROUTER ===== */

const router = Router()

/* ========== */

/* ===== ROUTES ===== */

router.get("/", (req,res) => {
    service.getProps()
})

router.post("/create", async(req,res) => {

})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */