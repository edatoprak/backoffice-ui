import { NgModule ,LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import {FilterState, ProductState} from './shared/state/product.state';
import { CustomerState } from './shared/state/customer.state';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import {CommonState} from "./shared/state/common.state";
import {OrderState} from "./shared/state/order.state";
import { ToastrModule } from 'ngx-toastr';
import { UserComponent } from './modules/user/user.component';
import { UserState } from './shared/state/user.state';
import {SharedModule} from "./shared/shared.module";
import {CartState} from "./shared/state/cart.state";

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        UserComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        NgxsModule.forRoot([
            ProductState,
            FilterState,
            CustomerState,
            CommonState,
            OrderState,
            UserState,
            CartState
        ]),
        HttpClientModule,
        NgxsRouterPluginModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right',
        }),
        SharedModule,
    ],
    bootstrap   : [
        AppComponent
    ],providers:[{
        provide: LOCALE_ID,
        useValue: 'tr_TR'
    }]
})
export class AppModule
{
}
