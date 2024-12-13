import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    
    private games: Game[];
    private users : WebSocket[];
    private pendingUsers : WebSocket | null;
    constructor(){
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }

    adduser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket)
    }

    removeUser(socket : WebSocket){
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket : WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME){
                if(this.pendingUsers){
                    const game  = new Game(this.pendingUsers , socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                }
                else{
                    this.pendingUsers = socket;
                }
            }

            if(message.type === MOVE){
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    game.makeMove(socket , message.move);
                }
            }
        })
    }

}