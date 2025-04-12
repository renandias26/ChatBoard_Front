// chat.component.ts
import { Component, signal, computed, inject, linkedSignal, OnInit, PLATFORM_ID } from '@angular/core';
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
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  platformId = inject(PLATFORM_ID);
  ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  newMessage = signal('');
  currentUser = signal('');

  chatRooms = signal(['General', 'Support', 'Off-Topic']);
  selectedRoom = linkedSignal(() => this.chatRooms()[0]);

  hasMessages = computed(() => this.chatService.messages().length > 0);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    const userName = localStorage.getItem('username');
    if(!userName) { this.router.navigate(['']); return;}
    this.currentUser.set(userName);

    this.ActivatedRoute.url.subscribe(async (segments) => {
      const roomName = segments[segments.length - 1].path;
      await this.chatService.start(this.currentUser(), roomName);
    });
  }

  sendMessage(): void {
    const message = this.newMessage();
    if (message.trim()) {
      this.chatService.sendMessage(message, this.currentUser());
      this.newMessage.set('');
    }
  }

  clearChat(): void {
    this.chatService.messages.set([]);
  }


}
