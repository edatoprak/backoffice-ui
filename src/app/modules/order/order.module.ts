import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderListComponent} from './order-list/order-list.component';
import {Route, RouterModule} from "@angular/router";
import {OrderResolver} from "../../shared/resolvers/order.resolver";
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
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { OrderDetailComponent } from './order-detail/order-detail.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatMenuModule} from "@angular/material/menu";
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeTr);

const orderRoutes: Route[] = [
    {
        path: 'list',
        component: OrderListComponent,
        resolve: [OrderResolver],
    },
    {
        path: 'detail/:id',
        component: OrderDetailComponent
    },
    {
        path: '**',
        redirectTo: 'list'
    },
]

@NgModule({
    declarations: [
        OrderListComponent,
        OrderDetailComponent
    ],
    imports: [
        RouterModule.forChild(orderRoutes),
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
        MatDatepickerModule,
        MatMomentDateModule,
        MatAutocompleteModule,
        FormsModule,
        MatDividerModule,
        MatMenuModule
    ],
    providers: [{
        provide: LOCALE_ID,
        useValue:'tr-TR'
    }]
})
export class OrderModule {
}
