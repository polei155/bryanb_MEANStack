import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component'
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard'


export const appRoutes: Routes = [
    {
        path: '', redirectTo: '/signup', pathMatch: 'full'
    },
    {
        path: 'userprofile', component: UserProfileComponent, canActivate:[AuthGuard]
    },
    {
        path: 'signup', component: UserComponent,
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'signin', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    }

];
