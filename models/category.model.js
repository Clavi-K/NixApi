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

    async update(category) {
        const result = await this.model.updateOne({ _id: category._id, userId: category.userId }, category)
        return result.matchedCount > 0 ? "Category successfully updated" : "Category was not updated"
    }

    async logicDeletion(filters) {
        const category = await this.model.findOne(filters)

        if (category.deleted) return "Category was already deleted"

        category.deleted = true
        const result = await this.model.updateOne({ _id: category._id }, category)
        return result.modifiedCount > 0 ? "Category successfully deleted" : "Category was not deleted"
    }


    async existsById(categoryId) {
        const result = await this.model.exists({ _id: categoryId })
        return result == undefined ? false : true
    }

}

module.exports = new CategoryModel()

