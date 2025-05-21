const { Router } = require("express")

const service = require("../services/category.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/", auth, async (req, res, next) => {
    const newCategory = req.body
    const { user } = req

    try {
        const result = await service.create(user._id, newCategory)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }

})

router.get("/", auth, async (req, res, next) => {
    const { id, walletId } = req.query
    const { user } = req

    try {
        const result = await service.get(user._id, walletId, id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

router.put("/", auth, async (req, res, next) => {
    const category = req.body
    const { user } = req

    try {
        const result = await service.update(user._id, category)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

router.delete("/", auth, async (req, res, next) => {
    const { id } = req.query
    const { user } = req

    try {
        const result = await service.delete(user._id, id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

module.exports = router
