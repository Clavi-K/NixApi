/* ===== REQUIRED IMPORTS ===== */

const { Router } = require("express")

const transactionController = require("./transaction.controller")
const categoryController = require("./category.controller")
const tenantController = require("./tenant.controller")

/* ========== */

/* ===== ROUTER DEFINITIONS ===== */

const router = Router()

/* ========== */

/* ===== ROUTERS IMPLEMENTATION ===== */

router.use("/transaction", transactionController)
router.use("/category", categoryController)
router.use("/tenant", tenantController)

/* ========== */

/* ===== ROUTERS IMPLEMENTATION ===== */

router.use("*/*", async(req, res, next) => {

    try {
        res.status(404).send("This route is not implemented")
    } catch (e) {
        next(e)
    }

})

/* ========== */

/* ===== ROUTER EXPORT ===== */

module.exports = router

/* ========== */