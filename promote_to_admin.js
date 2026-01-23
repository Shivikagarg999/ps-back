const mongoose = require('mongoose');
const User = require('./models/user/user');
require('dotenv').config();

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address as an argument.');
    process.exit(1);
}

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`User with email ${email} not found.`);
        } else {
            user.role = 'admin';
            await user.save();
            console.log(`Successfully promoted user ${user.name} (${user.email}) to admin.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

promoteUser();
