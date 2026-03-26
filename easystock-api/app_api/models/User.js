const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    businessName: String,
    registrationDate: { type: Date, default: Date.now }
});

mongoose.model('User', userSchema);