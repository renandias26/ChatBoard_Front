// chat.service.ts
import { Injectable, signal, effect, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5273/chat')
    .configureLogging(signalR.LogLevel.Information)
    .build();

  public messages = signal<any[]>([]);
  public activeUsers = signal<any[]>([]);

  private updateMessages(message: string, user: string) {
    this.messages.update(messages => [...messages, { user, message }]);
  }

  private listenEvents(){
    this.hubConnection.on("ReceiveMessage", (user: string, message: string) => {
      this.updateMessages(message, user);
    });

    this.hubConnection.on("ConnectedUser", (users: any) => {
      this.activeUsers.set(users);
    });
  }

  public async start(userName: string, roomName: string) {
    try {
      await this.hubConnection.start();
      this.listenEvents();
      await this.hubConnection.invoke("JoinSpecificChat", {username: userName, chatRoom: roomName});
    } catch (error) {
      console.error("Error during connection startup:", error);
      setTimeout(() => this.start(userName, roomName), 5000);
    }
  }

  public async sendMessage(message: string, user: string) {
    if (message.trim()) {
        this.updateMessages(message, user);
        await this.hubConnection.invoke("SendMessage", message);
    }
  }
}
