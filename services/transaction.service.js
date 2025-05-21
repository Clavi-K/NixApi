const model = require("../models/transaction.model")
const categoryModel = require("../models/category.model")
const walletModel = require("../models/wallet.model")
const userModel = require("../models/user.model")
const utils = require("../utils")

module.exports = {

    create: async function (userId, transaction) {

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

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid transaction user ID")
        }

        if (transaction.dateTime && !utils.isValidDateString(transaction.dateTime)) {
            throw new Error("Missing or invalid transaction datetime")
        } else {
            transaction.dateTime = new Date(transaction.dateTime)
        }

        transaction.userId = userId

        try {

            let category = await categoryModel.get({ userId: transaction.userId, walletId: transaction.walletId, _id: transaction.categoryId })
            let wallet = await walletModel.get({ _id: transaction.walletId, userId: transaction.userId })

            if (category.type == "substraction") {
                if ((wallet.balance - transaction.amount) < 0) throw new Error("The wallet balance cannot be below zero")
                wallet.balance = wallet.balance - transaction.amount
            } else if (category.type == "addition") {
                wallet.balance = parseFloat(wallet.balance) + parseFloat(transaction.amount)
            }

            await walletModel.updateBalance(wallet._id, wallet.balance)
            return await model.create(transaction)

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    get: async function (userId, filters) {

        if (!filters) {
            throw new Error("Filters are required to return transactions")
        }

        if (!userId || typeof userId !== "string" || userId.trim().legnth == 0) {
            throw new Error("Missing or invalid filter user ID")
        }

        if (!filters.walletId || typeof filters.walletId !== "string" || filters.walletId.trim().legnth == 0) {
            throw new Error("Missing or invalid filter wallet ID")
        }

        let user = await userModel.get({ _id: userId })
        let dbWallets = await walletModel.get({ userId: user._id, _id: filters.walletId })
        let dbWallet = dbWallets[0] || null

        if (!user) {
            throw new Error("The provided user ID does not match with any created user")
        }

        if (!dbWallet) {
            throw new Error("The provided wallet ID does not match with any wallet of the user")
        }

        let dbFilters = { userId: user._id, walletId: dbWallet._id }

        if (filters.categoryId && typeof filters.categoryId == "string" && filters.categoryId.trim().legnth > 0) {
            dbFilters.categoryId = filters.categoryId
        } else if (filters.categoryId) {
            throw new Error("Invalid categoryId filter")
        }

        if (filters.note && typeof filters.note == "string" && filters.note.trim().length > 0) {
            dbFilters.note = { $regex: filters.note, $options: "i" }
        } else if (filters.note) {
            throw new Error("Invalid note filter")
        }

        if (filters.fromDate && utils.isValidDateString(filters.fromDate)) {
            dbFilters.dateTime = { $gte: new Date(filters.fromDate) }
        } else if (filters.fromDate) {
            throw new Error("Invalid fromDate filter")
        }

        if (filters.toDate && utils.isValidDateString(filters.toDate)) {
            dbFilters.dateTime = { ...dbFilters.dateTime, $lte: new Date(filters.toDate) }
        } else if (filters.toDate && !utils.isValidDateString(filters.toDate)) {
            throw new Error("Invalid toDate filter")
        }

        if ((dbFilters.dateTime?.$gte && dbFilters.dateTime?.$lte) && (dbFilters.dateTime.$gte > dbFilters.dateTime.$lte)) {
            throw new Error("ToDate filter cannot be lower than fromDate filter")
        }

        if (filters.fromAmount && !isNaN(parseFloat(filters.fromAmount))) {
            dbFilters.amount = { $gte: parseFloat(filters.fromAmount) }
        } else if (filters.fromAmount) {
            throw new Error("Invalid fromAmount filter")
        }

        if (filters.toAmount && !isNaN(parseFloat(filters.toAmount))) {
            dbFilters.amount = { ...dbFilters.amount, $lte: parseFloat(filters.toAmount) }
        } else if (filters.toAmount) {
            throw new Error("Invalid toAmount filter")
        }

        if ((dbFilters.amount?.$gte && dbFilters.amount?.$lte) && (dbFilters.amount.$gte > dbFilters.amount.$lte)) {
            throw new Error("ToAmount filter cannot be lower than fromAmount filter")
        }

        try {
            console.log("dbFilters ",dbFilters)
            return await model.get(dbFilters)
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    getById: async function (transactionId) {
        if (!transactionId || typeof transactionId != "string" || transactionId.trim().length == 0) {
            throw new Error("Missing or invalid transaction note")
        }

        try {
            return await model.get({ _id: transactionId })
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    },

    update: async function (transaction) {

        if (!transaction.categoryId || typeof transaction.categoryId !== "string" || transaction.categoryId.trim().length == 0) {
            throw new Error("Missing or invalid transaction category ID")
        }

        if (!transaction.walletId || typeof transaction.walletId !== "string" || transaction.walletId.trim().length == 0) {
            throw new Error("Missing or invalid transaction wallet ID")
        }

        if (!transaction.userId || typeof transaction.userId !== "string" || transaction.userId.trim().length == 0) {
            throw new Error("Missing or invalid transaction user ID")
        }

        if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
            throw new Error("Missing or invalid transaction amount")
        }

        if (!transaction.note || typeof transaction.note != "string" || transaction.note.trim().length == 0) {
            throw new Error("Missing or invalid transaction note")
        }

        if (transaction.dateTime && !utils.isValidDateString(transaction.dateTime)) {
            throw new Error("Missing or invalid transaction datetime")
        } else {
            transaction.dateTime = new Date(transaction.dateTime)
        }

        try {
            delete transaction.walletId
            delete transaction.userId

            const result = await model.update(transaction)
            return result

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }
}
