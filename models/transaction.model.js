/* ===== REQUIRED IMPORTS ===== */

const { Schema, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

class TransactionModel {

    constructor() {

        const schema = new Schema({
            type: {
                type: String,
                enum: ["addition", "substraction"],
                required: true
            },
            categoryId: {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: true
            },
            walletId: {
                type: Schema.Types.ObjectId,
                ref: "Wallet",
                required: true
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

        this.model = model("transactions", schema)

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

    async filteredGet(filters) {
        return await this.model.find(filters)
    }

    /* ========== */

}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new TransactionModel()

/* ========== */