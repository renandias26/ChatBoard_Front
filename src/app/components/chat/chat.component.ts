// chat.component.ts
import { Component, signal, computed, inject, linkedSignal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  platformId = inject(PLATFORM_ID);

  newMessage = signal('');
  currentUser = signal('You');

  chatRooms = signal(['General', 'Support', 'Off-Topic']);
  selectedRoom = linkedSignal(() => this.chatRooms()[0]);

  hasMessages = computed(() => this.chatService.messages().length > 0);

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)){
      return;
    }
    await this.chatService.start();
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
