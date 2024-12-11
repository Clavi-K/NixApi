/* ===== REQUIRED IMPORTS ===== */

const model = require("../models/tenant.model")

/* ========== */

/* ===== SERVICE EXPORT ===== */

module.exports = {

    create: async (tenant) => {

        if (!tenant.name || typeof tenant.name != "string" || tenant.name.trim().length == 0) {
            throw new Error("Missing or invalid tenant name")
        }

        if (!tenant.apartment || typeof tenant.apartment != "string" || tenant.apartment.trim().length == 0) {
            throw new Error("Missing or invalid tenant apartment")
        }

        try {
            return await model.create(tenant)
        } catch (e) {
            throw new Error(e)
        }

    },

    returnModel: () => {
        return model.returnModel()
    },

    filteredGet: async (filters) => {

        // if(filters.name && typeof filters.name === "string")

    },

    getProps: async () => {
        return model.getProps()
    }

}

/* ========== */