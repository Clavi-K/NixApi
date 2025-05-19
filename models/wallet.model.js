const { Schema, Types, model } = require("mongoose")

class WalletModel {

    constructor() {

        this.schema = new Schema({
            name: {
                type: String,
                required: true
            },
            balance: {
                type: Schema.Types.Decimal128,
                required: true,
                default: 0
            },
            currency: {
                type: String,
                required: true,
                enum: ["ARS", "USD"],
                default: "ARS"
            },
            userId: {
                type: Types.ObjectId,
                ref: "users",
                required: [true, "A user is required to create a wallet"]
            },
            deleted: {
                type: Boolean,
                default: false
            }
        }, { versionKey: false })

        this.model = model("wallets", this.schema)

    }

    async create(wallet) {
        const result = await this.model.create(wallet)
        return result
    }

    async existsById(walletId) {
        const result = await this.model.exists({ _id: walletId })
        return result == undefined ? false : true
    }

    async get(filters) {
        filters.deleted = false
        return await this.model.find(filters).lean()
    }

    async update(wallet) {
        const result = await this.model.updateOne({ _id: wallet._id }, wallet)
        return result.matchedCount > 0 ? "Wallet successfully updated" : "Wallet was not updated"
    }

    async logicDeletion(walletId) {
        const wallet = await this.model.findById(walletId)

        if (wallet.deleted) return "Wallet was already deleted"

        wallet.deleted = true
        const result = await this.model.updateOne({ _id: wallet._id }, wallet)
        return result.modifiedCount > 0 ? "Wallet successfully deleted" : "Wallet was not deleted"
    }

    async updateBalance(walletId, walletBalance) {
        await this.model.findOneAndUpdate({ _id: walletId }, { balance: walletBalance }, { new: true, runValidators: true })
        return "Wallet successfully updated"
    }

}

module.exports = new WalletModel()

