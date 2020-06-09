import path from "path";
import http from "http";
import IO from "socket.io";
import Express from "express";

export default class App {
	private port: number = 3000;

	private io: IO.Server;
	private app: Express.Application;
	
	private db: Database;

	constructor() {
		this.app = Express();
		this.app.set('view engine', 'pug');

		this.app.get('/', (req, res) => res.render('index'));
		this.app.use('/public', Express.static(path.join(__dirname, "/../public")));

		const server = http.createServer(this.app);
		server.listen(this.port, () => console.log(`Listening on ${this.port}.`));
		this.io = IO(server);

		// io.on('connection', (socket: IO.Socket) => {
		// 	console.log('User connected.')

		// 	socket.on('disconnect', () => console.log('User disconnected.'));
		// });
	}
}
