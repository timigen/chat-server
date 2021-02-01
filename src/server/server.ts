import WebSocket = require("ws");
import { v4 as uuidv4 } from "uuid";
import { Room, EventTypes, Client, IEvent, Event, IRoom } from "chat-models";
import { WebColors } from "../web-colors/web-colors";

export class Server {
  private clients: Client[] = [];
  private port: number;
  private room: IRoom;
  private server: any;
  private colors: WebColors;
  constructor(port: number = 1337) {
    this.port = port;
    this.colors = new WebColors();
  }

  public start() {
    this.log("_______ SERVER STARTED _______\n\n");
    this.server = new WebSocket.Server({ port: this.port });
    const roomName = "default";
    this.room = new Room(roomName);
    this.room.events = [];

    // new connection
    this.server.on("connection", connection => {
      // get then log connection id
      const connectionId = uuidv4();
      const color = this.colors.Get();
      this.log(`"connection accepted: ${connectionId} color: ${color}`);

      this.clients.push(new Client(connectionId, connection, color));

      this.log("SEND ROOM");
      connection.send(
        JSON.stringify({
          clientId: connectionId,
          room: this.room,
          type: EventTypes.Join
        })
      );

      connection.on("message", event => {
        let evnt = JSON.parse(event);
        evnt.color = color;
        this.room.events.push(evnt);

        console.log(evnt);

        for (let i = 0; i < this.clients.length; i++) {
          this.clients[i].connection.send(JSON.stringify(evnt));
        }
      });

      connection.on("close", () => {
        let index = this.clients.findIndex(x => x.id === connectionId);
        this.log(this.clients[0].id);
        if (index !== -1) {
          this.clients.splice(index, 1);
          this.log("Disconnected " + connectionId);
        }
      });
    });
  }

  private log(message: string) {
    console.log(new Date().toISOString() + " " + message);
  }
}
