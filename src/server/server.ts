import WebSocket = require("ws");
import { v4 as uuidv4 } from "uuid";
import { Room, EventTypes, Client, IEvent, Event, IRoom } from "chat-models";

export class Server {
  private clients: Client[] = [];
  private port;
  private room: IRoom;
  private server: any;

  constructor(port: number = 1337) {
    this.port = port;
  }

  public start() {
    this.log("_______ SERVER STARTED _______");
    this.server = new WebSocket.Server({ port: this.port });
    const roomName = "the shack";
    this.room = new Room(roomName);
    const createEvent: IEvent = new Event(EventTypes.Create, {
      author: "system",
      color: "system",
      text: roomName + " created"
    });

    this.room.events = [];
    this.room.events.push(createEvent);

    this.server.on("connection", connection => {
      /* */

      const connectionId = uuidv4();
      this.log("connection accepted: " + connectionId);

      this.clients.push(new Client(null, connection));

      this.log("SEND ROOM " + this.room);
      connection.send(
        JSON.stringify({ type: EventTypes.Join, room: this.room })
      );

      connection.on("message", event => {
        this.log("event -> " + event);
        let current = event;
        this.room.events.push(current);
        this.room.events = this.room.events.slice(-100);
        for (let i = 0; i < this.clients.length; i++) {
          this.clients[i].connection.send(current);
        }
      });

      connection.on("close", () => {
        this.log("Disconnected " + connectionId);
      });
    });
  }

  private log(message: string) {
    console.log(new Date().toISOString() + " " + message);
  }
}
