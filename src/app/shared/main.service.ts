import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {config} from "../core/config/app.config";
import {ProductGetAllRequest} from "./state/models/product";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class MainService {
    public selectedCustomer: any;
    public cartset: boolean=false
    public saveProductFilter:number=1;
    public productGetAllRequest: ProductGetAllRequest = {
        page: 0,
        size: 5,
        category_id: null,
        search_key: '',
        attribute_ids_collections: null,
        max_price: null,
        min_price: null
    };

    constructor() {

    }
}
