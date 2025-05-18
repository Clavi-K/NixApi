/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/category.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (category) => {

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

    getById: async (categoryId) => {

        if (!categoryId || typeof categoryId != "string" || categoryId.trim().length == 0) {
            throw new Error("Missing or invalid category ID")
        }

        try {
            return await model.getById(categoryId)
        } catch (e) {
            throw new Error(e)
        }
    },

}

/* ========== */
