//jshint esversion:6

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { config } = require('dotenv');
const router = require('./router/route.js');
const app = express();
const connect = require('./database/conn.js')
const bodyParser = require("body-parser");
const Message = require('./models/messageModel.js');

config()

/** middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack

const port = process.env.PORT||5000;

/** api routes */
app.use('/api', router)

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get('/api/messages', async (req, res) => {
    const { email } = req.query;
    try {
        // Fetch messages from the database based on the provided email
        const messages = await Message.find({ email });
        console.log(messages)
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "An error occurred while  messages." });
    }
});

connect().then(() => {
    try {
        app.listen(port, () => {
            console.log(`Server connected to http://localhost:${port}`);
        })
    } catch (error) {
        console.log('Cannot connect to the server')
    }
}).catch(error => {
    console.log(error)
    console.log("Invalid database connection...!");
})
    