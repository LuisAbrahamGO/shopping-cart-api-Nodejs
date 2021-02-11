const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//Middlewares
app.use(cors())
app.use(bodyParser.json());

/*app.use('/posts', () => {
    console.log('Middleware running');
})*/

//Import Routes
const postsRoutes = require('./routes/posts');
app.use('/posts', postsRoutes);

app.use(express.static("uploads"));

//Routes
app.get('/', (req, res) => {
    res.send("Hello");
});


//Connext to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },  
    () => console.log('connected to db')
);


//How do we start listening the server
app.listen(5000);

//mongodb+srv://dbRestfullApi:<password>@cluster0.ou85g.mongodb.net/test
