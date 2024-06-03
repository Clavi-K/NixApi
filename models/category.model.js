/* ===== REQUIRED IMPORTS ===== */

const { Schema, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

class CategoryModel {

    constructor() {

        const schema = {
            name: {
                type: "String",
                required: true
            },
            icon: String,
            type: {
                type: String,
                enum: ["addition", "substraction"],
                required: true
            },
        }

        this.model = model("Category", schema)

    }

    /* ===== MODEL METHODS ===== */

    async create(category) {
        const result = await this.model.create(category)
        return result
    }

    async getAll() {
        return await this.model.find({}).lean()
    }

    async getById(categoryId) {
        return await this.model.findById(categoryId)
    }

    async existsById(categoryId) {
        const result = await this.model.exists({ _id: categoryId })
        return result == undefined ? false : true
    }

    /* ========== */

}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new CategoryModel()

/* ========== */