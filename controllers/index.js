const { Router } = require("express")

const transactionController = require("./transaction.controller")
const categoryController = require("./category.controller")
const userController = require("./user.controller")
const walletController = require("./wallet.controller")

const router = Router()

router.use("/transaction", transactionController)
router.use("/category", categoryController)
router.use("/user", userController)
router.use("/wallet", walletController)

router.use("*/*", async(req, res, next) => {
    try {
        return res.status(404).send("This route is not implemented")
    } catch (e) {
        return next(e)
    }
})

module.exports = router

