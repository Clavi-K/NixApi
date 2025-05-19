const { Router } = require("express")

const service = require("../services/wallet.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", auth, async (req, res, next) => {
    const newWallet = req.body

    try {
        const result = await service.create(newWallet)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }

})

router.get("/", auth, async (req, res, next) => {
    const { id } = req.query
    const { user } = req

    try {
        const result = await service.getByIds(id, user._id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

router.put("/", auth, async (req, res, next) => {
    const { user } = req
    const wallet = req.body

    try {
        const result = await service.update(user._id, wallet)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }

})

module.exports = router

