
import fs from 'fs';
import mongoose from 'mongoose';
import Bootcamp from './models/Bootcamps.js';
import Course from './models/Courses.js';
import User from './models/Users.js'
import Review from './models/Reviews.js'
import colors from 'colors';
import url from 'url'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' });

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connect to the database
await mongoose.connect(process.env.MONGO_URI)
console.log(`MongoDB Connected.`.blue)

// Read the bootcamp data from the JSON file
const bootcamps = JSON.parse(fs.readFileSync(`${path.join(__dirname,'_data','bootcamps.json')}`, 'utf-8'));
const courses=JSON.parse(fs.readFileSync(`${path.join(__dirname,'_data','courses.json')}`,'utf-8'))
const users=JSON.parse(fs.readFileSync(`${path.join(__dirname,'_data','users.json')}`,'utf-8'))
const reviews=JSON.parse(fs.readFileSync(`${path.join(__dirname,'_data','reviews.json')}`,'utf-8'))

// Import the bootcamps to the database
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users)
        await Review.create(reviews)
        console.log('Data imported successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete all existing bootcamps from the database
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany()
        console.log('Data deleted successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Check the command line argument to decide whether to import or delete data
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}