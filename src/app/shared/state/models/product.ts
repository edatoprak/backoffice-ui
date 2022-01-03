import {GetAttributes} from "../actions/product.action";

export interface Products {
    product_id: number;
    category_id: number;
    category_name: string;
    product_name: string;
    description: string;
    short_description: string;
    barcode: string;
    units_in_stock: number;
    price: number;
}

export interface Categories {
    category_id: number;
    category_name: string;
}

export interface AttributesTerms {
    attribute_term_id: number;
    attribute_value: string
}

export interface Attributes {
    attribute_id: number;
    attribute_title: string;
    attribute_terms: AttributesTerms[]
}


export interface Pagination {
    length: number;
    size: number;
    page: number;
}

export interface ListParams {
    page: number;
    size: number;
    searchKey: string;
}

export class ProductStateModel {
    Products: Products[];
    Pagination: Pagination;
}

export class CategoriesStateModel {
    Categories: Categories[];
}

export class AttributesStateModel {
    Attributes: Attributes[];
}

export class AddProductStateModel {
    AddProductID: number;
}
export class UpdateProductStateModel {
    product_id: any;
}
export class GetProductByIDStateModel {
    barcode: string;
    category_id: number;
    category_name: string;
    description: string;
    is_active: boolean;
    product_id: number;
    product_attribute_term_dtos:any;
    product_image_dto_list: [
        {
            file_path: string;
            product_image_id: number;
            image: string;
            product_image_name: string;
            short_descrition: string
        }
    ];
    product_name: string;
    product_price_dto: [
        {
            actual_price: number;
            created_date: string;
            discounted_price: number;
            is_active: boolean
        }
    ];
    short_description: string;
    units_in_stock: number

}


export interface ProductSaveRequest {
    product_attribute_term_dtos:any;
    barcode: string;
    category_id: number;
    description: string;
    product_name: string;
    product_price_dtos: [
        {
            actual_price: number;
            discounted_price: number;
            created_date: string;
            is_active: boolean;
        }
    ];
    short_description: string;
    units_in_stock: number
}

export interface ProductGetAllRequest {
    attribute_ids_collections: [[number]];
    category_id: number;
    max_price: number;
    min_price: number;
    page: number;
    search_key: string;
    size: number;
}

export interface ProductUpdateRequest {
    "product_attribute_term_dtos": any;
    "product_price_dtos": any;
    "category_id": number;
    "product_id": number;
    "barcode": string;
    "description": string;
    "product_name": string;
    "short_description": string;
    "units_in_stock": number
}
