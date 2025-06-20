const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const model = require("../models/user.model")

module.exports = {

    register: async (user) => {
        if (!user.name || typeof user.name != "string" || user.name.trim().length == 0) {
            throw new Error("Missing or invalid user name")
        }

        if (!user.surname || typeof user.surname != "string" || user.surname.trim().length == 0) {
            throw new Error("Missing or invalid user surname")
        }

        if (!user.email || typeof user.email != "string" || user.email.trim().length == 0) {
            throw new Error("Missing or invalid user email")
        }

        if (!user.password || typeof user.password != "string" || user.password.trim().length == 0) {
            throw new Error("Missing or invalid user password")
        }

        user.password = await bcrypt.hash(user.password, 10)

        try {
            const result = await model.create(user)

            delete result.password
            const token = jwt.sign({ ...result, _id: result._id.toString() }, process.env.auth_secret)

            return { accessToken: token }
        } catch (e) {
            if (e.toString().includes("duplicate key")) throw new Error("There is already a user created with that email")
            throw new Error(e.message)
        }

    },

    login: async (credentials) => {

        if (!credentials.email || typeof credentials.email != "string" || credentials.email.trim().length == 0) {
            throw new Error("Missing or invalid user email")
        }

        if (!credentials.password || typeof credentials.password != "string" || credentials.password.trim().length == 0) {
            throw new Error("Missing or invalid user password")
        }

        try {
            const user = await model.get({ email: credentials.email })
            if (!user) throw new Error("There is no valid user with that email")

            const valid = await bcrypt.compare(credentials.password, user.password)
            if (!valid) throw new Error("Incorrect password")

            delete user.password
            const token = jwt.sign({ ...user, _id: user._id.toString() }, process.env.auth_secret)
            
            return { accessToken: token }

        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }

    },

    logout: async (userId) => {
        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user email")
        }

        try {
            const user = await model.getById(userId)
            user.tokenVersion += 1

            const result = await model.update(user)
            return result == "User successfully updated" ? "Logged out" : "Something went wrong while logging out"
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }

    },

    getById: async (userId) => {

        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        try {
            return await model.getById(userId)
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    },

    update: async (user) => {
        if (!user.name || typeof user.name != "string" || user.name.trim().length == 0) {
            throw new Error("Missing or invalid user name")
        }

        if (!user.surname || typeof user.surname != "string" || user.surname.trim().length == 0) {
            throw new Error("Missing or invalid user surname")
        }

        if (!user.email || typeof user.email != "string" || user.email.trim().length == 0) {
            throw new Error("Missing or invalid user email")
        }

        try {
            return await model.update(user)
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }

    },

    delete: async (userId) => {
        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        try {
            return await model.logicDeletion(userId)
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    }

}
