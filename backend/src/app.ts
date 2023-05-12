import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import routes from "./routes";

export const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors : {
    origin : "*",
    credentials : false
  }
})
app.use(express.json());

app.use(routes)

io.on("connection",(socket)=> console.log(`someone connected: ${socket.id}`))


