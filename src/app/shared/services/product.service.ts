import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ListParams, ProductGetAllRequest, ProductSaveRequest, ProductUpdateRequest} from "../state/models/product";

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) {
    }

    getAllProducts(productGetAllRequest: ProductGetAllRequest) {
         return this.http.post('http://159.69.28.194:8080/api/v1/products/getall',productGetAllRequest);
    }
    getAllCategories() {
        return this.http.get('http://159.69.28.194:8080/api/v1/categories/getall');
    }
    addProduct(data:ProductSaveRequest) {
        return this.http.post('http://159.69.28.194:8080/api/v1/products/add', data);
    }
    getAttributes(category) {
        return this.http.get('http://159.69.28.194:8080/api/v1/categories/'+category+'/getattributes');
    }
    addProductImage(data,prodid){
        const formData = new FormData();
        formData.append('file ', data);
        formData.append('productId',prodid);
        return this.http.post('http://159.69.28.194:8080/api/v1/products/Imageadd',formData);
    }
    updateProduct(data:ProductUpdateRequest) {
        return this.http.post('http://159.69.28.194:8080/api/v1/products/update', data);
    }

    getProductByID(productID:number) {
        return this.http.get('http://159.69.28.194:8080/api/v1/products/getbyid/'+productID);
    }
}
