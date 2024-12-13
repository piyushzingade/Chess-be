import { WebSocketServer } from "ws";
import { GameManager } from "./GameMaanger";

const ws = new WebSocketServer({port :3000})

const gameManager  = new GameManager(); 
ws.on("connection" , (socket) =>{

    gameManager.adduser(socket);
    
    socket.on("disconnect" , () =>gameManager.removeUser(socket))
})