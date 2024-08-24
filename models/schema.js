// models/schema.js

const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectMongoose = async () => {
    try {

        await mongoose.connect("mongodb://localhost:27017/minor_project", {
            
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
};

// Define schemas and models for Educator and Student
const educatorSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 'Educator' // Ensures role is always 'Educator'
    },
    password: {
        type: String,
        required: true
    }
});

const studentSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 'Student' // Ensures role is always 'Student'
    },
    password: {
        type: String,
        required: true
    }
});

// Models
const Educator = mongoose.model('Educator', educatorSchema);
const Student = mongoose.model('Student', studentSchema);

// Export the function and models
module.exports = { connectMongoose, Educator, Student };




