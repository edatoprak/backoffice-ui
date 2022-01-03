import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ListParams, login} from "../state/models/user";
import {UserUpdate} from "../state/actions/user.action";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private _httpClient: HttpClient) {
    }

    getAllUsers(listparams: ListParams) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/users/getall', {
            params: {...listparams},
        });
    }
    login(params: login) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/auth/login', {
            email: params.email,
            password: params.password
        });
    }

    addUser(addCustomer) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/users/add', addCustomer);
    }

    getUserByID(payload) {
        return this._httpClient.post('http://159.69.28.194:8080/api/v1/users/'+ payload.userID, payload.UserUpdate);
    }


}
