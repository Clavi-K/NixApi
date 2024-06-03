/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/transaction.model")
const categoryModel = require("../models/category.model")
const walletModel = require("../models/wallet.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (transaction) => {

        if (!transaction.type || (transaction.type != "addition" && transaction.type !== "substraction")) {
            throw new Error("Missing or invalid transaction type")
        }

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

        try {

            const categoryExists = await categoryModel.existsById(transaction.categoryId)
            if (!categoryExists) {
                throw new Error("The provided category ID does not match with any existing category")
            }

            const walletExists = await walletModel.existsById(transaction.walletId)
            if (!walletExists) {
                throw new Error("The provided ID does not match with any existing wallet")
            }

            return await model.create(transaction)
        } catch (e) {
            throw new Error(e)
        }

    },

    filteredGet: async (filters) => {
        const modelFilters = { dateTime: {}, amount: {} }

        if (filters.type && (filters.type == "addition" || filters.type == "substraction")) {
            modelFilters.type = filters.type
        }

        if (filters.fromDate && new Date(filters.fromDate) != "Invalid Date") {
            modelFilters.dateTime.$gte = new Date(filters.fromDate)
        }

        if (filters.toDate && new Date(filters.toDate) != "Invalid Date") {
            if (!modelFilters.dateTime.$gte || (modelFilters.dateTime.$gte && modelFilters.dateTime.$gte < new Date(filters.toDate))) {
                modelFilters.dateTime.$lte = new Date(filters.toDate)
            }
        }

        if (filters.fromAmount && !isNaN(parseFloat(filters.fromAmount))) {
            modelFilters.amount.$gte = parseFloat(filters.fromAmount)
        }

        if (filters.toAmount && !isNaN(parseFloat(filters.toAmount))) {
            if (!modelFilters.amount.$gte || (modelFilters.amount.$gte && modelFilters.amount.$gte < parseFloat(filters.toAmount))) {
                modelFilters.amount.$lte = parseFloat(filters.toAmount)
            }
        }

        if (Object.keys(modelFilters.dateTime).length == 0) delete modelFilters.dateTime
        if (Object.keys(modelFilters.amount).length == 0) delete modelFilters.amount

        try {

            if (filters.categoryId && typeof filters.categoryId == "string" && await categoryModel.existsById(filters.categoryId)) {
                modelFilters.categoryId = filters.categoryId
            }

            if (filters.walletId && typeof filters.walletId == "string" && await walletModel.existsById(filters.walletId)) {
                modelFilters.walletId = filters.walletId
            }

            return await model.filteredGet(modelFilters)

        } catch (e) {
            throw new Error(e)
        }

    },

    getAll: async () => {
        try {
            return await model.getAll()
        } catch (e) {
            throw new Error(e)
        }
    }

}

/* ========== */