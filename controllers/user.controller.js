const { Router } = require("express")

const service = require("../services/user.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/register", async (req, res, next) => {
    const newUser = req.body

    try {
        const result = await service.register(newUser)
        return res.status(201).send(result)
    } catch (e) {
        return res.status(500).send(e.toString())
    }

})

router.post("/login", async (req, res, next) => {
    const creds = req.body

    try {
        const result = await service.login(creds)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})


router.get("/", auth, async (req, res, next) => {
    const { user } = req

    try {
        const result = await service.getById(user._id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }

})

router.get("/logout", auth, async (req, res, next) => {
    const { user } = req
    try {
        const result = await service.logout(user._id)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }
})

router.put("/", auth, async (req, res, next) => {
    const updatedUser = req.body

    try {
        const result = await service.update(updatedUser)
        return res.status(200).send(result)
    } catch (e) {
        return next(e)
    }

})

router.delete("/", auth, async (req, res, next) => {
    const { user } = req

    try {
        const result = await service.delete(user._id)
        return res.status(200).send(result)
    } catch (e) {
        console.error(e)
        return next(e)
    }
})

module.exports = router

