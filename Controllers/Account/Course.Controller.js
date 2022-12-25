const path = require('path');
const Course = require('../../Models/CourseModel')

exports.createCourse = async (req, res) => {
    try {
        if (req.file) {
            req.body.contentName = `http://localhost:4000/uploads/${req.file.filename}`
            console.log(req.body);
            await Course.create(req.body)
            res.status(201).send({ message: 'Course added successfully!' })
        } else {
            res.status(400).send({ message: 'Please Add video or pdf Files!' })
        }

    } catch (err) {
        res.status(500).send({ message: err.message || 'Error server' })
    }
}

exports.getCourse = async (req, res) => {
    const course = await Course.find()
    res.send(course);

}

exports.getCoursebyid = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id, { content: 0 })
        res.send(course)
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || 'Error server' })
    }
}

exports.updatecourse = async (req, res) => {
    try {
        await Course.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).send({ message: 'Course updated' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || 'Error server' })
    }
}

exports.deletecourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id)
        res.status(200).send({ message: 'Course deleted' })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message || 'Error server' })

    }
}