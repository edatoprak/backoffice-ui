import {CreateUserModel, CreateUserStateModel, ListParams, login, UserUpdateStateModel} from "../models/user";


export class GetUsers {
    static readonly type = '[Users] get all users';
    static readonly desc = 'get all users';

    constructor(public params: ListParams) {
    }
}

export class Login {
    static readonly type = '[Login] Login';
    static readonly desc = 'Login';

    constructor(public params: login) {
    }
}
export class Logout {
    static readonly type = '[Logout] Logout';
}
export class CreateUser {
    static readonly type = '[AddUser] add user';
    static readonly desc = 'add user';

    constructor(public params: CreateUserModel) {
    }
}

export class UserUpdate {
    static readonly type = '[UserUpdate] update user';
    static readonly desc = 'update user';

    constructor(public UserUpdate: any, public userID: number) {
    }
}
