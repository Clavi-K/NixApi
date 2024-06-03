/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/wallet.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    async create(wallet) {

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" || wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        try {
            return await model.create(wallet)
        } catch (e) {
            throw new Error(e)
        }

    }

}

/* ========== */
