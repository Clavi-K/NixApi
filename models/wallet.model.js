/* ===== REQUIRED IMPORTS ===== */

const { Schema, Types, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

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
            }
        }, { versionKey: false })

        this.model = model("wallets", this.schema)

    }

    /* ===== MODEL METHODS ===== */

    async create(wallet) {
        const result = await this.model.create(wallet)
        return result
    }

    async existsById(walletId) {
        const result = await this.model.exists({ _id: walletId })
        return result == undefined ? false : true
    }

    async getById(walletId) {
        return await this.model.findById(walletId)
    }

    async update(wallet) {
        const result = await this.model.updateOne({ _id: wallet._id }, wallet)
        return result.matchedCount > 0 ? "Wallet successfully updated" : "Wallet was not updated"
    }

    /* ========== */

}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new WalletModel()

/* ========== */
