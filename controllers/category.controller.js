const { Router } = require("express")

const service = require("../services/category.service")

const router = Router()

router.post("/", async (req, res, next) => {
    const newCategory = req.body

    try {
        const result = await service.create(newCategory)
        return res.status(201).send(result)
    } catch (e) {
        return next(e)
    }

})

module.exports = router
