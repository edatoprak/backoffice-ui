import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { UserState } from '../../../shared/state/user.state';

import { AuthSignInComponent } from './sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { MockLocationStrategy } from '@angular/common/testing';
import { LocationStrategy } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import {UserService} from "../../../shared/services/user.service";

describe('AuthSignInComponent', () => {
    let component: AuthSignInComponent;
    let fixture: ComponentFixture<AuthSignInComponent>;
    let store: Store;
    let formBuilder: FormBuilder;
    let authService: AuthService;
    let userService: UserService;
    // let router: Router;
    // let activatedRoute: ActivatedRoute;

    beforeEach(async () => {
        const formBuilderStub = () => ({
            group: (object) => ({}),
            array: (array) => ({}),
        });
        const authServiceStub = () => ({ accessToken: {}, _authenticated: {} });
        const userServiceStub = () => ({
            user: {
                id: {},
                name: {},
                email: {},
                avatar: {},
                status: {},
            },
        });
        await TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                MatButtonModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatProgressSpinnerModule,
                FuseCardModule,
                FuseAlertModule,
                NgxsModule.forRoot([UserState]),
                BrowserAnimationsModule,
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [AuthSignInComponent],
            providers: [
                FormBuilder,
                { provide: AuthService, useFactory: authServiceStub },
                // { provide: Store, useFactory: storeStub },
                UserService,
                { provide: LocationStrategy, useClass: MockLocationStrategy },
                { privde: AuthService, useClass: authServiceStub },
            ],
        }).compileComponents();
        store = TestBed.inject(Store);
        authService = TestBed.inject(AuthService);
        userService = TestBed.inject(UserService);
        formBuilder = TestBed.inject(FormBuilder);
        fixture = TestBed.createComponent(AuthSignInComponent);
        component = fixture.componentInstance;
        Object.defineProperty(component, 'login$', { writable: true });
        component.login$ = of({
            access_token: '111',
            refresh_token: '2222',
        });
        component.signInForm = formBuilder.group({
            email: new FormControl(''),
            password: new FormControl(''),
            rememberMe: new FormControl(''),
        });
        fixture.detectChanges();
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            // const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
            // const storeStub: Store = fixture.debugElement.injector.get(Store);
            expect(
                component.store.selectSnapshot(UserState.getLogin)
            ).toBeTruthy();
        });
    });

    describe('signIn', () => {
        it('test', () => {
            component.signInForm.get('email').setValue('eda.toprak@etiya.com');
            component.signInForm.get('password').setValue('eda.toprak@etiya.com');
            spyOn(userService, 'login').and.callFake(function (value) {
                return of({
                    access_token: '111',
                    refresh_token: '2222',
                });
            })
            component.signIn();
            expect(component.showAlert).toEqual(false);
        });
        it('test2', () => {
            component.signInForm.get('email').setValue(null);
            component.signInForm.get('password').setValue(null);
            spyOn(userService, 'login').and.callFake(function (value) {
                return of({
                    access_token: '111',
                    refresh_token: '2222',
                });
            })
            component.signIn();
            expect(component.showAlert).toEqual(false);
        });
        it('test3', () => {
            component.signInForm.get('email').setValue('eda.toprak@etiya.com');
            component.signInForm.get('password').setValue('eda.toprak@etiya.com');
            spyOn(userService, 'login').and.throwError(new Error('Error'));

            component.signIn();
            expect(component.showAlert).toEqual(false);
        });
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('alert has default value', () => {
        expect(component.alert).toEqual({ type: 'success', message: '' });
    });

    it('showAlert has default value', () => {
        expect(component.showAlert).toEqual(false);
    });
});
