const model = require("../models/category.model")
const userModel = require("../models/user.model")
const walletModel = require("../models/wallet.model")

module.exports = {

    create: async function (userId, category) {
        if (!category.name || typeof category.name !== "string" || category.name.trim().length == 0) {
            throw new Error("Missing or invalid category name")
        }

        if (category.icon && (typeof category.icon !== "string" || category.icon.trim().length == 0)) {
            throw new Error("Invalid category icon")
        }

        if (!category.type || (category.type !== "substraction" && category.type !== "addition")) {
            throw new Error("Missing or invalid category type")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!category.walletId || typeof category.walletId !== "string" || category.walletId.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        category.userId = userId

        try {

            const user = await userModel.get({ _id: category.userId })
            if (!user) throw new Error("The provided user ID does not match any created user")

            const dbWallets = await walletModel.get({ _id: category.walletId })
            const dbWallet = dbWallets[0] || null
            if (!dbWallet || dbWallet.userId.toString() != user._id.toString()) throw new Error("The provided wallet ID does not match any created wallet or does not belong to the provided user")

            return await model.create(category)
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    get: async function (userId, walletId, categoryId) {

        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!walletId || typeof walletId != "string" || walletId.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        if (categoryId && (typeof categoryId !== "string" || categoryId.trim().length == 0)) {
            throw new Error("Invalid category ID")
        }

        try {
            let filters = { userId, walletId }
            if (categoryId) filters.categoryId = categoryId

            return await model.get(filters)
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    },

    update: async function (userId, category) {

        if (!category._id || typeof category._id !== "string" || category._id.trim().length == 0) {
            throw new Error("Missing or invalid category ID")
        }

        if (!userId || typeof userId !== "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!category.walletId || typeof category.walletId !== "string" || category.walletId.trim().length == 0) {
            throw new Error("Missing or invalid wallet ID")
        }

        if (!category.name || typeof category.name !== "string" || category.name.trim().length == 0) {
            throw new Error("Missing or invalid category name")
        }

        if (!category.type || (category.type !== "substraction" && category.type !== "addition")) {
            throw new Error("Missing or invalid category type")
        }

        category.userId = userId

        try {
            const result = await model.update(category)
            return result
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

    },

    delete: async function (userId, categoryId) {
        
        if (!userId || typeof userId != "string" || userId.trim().length == 0) {
            throw new Error("Missing or invalid user ID")
        }

        if (!categoryId || typeof categoryId != "string" || categoryId.trim().length == 0) {
            throw new Error("Missing or invalid category ID")
        }

        try {
            return await model.logicDeletion({_id: categoryId, userId})
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    },

    createDefaultCategories: async function () {
        try {
            const defaultCategories = await model.get({ name: { $in: ["Default Addition", "Default Substraction"] } })

            if (!defaultCategories.find(c => c.name == "Default Addition")) model.create({ name: "Default Addition", type: "addition" })
            if (!defaultCategories.find(c => c.name == "Default Substraction")) model.create({ name: "Default Substraction", type: "substraction" })

        } catch (e) {
            console.error(e)
            throw new Error(e)
        }
    }

}

