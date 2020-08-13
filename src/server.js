const express = require('express');
const server = express();//creates an instance of the server

const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./pages');

const nunjucks = require('nunjucks');//template engine for html injection
nunjucks.configure('src/views', {
  express: server,
  noCache: true
});//tells nunjucks were the html files are and set some express configurations

server
.use(express.urlencoded({ extended: true }))
.use(express.static("public"))
.get('/', pageLanding)
.get('/index', pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)

.listen(5500);//set the server port
