const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ status: "başarılı", user: { email: user.email } });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ status: "başarılı", message: `Hoş geldin ${user.firstName}` });
        } else {
            res.status(401).json({ status: "hata", message: "Giriş başarısız" });
        }
    } catch (err) {
        res.status(500).json({ status: "hata", error: err.message });
    }
};

module.exports = { register, login };