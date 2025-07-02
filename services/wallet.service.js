const model = require("../models/wallet.model")
const categoryModel = require("../models/category.model")
const transactionModel = require("../models/transaction.model")

module.exports = {

    create: async function (userId, wallet) {

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        wallet.userId = userId

        try {
            return await model.create(wallet)
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }

    },

    get: async function (userId, walletId) {
        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Mising or invalid user ID")
        }

        try {
            let result
            if (!walletId || typeof walletId !== "string" || walletId.trim().length == 0) {
                result = await model.get({ userId })
            } else {
                result = await model.get({ _id: walletId, userId })
            }

            return result.map(r => ({ ...r, balance: parseFloat(r.balance) }))
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    },

    update: async function (userId, wallet) {

        if (!wallet._id || typeof wallet._id !== "string" || wallet._id.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        if (wallet.balance !== null && isNaN(Number(parseFloat(wallet.balance)))) {
            throw new Error("Missing or invalid wallet balance")
        }

        let transactionResult
        wallet.userId = userId

        try {

            const dbWallets = await this.get(userId, wallet._id)
            const dbWallet = dbWallets[0]

            if (!dbWallet) throw new Error("No wallet found with that ID for that user")

            if (parseFloat(wallet.balance) !== parseFloat(dbWallet.balance)) {
                let newTransaction = { note: "Automatic adjustment" }
                let defaultCategories = await categoryModel.get({ name: { $in: ["Default Addition", "Default Substraction"] }, userId: null, walletId: null })
                let category

                if (wallet.balance > dbWallet.balance) {
                    category = defaultCategories.find(c => c.name == "Default Addition")
                    newTransaction.amount = wallet.balance - dbWallet.balance
                } else if (dbWallet.balance > wallet.balance) {
                    category = defaultCategories.find(c => c.name == "Default Substraction")
                    newTransaction.amount = dbWallet.balance - wallet.balance
                }

                newTransaction.userId = wallet.userId
                newTransaction.categoryId = category._id.toString()
                newTransaction.walletId = wallet._id

                transactionResult = await transactionModel.create(newTransaction)

            }

            let result
            if (transactionResult || parseFloat(wallet.balance) == parseFloat(dbWallet.balance)) result = await model.update(wallet)

            return { msg: result }

        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }

    },

    delete: async function (userId, walletId) {
        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!walletId || typeof walletId != "string" || walletId.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        try {
            const result = await model.logicDeletion({ _id: walletId, userId })
            return { msg: result }
        } catch (e) {
            console.error(e)
            throw new Error(e.message)
        }
    }

}
