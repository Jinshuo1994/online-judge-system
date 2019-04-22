const express = require('express')
const app = express()
const port = 3003
var resRouter = require('./routes/rest')
var indexRouter = require('./routes/index')
var mongoose = require('mongoose');
var path = require("path")

mongoose.connect("mongodb+srv://user:user@coj-4fdiq.mongodb.net/test?retryWrites=true");

app.use(express.static(path.join(__dirname, '../public')));
app.use("/", indexRouter);
app.use("/api/v1/", resRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

