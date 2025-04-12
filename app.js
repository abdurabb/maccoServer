const express = require("express")
const app = express()
const http = require('http');
const connectDB = require("./connections/mongoConnection")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const bodyParser = require("body-parser");
const path = require("path")


const { green, yellow } = require("colors")
dotenv.config({ path: "/.env" })
app.use(bodyParser.json({ limit: "1000mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev") || morgan("combined"));
app.use(express.static('templates'));
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true, limit: '1000mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB()


app.use((err, req, res, next) => {
    console.error(err);
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const errorMessage = `Malformed JSON at position ${err.message.match(/position (\d+)/)[1]}`;
        return res.status(400).json({ message: errorMessage });
    }

    next();
});

app.use('/user',require('./routes/userRoute'))


const hostName = process.env.HOST_NAME || "localhost";
const port = process.env.PORT || 8554;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at ${hostName}:${port}`.magenta);
    console.log(`API Documentation available at ${hostName}:${port}/api-docs`.green);
});