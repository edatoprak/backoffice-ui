import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatSidenavModule} from "@angular/material/sidenav";
import {FuseMasonryModule} from "../../../@fuse/components/masonry";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {ProductAddResolver, ProductResolver} from "../../shared/resolvers/product.resolver";
import {MatPaginatorModule} from "@angular/material/paginator";
import {SharedModule} from "../../shared/shared.module";
import {FuseAlertModule} from "../../../@fuse/components/alert";
import {MatSelectModule} from "@angular/material/select";
import {FuseModule} from "../../../@fuse";
import { CartComponent } from './cart.component';
import {MatTableModule} from "@angular/material/table";

const Routes: Route[] = [
    {
        path: ':id',
        component: CartComponent
    },
    {
        path: '',
        component: CartComponent
    },
    {
        path: '**',
        redirectTo: ''
    },
];

@NgModule({
    declarations: [
    CartComponent
  ],
    imports: [
        RouterModule.forChild(Routes),
        SharedModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSidenavModule,
        FuseMasonryModule,
        MatPaginatorModule,
        FuseAlertModule,
        MatSelectModule,
        MatTableModule
    ]
})
export class CartModule {
}
