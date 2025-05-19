const model = require("../models/wallet.model")
const categoryModel = require("../models/category.model")
const transactionModel = require("../models/transaction.model")

module.exports = {

    create: async function (wallet) {

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        if (!wallet.userId || typeof wallet.userId !== "string" || wallet.userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        try {
            return await model.create(wallet)
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    get: async function (walletId, userId) {

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
            throw new Error(e)
        }
    },

    update: async function (wallet) {

        if (!wallet._id || typeof wallet._id !== "string" || wallet._id.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        if (!wallet.userId || typeof wallet.userId !== "string" || wallet.userId.trim().length == 0) {
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

        try {

            const dbWallets = await this.get(wallet._id, wallet.userId)
            const dbWallet = dbWallets[0]

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

                const result = await model.update(wallet)

                newTransaction.userId = wallet.userId
                newTransaction.categoryId = category._id.toString()
                newTransaction.walletId = wallet._id

                await transactionModel.create(newTransaction)

                return result

            }

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    delete: async function (walletId) {
        if (!walletId || typeof walletId != "string" || walletId.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        try {
            return await model.logicDeletion(walletId)
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

}
