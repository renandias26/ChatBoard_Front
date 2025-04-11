import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { UserChatComponent } from './pages/user-chat/user-chat.component';

export const routes: Routes = [
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: 'user-chat',
        component: UserChatComponent
    }
];
