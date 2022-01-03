export interface Users {
    user_id: number;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    phone_number: string;
    address: string;
    country_id: number;
    city_id: number;
    district_id: number;
    roles: any;
}

export interface ListParams {
    pageNumber: number;
    pageSize: number;
}


export interface login {
    email: string;
    password: string;
}

export interface Pagination
{
    total_pages: number;
    total_elements: number;
    size: number;
    page: number;
    last: number;
}

export class UserStateModel {
    Users: Users[];
    Pagination: Pagination[];
}

export class LoginStateModel {
    access_token: string;
    refresh_token: string;
}

export class CreateUserModel {
    first_name: string;
    last_name: string;
    email:string;
    password: string;
    phone_number: string;
    address: string;
    city_id: number;
    country_id: number;
    district_id: number;
    title: string;
    role_id_list: any;
}

export class CreateUserStateModel {
    CreateUserMessage: string;


}


export class UserUpdateStateModel {
    UserUpdate: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        country_id: number;
        city_id: number;
        district_id: number;
        address: string;
        title: string;
        role_id_list: any;
    }
}
