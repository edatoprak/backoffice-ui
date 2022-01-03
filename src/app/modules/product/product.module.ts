import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {ProductListComponent} from './product-list/product-list.component';
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
import {ProductAddComponent} from "./product-add/product-add.component";
import {FuseAlertModule} from "../../../@fuse/components/alert";
import {ProductDetComponent} from './product-det/product-det.component';
import {MatSelectModule} from "@angular/material/select";
import {FuseModule} from "../../../@fuse";
import {MatBadgeModule} from "@angular/material/badge";

const Routes: Route[] = [
    {
        path: 'list',
        component: ProductListComponent,
        resolve: [ProductResolver]
    },
    {
        path: 'add',
        component: ProductAddComponent,
        resolve: [ProductAddResolver]
    },
    {
        path: 'det/:id',
        component: ProductDetComponent,
        resolve: [ProductAddResolver]
    },
    {
        path: '**',
        redirectTo: 'list'
    },
];

@NgModule({
    declarations: [
        ProductListComponent,
        ProductAddComponent,
        ProductDetComponent
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
        MatBadgeModule
    ], providers: [ProductResolver,ProductAddResolver]
})
export class ProductModule {
}
