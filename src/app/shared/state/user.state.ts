import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {CreateUserStateModel, LoginStateModel, UserStateModel, UserUpdateStateModel} from "./models/user";
import {UserService} from "../services/user.service";
import {tap} from "rxjs/operators";
import {CreateUser, GetUsers, Login, Logout, UserUpdate} from "./actions/user.action";

@State<UserStateModel>({
    name: 'Users',
    defaults: {
        Users: [],
        Pagination: []
    },
})
@State<LoginStateModel>({
    name: 'Login',
    defaults: {
        access_token: null,
        refresh_token: null
    },
})

@State<CreateUserStateModel>({
    name: 'AddUser',
    defaults: {
        CreateUserMessage: ''
    }
})

@State<UserUpdateStateModel>({
    name: 'UserUpdate',
    defaults: {
        UserUpdate: {
            first_name: '',
            last_name: '',
            email:'',
            phone_number: '',
            address: '',
            city_id: 0,
            country_id: 0,
            district_id: 0,
            title: '',
            role_id_list: []
        }
    }
})

@Injectable()
export class UserState {
    constructor(private userService: UserService) {
    }

    @Selector()
    static getUserList(UserList: UserStateModel) {
        return UserList;
    }

    @Selector()
    static getLogin(state) {
        return state;
    }

    @Selector()
    static createUser(User){
        return User.AddUser;
    }

    @Selector()
    static updateUser(User){
        return User.UserUpdate;
    }

    @Action(GetUsers)
    getUsers({patchState}: StateContext<UserStateModel>, payload) {
        return this.userService.getAllUsers(payload.params).pipe(tap((response: any) => {
            patchState({Users: response.data.content, Pagination:response.data});
        }));
    }

    @Action(Login)
    login({patchState}: StateContext<LoginStateModel>, payload) {
        return this.userService.login(payload.params).pipe(tap((response: any) => {
            patchState({access_token: response.data.access_token, refresh_token: response.data.refresh_token});
        }));
    }
    @Action(Logout)
    logout({patchState}: StateContext<LoginStateModel>) {
        return    patchState({access_token: null, refresh_token: null});
    }

    @Action(CreateUser)
    addUser({patchState}: StateContext<CreateUserStateModel>, payload) {
        return this.userService.addUser(payload.params).pipe(tap((response: any) => {
            patchState({CreateUserMessage: response.message});
        }));
    }

    @Action(UserUpdate)
    getUserByID({patchState}: StateContext<UserUpdateStateModel>, payload) {
        return this.userService.getUserByID(payload).pipe(tap((response: any) => {
            patchState({UserUpdate: response.data});
        }));
    }
}
