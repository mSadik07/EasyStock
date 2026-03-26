const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ status: "başarılı", user: { email: user.email, id: user._id } });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Giriş denemesi: ${email}`); // Terminalden takip etmek için
        const user = await User.findOne({ email, password });
        
        if (user) {
            res.status(200).json({ status: "başarılı", user: { email: user.email, id: user._id, firstName: user.firstName } });
        } else {
            res.status(401).json({ status: "hata", message: "E-posta veya şifre yanlış!" });
        }
    } catch (err) {
        res.status(500).json({ status: "hata", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (user) {
            res.status(200).json({ status: "başarılı", message: "Profil güncellendi", user });
        } else {
            res.status(404).json({ status: "hata", message: "Kullanıcı bulunamadı" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

module.exports = { register, login, updateProfile };