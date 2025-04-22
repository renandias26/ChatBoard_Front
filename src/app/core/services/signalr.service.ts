import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection?: HubConnection;
  private referenceCount = 0;

  public async getConnection(hubUrl: string): Promise<HubConnection> {
    if (!this.hubConnection) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .configureLogging(LogLevel.None)
        .withAutomaticReconnect()
        .build();
    }

    if (this.hubConnection.state === HubConnectionState.Disconnected) {
      await this.hubConnection.start();
    }

    this.referenceCount++;
    return this.hubConnection;
  }

  public async removeReference(): Promise<void> {
    this.referenceCount--;
    await this.disconnectIfNoReferences();
  }

  private async disconnectIfNoReferences(): Promise<void> {
    if (this.referenceCount > 0) {
      return;
    }

    if (this.hubConnection
      && this.hubConnection.state !== HubConnectionState.Disconnected
    ) {
      await this.hubConnection.stop();
      this.hubConnection = undefined;
      this.referenceCount = 0;
    }
  }
}
