import { Routes } from '@angular/router';
import { ChatComponent } from './features/chat/pages/home/chat.component';
import { UserChatComponent } from './features/chat/pages/user-chat/user-chat.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'chat/:roomName',
        component: ChatComponent
    },
    {
        path: 'user-chat/:roomName',
        component: UserChatComponent
    }
];
