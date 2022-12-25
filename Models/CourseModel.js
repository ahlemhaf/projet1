const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CourseSchemma = new Schema(
    {
        Name_of_Course: { type: String, required: true },
        content: { type: Buffer },
        contentName: String
    },
    {
        timestamps: true, versionKey: false
    },

);

module.exports = mongoose.model('course', CourseSchemma)