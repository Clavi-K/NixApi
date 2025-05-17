/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/user.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (user) => {

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
            return await model.create(user)
        } catch (e) {
            throw new Error(e)
        }

    },

    returnModel: () => {
        return model.returnModel()
    },

    filteredGet: async (filters) => {

        // if(filters.name && typeof filters.name === "string")

    }

}

/* ========== */