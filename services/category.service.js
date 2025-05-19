const model = require("../models/category.model")

module.exports = {

    create: async function (category) {
        //cuando revisemos este método, buscar el user de userId, pues la validación no puede ir por Mongoose
        if (!category.name || typeof category.name !== "string" || category.name.trim().length == 0) {
            throw new Error("Missing or invalid category name")
        }

        if (category.icon && (typeof category.icon !== "string" || category.icon.trim().length == 0)) {
            throw new Error("Invalid category icon")
        }

        if (!category.type || (category.type !== "substraction" && category.type !== "addition")) {
            throw new Error("Missing or invalid category type")
        }

        try {
            return await model.create(category)
        } catch (e) {
            throw new Error(e)
        }

    },

    getById: async function (categoryId) {

        if (!categoryId || typeof categoryId != "string" || categoryId.trim().length == 0) {
            throw new Error("Missing or invalid category ID")
        }

        try {
            return await model.getById(categoryId)
        } catch (e) {
            throw new Error(e)
        }
    },


    createDefaultCategories: async function () {
        try {
            const defaultCategories = await model.get({ note: { $in: ["Default Addition", "Default Substraction"] } })

            if (!defaultCategories.find(c => c.name == "Default Addition")) this.create({ name: "Default Addition", type: "addition" })
            if (!defaultCategories.find(c => c.name == "Default Substraction")) this.create({ name: "Default Substraction", type: "substraction" })

        } catch (e) {
            throw new Error(e)
        }
    }

}

