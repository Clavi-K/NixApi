const categoryService = require("./services/category.service")

module.exports = {
    checkDatabase: async function () {
        await categoryService.createDefaultCategories()
    },

    isValidDateString: function (str) {
        const date = new Date(str);
        return !isNaN(date.getTime());
    }
}