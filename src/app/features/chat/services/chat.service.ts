// chat.service.ts
import { Injectable, signal, effect, inject } from '@angular/core';
import { MessageModel } from '../models/MessageModel';
import { SignalrService } from '../../../core/services/signalr.service';
import { HubConnection } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private SignalrService = inject(SignalrService);
  private hubConnection!: HubConnection;

  public messages = signal<MessageModel[]>([]);
  public activeUsers = signal<any[]>([]);

  private updateMessages(message: MessageModel) {
    this.messages.update(messages => [...messages, message]);
  }

  private setMessages(message: MessageModel[]) {
    this.messages.set(message);
  }

  private listenEvents() {
    this.hubConnection.on("ReceiveMessage", (message: MessageModel) => {
      this.updateMessages(message);
    });

    this.hubConnection.on("StartChat", (allMessages: MessageModel[]) => {
      this.setMessages(allMessages)
    });

    this.hubConnection.on("JoinChat", (user: string) => {
      const joinedMessage = `${user} joined the chat`;
      this.updateMessages({
        userName: "Admin",
        content: joinedMessage
      });
    });

    this.hubConnection.on("ConnectedUser", (users: any) => {
      this.activeUsers.set(users);
    });

    this.hubConnection.on("DisconnectedUser", (user: string) => {
      const leftMessage = `${user} left the chat`;
      this.updateMessages({
        userName: "Admin",
        content: leftMessage
      });
    });

    this.hubConnection.on("ClearMessages", () => {
      this.setMessages([]);
    });
  }

  public async start(userName: string, roomName: string) {
    try {
      this.hubConnection = await this.SignalrService.getConnection('http://localhost:5137/Chat');
      this.listenEvents();
      await this.hubConnection.invoke("JoinSpecificChat", { username: userName, chatRoom: roomName });
    } catch (error) {
      console.error("Error during connection startup:", error);
      setTimeout(() => this.start(userName, roomName), 5000);
    }
  }

  public async sendMessage(message: string, user: string) {
    if (message.trim()) {
      this.updateMessages({ userName: user, content: message });
      await this.hubConnection.invoke("SendMessage", message);
    }
  }

  public disconnect() {
    try {
      this.SignalrService.removeReference();
    } catch (error) {
      console.error("Error during disconnection:", error);
    }
  }

  public async clearMessages() {
    this.setMessages([]);
    await this.hubConnection.invoke("ClearMessages");
  }

}
