import {Injectable} from "@angular/core";
import {Action, Selector, State, StateContext} from "@ngxs/store";
import {tap} from "rxjs/operators";
import {ProductService} from "../services/product.service";
import {AddProduct, AddProductImage, GetAttributes, GetCategories, GetProductByID, GetProducts, UpdateProduct} from "./actions/product.action";
import {
    Products,
    Categories,
    ProductStateModel,
    CategoriesStateModel,
    AddProductStateModel, AttributesStateModel, UpdateProductStateModel, GetProductByIDStateModel
} from "./models/product";


@State<ProductStateModel>({
    name: 'Products',
    defaults: {
        Products: [],
        Pagination: {
            length:0,
            page:0,
            size:0
        }
    }
})
@State<GetProductByIDStateModel>({
    name: 'GetProductByID',
    defaults: {
        barcode: '',
        category_id: 0,
        category_name: '',
        description: '',
        is_active: true,
        product_id: 0,
        product_attribute_term_dtos: [],
        product_image_dto_list: [
            {
                file_path: '',
                product_image_id: 0,
                product_image_name: '',
                image: '',
                short_descrition: ''
            }
        ],
        product_name: '',
        product_price_dto: [
            {
                actual_price: 0,
                created_date: '',
                discounted_price: 0,
                is_active: true
            }
        ],
        short_description: '',
        units_in_stock: 0
    }
})
@State<AddProductStateModel>({
    name: 'AddProduct',
    defaults: {
        AddProductID: 0
    }
})
@State<UpdateProductStateModel>({
    name: 'UpdateProduct',
    defaults: {
        product_id: 0
    }
})

@Injectable()
export class ProductState {

    constructor(private productService: ProductService) {
    }

    @Selector()
    static getProductList(ProductList) {
        return ProductList;
    }

    @Selector()
    static getProductByID(Product) {
        return Product.GetProductByID;
    }

    @Selector()
    static addProduct(Product) {
        return Product;
    }

    @Action(GetProducts)
    getProduct({patchState}: StateContext<ProductStateModel>, payload) {
        return this.productService.getAllProducts(payload.productGetAllRequest).pipe(tap((response: any) => {
            patchState({
                Pagination: {
                    length: response.data.total_elements,
                    size: response.data.size,
                    page: response.data.page
                },
                Products: response.data.content
            });
        }));
    }

    @Action(AddProduct)
    addProduct({patchState}: StateContext<any>, payload) {
        return this.productService.addProduct(payload.params).pipe(tap((response: any) => {
            patchState({AddProductID: response})
        }));
    }

    @Action(UpdateProduct)
    updateProduct({patchState}: StateContext<any>, payload) {
        return this.productService.updateProduct(payload.params).pipe(tap((response: any) => {
            patchState({product_id: response})
        }));
    }

    @Action(GetProductByID)
    getProductByID({patchState}: StateContext<any>, payload) {
        return this.productService.getProductByID(payload.ProductID).pipe(tap((response: any) => {
            patchState({GetProductByID: response.data})
        }));
    }

    @Action(AddProductImage)
    addProductImage({patchState}: StateContext<any>, payload) {
        return this.productService.addProductImage(payload.params.file, payload.params.prodid).pipe(tap((response: any) => {
            patchState({})
        }));
    }
}

@State<CategoriesStateModel>({
    name: 'Categories',
    defaults: {
        Categories: []
    }
})
@State<AttributesStateModel>({
    name: 'Attributes',
    defaults: {
        Attributes: []
    }
})
@Injectable()
export class FilterState {

    constructor(private productService: ProductService) {
    }

    @Selector()
    static getCategories(state: CategoriesStateModel) {
        return state;
    }

    @Selector()
    static getAttributes(state: AttributesStateModel) {
        return state;
    }

    @Action(GetCategories)
    getCategories({patchState}: StateContext<any>) {
        return this.productService.getAllCategories().pipe(tap((response: any) => {
            patchState({Categories: response.data});
        }));
    }

    @Action(GetAttributes)
    getAttributes({patchState}: StateContext<any>, payload) {
        return this.productService.getAttributes(payload.Category).pipe(tap((response: any) => {
            patchState({Attributes: response.data});
        }));
    }
}
