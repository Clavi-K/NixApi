/* ===== REQUIRED IMPORTS ===== */

const { Schema, Types, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

class TransactionModel {

    constructor() {

        this.schema = new Schema({
            categoryId: {
                type: Types.ObjectId,
                ref: "categories",
                required: [true, "A category is required to create a transaction"]
            },
            walletId: {
                type: Types.ObjectId,
                ref: "wallets",
                required: [true, "A wallet is required to create a transaction"]
            },
            userId: {
                type: Types.ObjectId,
                ref: "users",
                required: [true, "A user is required to create a transaction"]
            },
            dateTime: {
                type: Date,
                default: Date.now
            },
            amount: {
                type: Schema.Types.Decimal128,
                required: true
            },
            note: {
                type: String,
                required: true
            }
        }, { versionKey: false })

        this.model = model("transactions", this.schema)

    }

    /* ===== MODEL METHODS ===== */

    async create(transaction) {
        const result = await this.model.create(transaction)
        return result
    }

    async getAll() {
        return await this.model.find({}).lean()
    }

    async getBetweenDates(fromDate, toDate) {
        return await this.model.find({
            dateTime: {
                $gte: fromDate,
                $lte: toDate
            }
        })
    }

    async get(filters) {
        return await this.model.find(filters)
    }

    /* ========== */

}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new TransactionModel()

/* ========== */