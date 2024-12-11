/* ===== REQUIRED IMPORTS ===== */

const { Schema, model } = require("mongoose")

/* ========== */


/* ===== DATABASE MODEL ===== */

class TenantModel {

    constructor() {

        this.schema = new Schema({
            name: {
                type: String,
                required: true
            },
            apartment: {
                type: String,
                required: true
            },
            balance: {
                type: Schema.Types.Decimal128,
                default: 0.00,
                required: false
            }
        }, { versionKey: false })

        this.model = model("tenants", this.schema)

    }

    /* ===== MODEL METHODS ===== */

    async create(tenant) {
        const result = await this.model.create(tenant)
        return result
    }

    async getAll() {
        return await this.model.find({}).lean()
    }

    async getByName(name) {
        return await this.model.find({ name: { $regex: name, $options: 'i' } })
    }

    async existsById(tenantId) {
        const result = await this.model.exists({ _id: tenantId })
        return result == undefined ? false : true
    }

    async getProps() {
        const props = []

        for (const prop in this.schema.paths) {
            props.push({
                propName: this.schema.paths[prop].path,
                type: this.schema.paths[prop].instance,
                required: this.schema.paths[prop].path !== "_id" ? this.schema.paths[prop].isRequired : true
            })
        }

        return props
    }

    /* ========== */
}

/* ========== */

/* ===== MODEL EXPORT ===== */

module.exports = new TenantModel()

/* ========== */