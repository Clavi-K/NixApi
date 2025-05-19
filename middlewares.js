const jwt = require("jsonwebtoken")

const userService = require("./services/user.service")

module.exports = {
    auth: async (req, res, next) => {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];
        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.auth_secret, async (err, user) => {
            const dbUser = await userService.getById(user._id)
            if (err || dbUser.tokenVersion !==  user.tokenVersion) return res.sendStatus(403);

            req.user = user;
            return next();
        });
    }
}