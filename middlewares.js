const jwt = require("jsonwebtoken")

const userService = require("./services/user.service")

module.exports = {
    auth: async (req, res, next) => {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];
        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.auth_secret, async (err, user) => {

            if (!user) return res.sendStatus(403);

            const tokenUser = user._doc != undefined ? user._doc : user
            const dbUser = await userService.getById(tokenUser._id)

            if (err || !dbUser || dbUser.tokenVersion !== tokenUser.tokenVersion) {
                console.log("Forbidden")
                return res.sendStatus(403);
            }

            req.user = tokenUser
            return next();
        });
    }
}