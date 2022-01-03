import {ListParams, ProductGetAllRequest, ProductSaveRequest, ProductUpdateRequest} from '../models/product';


export class GetProducts {
    static readonly type = '[Products] get all products';
    static readonly desc = 'get all products';
    constructor(public productGetAllRequest: ProductGetAllRequest) {}
}
export class GetCategories {
    static readonly type = '[Categories] get all categories';
    static readonly desc = 'get all categories';
}
export class AddProduct {
    static readonly type = '[AddProduct] Add Product';
    static readonly desc = 'Add Product';
    constructor(public params: ProductSaveRequest) {}
}
export class UpdateProduct {
    static readonly type = '[UpdateProduct] Update Product';
    static readonly desc = 'Update Product';
    constructor(public params: ProductUpdateRequest) {}
}
export class GetProductByID {
    static readonly type = '[GetProductByID] Update GetProductByID';
    static readonly desc = 'GetProductByID ';
    constructor(public ProductID: Number) {}
}
export class AddProductImage {
    static readonly type = '[AddProduct] Add Product Image';
    static readonly desc = 'Add Product Image';
    constructor(public params: any) {}
}
export class GetAttributes {
    static readonly type = '[Attributes] get  Attributes';
    static readonly desc = 'get  Attributes';
    constructor(public Category: number) {}
}
export class Aem {
    static readonly type = '[Aem] get all categories';
    static readonly desc = 'get all categories';
}
