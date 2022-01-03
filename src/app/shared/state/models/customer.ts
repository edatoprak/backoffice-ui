
export interface Customers
{
    customer_id: number;
    nation_number: number;
    first_name: string;
    last_name: string;
}

export interface Pagination
{
    total_pages: number;
    total_elements: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface ListParams {
    page: number;
    size: number;
    sort: string;
    order: string;
    searchKey: string;
}

export interface AddCustomer {
    customer_contact_list: any;
    first_name: string;
    last_name: string;
    nation_number: string;
}

export interface CustomerDetail{
    customer_id: number;
    nation_number: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    customer_contact_dto_list: any;
}

export interface UpdateCustomer{
    customer_contact_update_dto_list: any;
}

export class CustomerStateModel {
    Customers: Customers[];
    Pagination: Pagination;
}

export class CustomerSearchStateModel {
    CustomersSearch: Customers[];
}

export class CustomerDetailStateModel {
    CustomerDetail: CustomerDetail;
}

export class UpdateCustomerStateModel {
    UpdateCustomer: UpdateCustomer;
}



