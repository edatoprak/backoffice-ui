import { ListParams, AddCustomer, CustomerDetail, UpdateCustomer} from '../models/customer';

export class GetCustomers {
    static readonly type = '[Customers] get all customers';
    static readonly desc = 'get all customers';
    constructor(public params: ListParams) {}
}

export class AemCustomer {
    static readonly type = '[Aem] get all customers';
    static readonly desc = 'get all customers';
}
export class SearchCustomer {
    static readonly type = '[Search] get Search customers';
    static readonly desc = 'get Search customers';
    constructor(public params: ListParams) {}
}

export class CreateCustomer {
    static readonly type = '[CreateCustomer] create customer';
    static readonly desc = 'create customer';
    constructor(public payload: AddCustomer) {}
}

export class GetCustomerDetail {
    static readonly type = '[CustomerDetail] get customers';
    static readonly desc = 'get customer detail';
    constructor(public payload: number) {}
}

export class UpdateCustomerDetail {
    static readonly type = '[UpdateCustomer] update customers';
    static readonly desc = 'update customer detail';
    constructor(public payload: UpdateCustomer) {}
}
