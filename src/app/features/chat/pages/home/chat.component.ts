// chat.component.ts
import { Component, signal, computed, inject, linkedSignal, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatService = inject(ChatService);
  platformId = inject(PLATFORM_ID);
  ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  newMessage = signal('');
  currentUser = signal('');

  // chatRooms = signal(['General', 'Support', 'Off-Topic']);
  // selectedRoom = linkedSignal(() => this.chatRooms()[0]);
  selectedRoom = signal('');

  hasMessages = computed(() => this.chatService.messages().length > 0);

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userName = localStorage.getItem('username');
    if (!userName) {
      this.router.navigate(['']);
      return;
    }
    this.currentUser.set(userName);

    const curretnURL = this.ActivatedRoute.snapshot.url
    const roomName = curretnURL[curretnURL.length - 1].path;
    this.selectedRoom.set(roomName);

    await this.chatService.start(this.currentUser(), this.selectedRoom());
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.leaveRoom();
  }

  sendMessage(): void {
    const message = this.newMessage();
    if (message.trim()) {
      this.chatService.sendMessage(message, this.currentUser());
      this.newMessage.set('');
    }
  }

  clearChat(): void {
    this.chatService.clearMessages();
  }

  leaveRoom(): void {
    try {
      this.chatService.disconnect();
      this.router.navigate(['']);
    } catch (error) {
      console.error('Error during disconnection:', error);
    }
  }
}
