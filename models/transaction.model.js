const { Schema, Types, model } = require("mongoose")

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
            },
            deleted: {
                type: Boolean,
                default: false
            }
        }, { versionKey: false })

        this.model = model("transactions", this.schema)

    }

    async create(transaction) {
        const result = await this.model.create(transaction)
        return result
    }

    async get(filters) {
        filters.deleted = false
        return await this.model.find(filters).lean()
    }

    async getAll() {
        return await this.model.find({}).lean()
    }

    async update(transaction) {
        const result = await this.model.updateOne({ _id: transaction._id }, transaction)
        return result.matchedCount > 0 ? "Transaction successfully updated" : "Transaction was not updated"
    }

    async logicDeletion(filters) {
        const transaction = await this.model.findOne(filters)

        if (transaction.deleted) return "Transaction was already deleted"

        transaction.deleted = true
        const result = await this.model.updateOne({ _id: transaction._id }, transaction)
        return result.modifiedCount > 0 ? "Transaction successfully deleted" : "Transaction was not deleted"
    }

    async getBetweenDates(fromDate, toDate) {
        return await this.model.find({
            dateTime: {
                $gte: fromDate,
                $lte: toDate
            }
        })
    }

}

module.exports = new TransactionModel()

