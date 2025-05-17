/* ===== REQUIRED IMPORTS ===== */

const { Schema, model } = require("mongoose")

/* ========== */


/* ===== DATABASE MODEL ===== */

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
            }
        }, { versionKey: false })

        this.model = model("users", this.schema)

    }

    /* ===== MODEL METHODS ===== */

    async create(user) {
        const result = await this.model.create(user)
        return result
    }

    async getAll() {
        console.log("esta viniendo por aca?")
        return await this.model.find({}).lean()
    }

    async getByName(name) {
        return await this.model.find({ name: { $regex: name, $options: 'i' } })
    }

    async existsById(userId) {
        const result = await this.model.exists({ _id: userId })
        return result == undefined ? false : true
    }

    /* ========== */
}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new UserModel()

/* ========== */