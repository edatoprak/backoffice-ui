export interface Roles {
    role_id: number;
    role_name: string;
}

export interface ListParams {
    page: number;
    search: string;
    size: number;
}

export class RoleStateModel {
    Roles: Roles[];
}
