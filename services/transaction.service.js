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
        } else if (transaction.dateTime) {
            transaction.dateTime = new Date(transaction.dateTime)
        }

        transaction.userId = userId

        try {

            const dbCategories = await categoryModel.get({ userId: transaction.userId, walletId: transaction.walletId, _id: transaction.categoryId })
            const dbCategory = dbCategories[0] || null

            if (!dbCategory) throw new Error("No category found")

            const dbWallets = await walletModel.get({ _id: transaction.walletId, userId: transaction.userId })
            const dbWallet = dbWallets[0] || null

            if (!dbWallet) throw new Error("No wallet found")


            if (dbCategory.type == "substraction") {
                if ((dbWallet.balance - transaction.amount) < 0) throw new Error("The wallet balance cannot be below zero")
                dbWallet.balance = dbWallet.balance - transaction.amount
            } else if (dbCategory.type == "addition") {
                dbWallet.balance = parseFloat(dbWallet.balance) + parseFloat(transaction.amount)
            }

            await walletModel.updateBalance(dbWallet._id, dbWallet.balance)
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
            throw new Error("Missing or id filter wallet ID")
        }

        let user = await userModel.get({ _id: userId })
        const dbWallets = await walletModel.get({ userId: user._id, _id: filters.walletId })
        const dbWallet = dbWallets[0] || null

        if (!user) {
            throw new Error("The provided user ID does not match with any created user")
        }

        if (!dbWallet) {
            throw new Error("The provided wallet ID does not match with any wallet of the user")
        }

        const dbFilters = { userId: user._id, walletId: dbWallet._id }

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

    update: async function (userId, transaction) {

        if (!transaction._id || typeof transaction._id !== "string" || transaction._id.trim().length == 0) {
            throw new Error("Missing or invalid transaction ID")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid transaction user ID")
        }

        if (!transaction.amount || isNaN(transaction.amount) || transaction.amount <= 0) {
            throw new Error("Missing or invalid transaction amount")
        }

        if (!transaction.note || typeof transaction.note != "string" || transaction.note.trim().length == 0) {
            throw new Error("Missing or invalid transaction note")
        }

        if (transaction.dateTime && !utils.isValidDateString(transaction.dateTime)) {
            throw new Error("Invalid transaction datetime")
        } else if (transaction.dateTime) {
            transaction.dateTime = new Date(transaction.dateTime)
        }

        try {

            const dbTransactions = await model.get({ _id: transaction._id, userId })
            const dbTransaction = dbTransactions[0] || null
            if (!dbTransaction) throw new Error("No transaction found for that user")

            const dbWallets = await walletModel.get({ _id: dbTransaction.walletId, userId })
            const dbWallet = dbWallets[0] || null
            if (!dbWallet) throw new Error("No wallet found for that user")

            const dbCategories = await categoryModel.get({ _id: dbTransaction.categoryId })
            const dbCategory = dbCategories[0] || null
            if (!dbCategory || (dbCategory && dbCategory.userId && dbCategory.userId.toString() !== userId)) throw new Error("No category found for that user")

            delete transaction.walletId
            delete transaction.userId
            delete transaction.categoryId

            const result = await model.update(transaction)

            if (dbTransaction.amount !== transaction.amount) {
                let difference = Math.abs(dbTransaction.amount - transaction.amount)
                let walletBalance

                if (dbCategory.type == "addition" && dbTransaction.amount > transaction.amount) {
                    walletBalance = parseFloat(dbWallet.balance) - difference
                } else if (dbCategory.type == "addition" && dbTransaction.amount < transaction.amount) {
                    walletBalance = parseFloat(dbWallet.balance) + difference
                } else if (dbCategory.type == "substraction" && dbTransaction.amount > transaction.amount) {
                    walletBalance = parseFloat(dbWallet.balance) + difference
                } else if (dbCategory.type == "substraction" && dbTransaction.amount < transaction.amount) {
                    walletBalance = parseFloat(dbWallet.balance) - difference
                }

                await walletModel.updateBalance(dbWallet._id, walletBalance)

            }

            return result

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    },

    delete: async function (userId, transactionId) {

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!transactionId || typeof transactionId !== "string" || transactionId.trim().length == 0) {
            throw new Error("Missing or invalid transaction ID")
        }

        try {
            const dbTransactions = await model.get({ _id: transactionId, userId })
            const dbTransaction = dbTransactions[0] || null
            if (!dbTransaction) throw new Error("No transaction found for that user")

            const dbWallets = await walletModel.get({ _id: dbTransaction.walletId, userId })
            const dbWallet = dbWallets[0] || null
            if (!dbWallet) throw new Error("No wallet found for that user")

            const dbCategories = await categoryModel.get({ _id: dbTransaction.categoryId })
            const dbCategory = dbCategories[0] || null
            if (!dbCategory || (dbCategory && dbCategory.userId && dbCategory.userId.toString() !== userId)) throw new Error("No category found for that user")

            let newBalance
            if (dbCategory.type == "addition") {
                newBalance = parseFloat(dbWallet.balance) - parseFloat(dbTransaction.amount)
            } else {
                newBalance = parseFloat(dbWallet.balance) + parseFloat(dbTransaction.amount)
            }

            const result = await model.logicDeletion({_id: dbTransaction._id, userId})
            await walletModel.updateBalance(dbWallet._id, newBalance)

            return result

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    }
}
