import { Component } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-user-chat',
  imports: [
    ChatComponent,
    SidebarComponent
  ],
  templateUrl: './user-chat.component.html',
  styleUrl: './user-chat.component.scss'
})
export class UserChatComponent {

}
