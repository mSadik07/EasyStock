const mongoose = require('mongoose');
const User = mongoose.model('User');

// Gereksinim 1: Üye Kayıt
const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ status: "başarılı", user: { email: user.email } });
    } catch (err) {
        res.status(400).json({ status: "hata", message: err.message });
    }
};

// Gereksinim 2: Giriş Yapma
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ status: "başarılı", user: { email: user.email, id: user._id } });
        } else {
            res.status(401).json({ status: "hata", message: "Giriş başarısız" });
        }
    } catch (err) {
        res.status(500).json({ status: "hata", error: err.message });
    }
};

// Gereksinim 3: Profil Güncelleme (YENİ!)
const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params; // Güncellenecek kullanıcının ID'si URL'den gelir
        const updatedData = req.body; // Yeni bilgiler Body'den gelir

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        
        if (user) {
            res.status(200).json({ 
                status: "başarılı", 
                message: "Profil güncellendi!", 
                user: { firstName: user.firstName, businessName: user.businessName } 
            });
        } else {
            res.status(404).json({ status: "hata", message: "Kullanıcı bulunamadı" });
        }
    } catch (err) {
        res.status(400).json({ status: "hata", error: err.message });
    }
};

module.exports = { register, login, updateProfile };