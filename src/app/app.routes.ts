import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { UserChatComponent } from './pages/user-chat/user-chat.component';
import { HomeComponent } from './pages/home/home.component';

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
