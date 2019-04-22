const express = require('express')
const app = express()
const port = 3005
var resRouter = require('./routes/rest')
var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://user:user@coj-4fdiq.mongodb.net/test?retryWrites=true");

app.use("/api/v1/", resRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

