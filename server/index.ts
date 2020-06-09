import path from "path";
import http from "http";
import IO from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = IO(server);

const port = 3000;

app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index'));
app.use('/public', express.static(path.join(__dirname, "/../public")));

io.on('connection', (socket: IO.Socket) => {
	console.log('User connected.')

	socket.on('disconnect', () => console.log('User disconnected.'));
});

server.listen(port, () => console.log(`Listening on ${port}.`));

