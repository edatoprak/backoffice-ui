import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {UserListComponent} from './user-list.component';
import {UserState} from "../../../shared/state/user.state";
import {NgxsModule, Store} from "@ngxs/store";
import {UserService} from "../../../shared/services/user.service";
import {HttpClient, HttpHandler} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {MatSidenavModule} from "@angular/material/sidenav";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    let store: Store;
    let userService: UserService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserListComponent],
            imports: [NgxsModule.forRoot([UserState]), RouterTestingModule, BrowserAnimationsModule, MatSidenavModule, HttpClientTestingModule],
            providers: [UserService, HttpClient, HttpHandler]
        })
        store = TestBed.inject(Store);
        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        userService = TestBed.inject(UserService);

        Object.defineProperty(component, 'users$', {writable: true});
        component.users$ = of();
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`usersTableColumns has default value`, () => {
        expect(component.usersTableColumns).toEqual([
            `first_name`,
            `last_name`,
            `title`,
            `email`,
            `phone_number`,
            `address`
        ]);
    });

    it(`drawerMode has default value`, () => {
        expect(component.drawerMode).toEqual(`side`);
    });

    it(`isLoading has default value`, () => {
        expect(component.isLoading).toEqual(false);
    });

    describe('trackByFn', () => {
        it('makes expected calls', () => {
            expect(component.trackByFn(1, {id: 1})).toEqual(1);
        });
    });

    it('paging', () => {
        spyOn(userService, 'getAllUsers').and.callFake(function (value) {
            return of({
                "success": true,
                "id": null,
                "message": null,
                "data": {
                    "content": [
                        {
                            "user_id": 26,
                            "first_name": "Test",
                            "last_name": "XXXX",
                            "title": "Engineer",
                            "email": "xxx@gmail.com",
                            "phone_number": "05556566555",
                            "address": "Etiya",
                            "country_id": 1,
                            "city_id": 2,
                            "district_id": 17,
                            "roles": []
                        }]
                }
            });
        })
        component.paging({value: 0})
        const userList = store.selectSnapshot(UserState.getUserList);
        console.log("userList", userList);
        expect(userList.Users.length).toEqual(1);
    });

    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            component.ngOnInit();
        });
    })


});
