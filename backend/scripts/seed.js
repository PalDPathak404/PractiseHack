const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedUser = async () => {
    try {
        await User.deleteMany({ email: 'admin@sentinel.gov' });

        const user = await User.create({
            name: 'Sentinel Admin',
            email: 'admin@sentinel.gov',
            password: 'password123',
            role: 'Admin'
        });

        console.log('--- Default User Created ---');
        console.log('Email: admin@sentinel.gov');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
};

seedUser();
