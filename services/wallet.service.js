const model = require("../models/wallet.model")
const transactionService = require("./transaction.service")

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
            throw new Error(e)
        }

    },

    getByIds: async function (walletId, userId) {

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
            throw new Error(e)
        }
    },

    update: async function (userId, wallet) {

        if (!wallet._id || typeof wallet._id !== "string" || wallet._id.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.name || typeof wallet.name !== "string" || wallet.name.trim().length == 0) {
            throw new Error("Missing or invalid wallet name")
        }

        if (!wallet.currency || (wallet.currency != "ARS" && wallet.currency != "USD")) {
            throw new Error("Missing or invalid wallet currency")
        }

        if (wallet.balance === null || isNaN(Number(parseFloat(wallet.balance)))) {
            throw new Error("Missing or invalid wallet balance")
        }

        try {

            const dbWallets = await this.getByIds(wallet._id, userId)
            const dbWallet = dbWallets[0]

            if (parseFloat(wallet.balance) !== parseFloat(dbWallet.balance)) {
                let newTransaction = { note: "Balance adjustment" }

                if (wallet.balance > dbWallet.balance) {

                }

            }

            // return await model.update(wallet)
        } catch (e) {
            throw new Error(e)
        }

    }

}
