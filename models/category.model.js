const { Schema, Types, model } = require("mongoose")

class CategoryModel {

    constructor() {

        this.schema = new Schema({
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
                ref: "users",
            },
            walletId: {
                type: Types.ObjectId,
                ref: "wallets",
            },
            deleted: {
                type: Boolean,
                default: false
            }
        }, { versionKey: false })

        this.model = model("categories", this.schema)

    }

    async create(category) {
        const result = await this.model.create(category)
        return result
    }

    async get(filters) {
        filters.deleted = false
        return await this.model.find(filters).lean()
    }

    async existsById(categoryId) {
        const result = await this.model.exists({ _id: categoryId })
        return result == undefined ? false : true
    }

}

module.exports = new CategoryModel()

