import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListComponent} from './user-list/user-list.component';
import {Route, RouterModule} from "@angular/router";
import {UserResolver} from "../../shared/resolvers/user.resolver";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";
import { UserAddComponent } from './user-add/user-add.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import { MatChipsModule } from '@angular/material/chips';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { UserDetailComponent } from './user-detail/user-detail.component';

const userRoutes: Route[] = [
    {
        path: 'list',
        component: UserListComponent,
        resolve: [UserResolver],
    },
    {
        path: 'add',
        component: UserAddComponent
    },
    {
        path: 'detail/:id',
        component: UserDetailComponent
    },
    {
        path: '**',
        redirectTo: 'list'
    },
]

@NgModule({
    declarations: [
        UserListComponent,
        UserAddComponent,
        UserDetailComponent
    ],
    imports: [
        RouterModule.forChild(userRoutes),
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatSidenavModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatMomentDateModule,
        FormsModule,
        MatChipsModule,
        MatAutocompleteModule
    ],
    providers: [UserResolver]
})
export class UserModule {
}
