const mongoose = require('mongoose');
const User = mongoose.model('User');

// Req 1: Kayıt
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        res.status(201).json({ status: "başarılı", user: { name: newUser.name, email: newUser.email } });
    } catch (err) { res.status(400).json({ status: "hata", message: "E-posta zaten kayıtlı!" }); }
};

// Req 2: Giriş
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) res.status(200).json({ status: "başarılı", user: { name: user.name, email: user.email } });
        else res.status(401).json({ status: "hata", message: "Hatalı giriş!" });
    } catch (err) { res.status(400).json({ status: "hata", message: err.message }); }
};

// Req 3: Profil Güncelleme (YENİ!)
const updateUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        const updateData = { name };
        if (password) updateData.password = password;
        const user = await User.findOneAndUpdate({ email: req.params.email }, updateData, { new: true });
        if (!user) return res.status(404).json({ status: "hata", message: "Kullanıcı bulunamadı." });
        res.status(200).json({ status: "başarılı", user: { name: user.name, email: user.email } });
    } catch (err) { res.status(400).json({ status: "hata", message: "Güncelleme başarısız!" }); }
};

module.exports = { register, login, updateUser };