import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerComponent} from './customer.component';
import {Route, RouterModule} from '@angular/router';
import {ListComponent} from './list/list.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {CustomerResolver} from 'app/shared/resolvers/customer.resolver';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {CreateCustomerComponent} from './create-customer/create-customer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

const customerRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: ListComponent,
        resolve: [CustomerResolver],
    },
    {
        path: 'create-customer',
        component: CreateCustomerComponent
    },
    {
        path: 'customer-detail',
        component: CustomerDetailComponent
    },
];

@NgModule({
    declarations: [
        CustomerComponent,
        ListComponent,
        CreateCustomerComponent,
        CustomerDetailComponent
    ],
    imports: [
        RouterModule.forChild(customerRoutes),
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
        FormsModule
    ],
    providers: [CustomerResolver]
})
export class CustomerModule {
}
