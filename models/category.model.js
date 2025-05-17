/* ===== REQUIRED IMPORTS ===== */

const { Schema, Types, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

class CategoryModel {

    constructor() {

        this.schema = {
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
            userId: {
                type: Types.ObjectId,
                ref:"users",
                required:[true, "A user is required to create a category"]
            },
            walletId: {
                type: Types.ObjectId,
                ref: "wallets",
            }
        }

        this.model = model("categories", this.schema)

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