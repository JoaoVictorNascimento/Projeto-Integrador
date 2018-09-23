const express = require('express')
const mongoose = require('mongoose');
const LessonCalendar = require('../models/lessons')

const router = express.Router();

mongoose.connect('mongodb://localhost:27017/JEED');
var db = mongoose.connection;


router.get('/all', (req, res) => {
  LessonCalendar.getAllLessons(function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/room/:room', (req, res) => {
  LessonCalendar.getLessonsAtRoom(req.params.room, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.post('/room/:room', (req, res) => {
  LessonCalendar.getLessonsAtRoomAtSchedule(req.params.room, req.body.schedule, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/room/type/:roomType', (req, res) => {
  LessonCalendar.getLessonsByRoomType(req.params.roomType, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.post('/room/type/:roomType', (req, res) => {
  LessonCalendar.getLessonsByRoomTypeAtSchedule(req.params.roomType, req.body.schedule, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.post('/freeRooms', (req, res) => {
  LessonCalendar.getFreeRoomsAtSchedule(req.body.schedule, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.post('/freeRooms/:roomType', (req, res) => {
  LessonCalendar.getFreeRoomsByTypeAtSchedule(req.params.roomType, req.body.schedule, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.post('/schedule', (req, res) => {
  LessonCalendar.getLessonsAtSchedule(req.body.schedule, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/responsable/:responsable', (req, res) => {
  LessonCalendar.getLessonsByResponsable(req.params.responsable, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/discipline/code/:cod/class/:classroom', (req, res) => {
  LessonCalendar.getLessonsByDisciplineCodAtClassCod(req.params.cod, req.params.classroom, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/discipline/name/:disciplineName/class/:classroom', (req, res) => {
  LessonCalendar.getLessonsByDisciplineNameAtClassCod(req.params.disciplineName, req.params.classroom, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/discipline/code/:cod', (req, res) => {
  LessonCalendar.getLessonsByDisciplineCod(req.params.cod, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/discipline/name/:disciplineName', (req, res) => {
  LessonCalendar.getLessonsByDisciplineName(req.params.disciplineName, function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.get('/:id', (req, res) => {
  LessonCalendar.getLessonById(req.params.id ,function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})
router.post('/post', (req, res) =>{
  let new_lesson = {}
  new_lesson.room = req.body.room;
  new_lesson.type_room = req.body.type_room;
  new_lesson.capacity = req.body.capacity;
  new_lesson.schedule = req.body.schedule;
  new_lesson.discipline_cod = req.body.discipline_cod;
  new_lesson.class_name = req.body.class_name;
  new_lesson.discipline_name = req.body.discipline_name;
  new_lesson.description = req.body.description;
  new_lesson.responsable = req.body.responsable;
  LessonCalendar.addLesson(new_lesson, function (err, evnt) {
    if (err) {
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    res.status(201).json(evnt)
  })
}
)
router.get('/:id', (req, res) => {
  LessonCalendar.getLessonById(req.params.id ,function (err, evnt){
    if(err){
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    else{
      res.status(200).send(evnt);
    }
  })
})

router.put('/:id', (req, res) => {
  let updatedLesson = {}
  updatedLesson.title = req.body.title
  updatedLesson.description = req.body.description
  updatedLesson.responsable = req.body.responsable
  updatedLesson.startDate = req.body.startDate
  updatedLesson.finalDate = req.body.finalDate
  updatedLesson.status = req.body.status
  updatedLesson.id = req.params.id
  LessonCalendar.updateLesson(updatedLesson, function (err, todo) {
    if (err) {
      console.log(err)
      return res.status(400).send('server could not understand the request')
    }
    res.status(200).json(todo)
  })
})

module.exports = {
  path : '/lesson',
  router: router
}
