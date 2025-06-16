const { Schema, model } = require("mongoose")

class UserModel {

    constructor() {

        this.schema = new Schema({
            name: {
                type: String,
                required: true
            },
            surname: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: [/^\S+@\S+\.\S+$/, "The email format is not valid"]
            },
            password: {
                type: String,
                required: true
            },
            tokenVersion: {
                type: Number,
                default: 0
            },
            deleted: {
                type: Boolean,
                default: false
            }
        }, { versionKey: false })

        this.model = model("users", this.schema)

    }

    async create(user) {
        const result = await this.model.create(user)
        return result
    }

    async get(filters) {
        filters.deleted = false
        return await this.model.findOne(filters).lean()
    }

    async getById(userId) {
        const user = await this.model.findById(userId)
        return user && !user.deleted ? user : null
    }

    async update(user) {
        const result = await this.model.updateOne({ _id: user._id }, user)
        return result.matchedCount > 0 ? "User successfully updated" : "User was not updated"
    }

    async logicDeletion(userId) {
        const user = await this.model.findById(userId)

        if (user.deleted) return "User was already deleted"

        user.deleted = true
        const result = await this.model.updateOne({ _id: user._id }, user)
        return result.modifiedCount > 0 ? "User successfully deleted" : "User was not deleted"
    }

}


module.exports = new UserModel()

