/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/transaction.model")
const categoryService = require("./category.service")
const walletModel = require("../models/wallet.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (transaction) => {

        if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
            throw new Error("Missing or invalid transaction amount")
        }

        if (!transaction.note || typeof transaction.note != "string" || transaction.note.trim().length == 0) {
            throw new Error("Missing or invalid transaction note")
        }

        if (!transaction.categoryId || typeof transaction.categoryId !== "string" || transaction.categoryId.trim().length == 0) {
            throw new Error("Missing or invalid transaction category ID")
        }

        if (!transaction.walletId || typeof transaction.walletId !== "string" || transaction.walletId.trim().length == 0) {
            throw new Error("Missing or invalid transaction wallet ID")
        }

        if (!transaction.userId || typeof transaction.userId !== "string" || transaction.userId.trim().length == 0) {
            throw new Error("Missing or invalid transaction user ID")
        }

        try {

            let category = await categoryService.getById(transaction.categoryId)
            let wallet = await walletModel.getById(transaction.walletId)

            if (category.type == "substraction") {
                if ((wallet.balance - transaction.amount) < 0) throw new Error("The wallet balance cannot be below zero")
                wallet.balance = wallet.balance - transaction.amount
            } else if (category.type == "addition") {
                wallet.balance = parseFloat(wallet.balance) + parseFloat(transaction.amount)
            }

            await walletModel.updateWallet(wallet)
            return await model.create(transaction)

        } catch (e) {
            throw new Error(e)
        }

    },

    get: async (filters) => {

        if (!filters) {
            throw new Error("Filters are required to return transactions")
        }

        if(!filters.userId || typeof filters.userId !== "string" || filters.userId.trim().legnth == 0) {
            throw new Error("Missing or invalid filter user ID")
        }

        if(!filters.walletId || typeof filters.walletId !== "string" || filters.walletId.trim().legnth == 0) {
            throw new Error("Missing or invalid filter wallet ID")
        }

        try {
            return await model.get(filters)
        } catch(e) {
            throw new Error(e )
        }

    },

    getAll: async () => {
        try {
            return await model.getAll()
        } catch (e) {
            throw new Error(e)
        }
    },

    getById: async (transactionId) => {
        if (!transactionId || typeof transactionId != "string" || transactionId.trim().length == 0) {
            throw new Error("Missing or invalid transaction note")
        }

        try {
            return await model.getById(transactionId)
        } catch (e) {
            throw new Error(e)
        }
    }

}

/* ========== */