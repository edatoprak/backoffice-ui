
export class CustomerCartStateModel {
    GetCustomerCart:GetCustomerCart;
}


export class GetCustomerCart {
    created_date: string;
    customer: Customer;
    order_details: OrderDetail[];
    order_id: number;
    status: string
}

export class CustomerContact {
    city_id: number;
    city_name: string;
    contact_description: string;
    contact_type: string;
    contact_value: string;
    country_id: number;
    country_name: string;
    customer_contact_id: number;
    customer_id: number;
    district_id: number;
    district_name: string
}
export class Customer{
    customer_contact_dto_list: CustomerContact[];
    customer_id: number;
    first_name: string;
    is_active: boolean;
    last_name: string;
    nation_number: string
}
export class OrderDetail{
    order_detail_id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_price: number;
    status: string
}

export class AddProductToCartStateModel{
    AddProductToCart:GetCustomerCart;
}
