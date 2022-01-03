import {Customers} from "./customer";

export interface Orders {
    order_id: number;
    status: string;
    created_date: string;
    customer: Customers;
}

export interface Pagination {
    total_pages: number;
    total_elements: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
    status: string;
}

export interface ListParams {
    page: number;
    size: number;
    status: string;
}


export class OrderStateModel {
    Orders: Orders[];
    Pagination: Pagination;
}

export class GetOrderByIDStateModel {
    OrderDetail : {
        order_id: number;
        status: string;
        created_date: string;
        customer: {
            customer_id: number;
            nation_number: string;
            first_name: string;
            last_name: string;
            is_active: true;
            customer_contact_dto_list: any;
        };
        order_details: [{
            order_detail_id: number;
            order_id: number;
            product_id: number;
            status: string;
            product_name: string;
            product_price: number;
        }];
    }

}
