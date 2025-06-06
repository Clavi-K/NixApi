const { Router } = require("express")

const service = require("../services/user.service")
const { auth } = require("../middlewares")

const router = Router()

router.post("/register", async (req, res) => {
    const newUser = req.body
    try {
        const result = await service.register(newUser)
        return res.status(201).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }

})

router.post("/login", async (req, res) => {
    const creds = req.body

    try {
        const result = await service.login(creds)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }
})


router.get("/", auth, async (req, res) => {
    const { user } = req

    try {
        const result = await service.getById(user._id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }

})

router.get("/logout", auth, async (req, res) => {
    const { user } = req
    try {
        const result = await service.logout(user._id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }
})

router.put("/", auth, async (req, res) => {
    const updatedUser = req.body

    try {
        const result = await service.update(updatedUser)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }

})

router.delete("/", auth, async (req, res) => {
    const { user } = req

    try {
        const result = await service.delete(user._id)
        return res.status(200).send(result)
    } catch (e) {
        return res.status(500).send({error: e.toString()})
    }
})

module.exports = router

