const mongoose = require('mongoose');
const User = require('./models/user/user');
require('dotenv').config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'name email phone role');
        console.log('Total users found:', users.length);
        console.table(users.map(u => ({
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            phone: u.phone,
            role: u.role
        })));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkUsers();
