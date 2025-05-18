/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/wallet.model")
const transactionService = require("./transaction.service")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (wallet) => {

        if (!wallet.userId || typeof wallet.userId !== "string" || wallet.userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        try {
            return await model.create(wallet)
        } catch (e) {
            throw new Error(e)
        }

    },

    getByIds: async (walletId, userId) => {
        if (!walletId || typeof walletId !== "string" || walletId.trim().length == 0) {
            throw new Error("Mising or invalid wallet ID")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Mising or invalid user ID")
        }

        try {
            return await model.get({ walletId, userId })
        } catch (e) {
            throw new Error(e)
        }

    },

    update: async (wallet) => {

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        if (!wallet.balance || !Number(parseFloat(wallet.balance))) {
            throw new Error("Missing or invalid wallet balance")
        }

        try {
            return await model.update(wallet)
        } catch (e) {
            throw new Error(e)
        }

    }

}

/* ========== */
