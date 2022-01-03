import {ListParams} from "../models/role";

export class GetTest {
    static readonly type = '[test] get all test';
    static readonly desc = 'get all test';
}
export class GetCountries {
    static readonly type = '[Countries] get all countries';
    static readonly desc = 'get all countries';
}


export class GetCities {
    static  readonly type = '[Cities] get all cities';
    static  readonly desc = 'get all cities';
    constructor(public payload: number) {}
}

export class GetDistricts {
    static  readonly type = '[Districts] get all districts';
    static  readonly desc = 'get all districts';
    constructor(public payload: number) {}
}

export class GetRoles {
    static  readonly type = '[Roles] get all roles';
    static  readonly desc = 'get all roles';
    constructor(public payload: ListParams) {}
}


