const categoryService = require("./services/category.service")

module.exports = {
    checkDatabase: async function () {
        await categoryService.createDefaultCategories()
    }
}