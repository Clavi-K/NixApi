/* ===== REQUIRED IMPORTS ===== */

const { Schema, model } = require("mongoose")

/* ========== */

/* ===== DATABASE MODEL ===== */

class WalletModel {

    constructor() {

        this.schema= new Schema({
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

    /* ========== */

}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new WalletModel()

/* ========== */
