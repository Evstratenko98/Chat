const User = require("../models/User.js");

class authController {
   async login(req, res) {
      try {
         const { username, password } = req.body;
         const user = await User.findOne({ username });

         if (!user) return res.json({ message: "Пользователя не существует" });
         if (user.password !== password)
            return res.json({ message: "Пароли не совпадают" });

         res.cookie(`userId`, `${user._id}`, {
            maxAge: 60 * 60 * 1000, //1 hour
         });
         res.json(user);
      } catch (e) {
         console.log(e);
         res.status(200).json("Произошла ошибка");
      }
   }

   async registration(req, res) {
      try {
         const { username, password, age, gender } = req.body;
         const user = new User({
            username,
            password,
            age,
            gender,
         });
         await user.save();

         res.cookie(`userId`, `${user._id}`, {
            maxAge: 60 * 60 * 1000, //1 hour
         });
         res.json(user);
      } catch (e) {
         console.log(e);
         res.status(200).json("Произошла ошибка");
      }
   }
}

module.exports = new authController();
