import WebSocket = require("ws");
import { v4 as uuidv4 } from "uuid";
import { Room, EventTypes, Client, IEvent, Event, IRoom } from "chat-models";

export class Server {
  private clients: Client[] = [];
  private port: number;
  private room: IRoom;
  private server: any;

  constructor(port: number = 1337) {
    this.port = port;
  }

  public start() {
    this.log("_______ SERVER STARTED _______\n\n");
    this.server = new WebSocket.Server({ port: this.port });
    const roomName = "default";
    this.room = new Room(roomName);
    const createEvent: IEvent = new Event(EventTypes.Create, {
      author: "system",
      color: "system",
      text: roomName + " created"
    });

    this.room.events = [];
    this.room.events.push(createEvent);

    // new connection
    this.server.on("connection", connection => {
      // get then log connection id
      const connectionId = uuidv4();
      this.log("connection accepted: " + connectionId);

      this.clients.push(new Client(connectionId, connection));

      this.log("SEND ROOM");
      connection.send(
        JSON.stringify({ type: EventTypes.Join, room: this.room })
      );

      connection.on("message", event => {
        this.room.events.push(JSON.parse(event));

        for (let i = 0; i < this.clients.length; i++) {
          this.clients[i].connection.send(event);
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
