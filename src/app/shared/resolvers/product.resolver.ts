import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {FilterState, ProductState} from "../state/product.state";
import {Aem, GetCategories, GetProducts} from "../state/actions/product.action";
import {mapTo} from "rxjs/operators";
import {MainService} from "../main.service";

@Injectable()
export class ProductResolver implements Resolve<null> {
    constructor(private store: Store, private mainService: MainService) {
    }

    resolve(): Observable<null> {
        if (this.mainService.saveProductFilter == 0) {
            this.mainService.productGetAllRequest = {
                page: 0,
                size: 5,
                category_id: null,
                search_key: '',
                attribute_ids_collections: null,
                max_price: null,
                min_price: null
            };
        }
        const isCategoryCached = this.store.selectSnapshot(FilterState.getCategories);
        // ('Categories' in isCategoryCached)?new Aem():new GetCategories(),
        return this.store
            .dispatch([
                new GetCategories(),
                new GetProducts(this.mainService.productGetAllRequest),
            ])
            .pipe(mapTo(null));
    }
}

@Injectable()
export class ProductAddResolver implements Resolve<null> {
    constructor(private store: Store) {
    }

    resolve(): Observable<null> {
        const isCategoryCached = this.store.selectSnapshot(FilterState.getCategories);
        // ('Categories' in isCategoryCached)?new Aem():new GetCategories(),
        return this.store
            .dispatch([
                ('Categories' in isCategoryCached && isCategoryCached.Categories.length > 0) ? new Aem() : new GetCategories(),
            ])
            .pipe(mapTo(null));
    }
}
