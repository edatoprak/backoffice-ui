import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FuseMediaWatcherService} from "../../../../@fuse/services/media-watcher";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {pairwise, skip, startWith, takeUntil} from "rxjs/operators";
import {Select, Store} from "@ngxs/store";
import {FilterState, ProductState} from "../../../shared/state/product.state";
import {AttributesStateModel, Categories, CategoriesStateModel, ProductStateModel} from "../../../shared/state/models/product";
import {GetAttributes, GetCategories, GetProducts} from "../../../shared/state/actions/product.action";
import {MatPaginator} from "@angular/material/paginator";
import {MainService} from "../../../shared/main.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {CartState} from "../../../shared/state/cart.state";
import {CustomerCartStateModel} from "../../../shared/state/models/cart";
import {AddProductToCart} from "../../../shared/state/actions/cart.action";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

    @Select(ProductState.getProductList) products$: Observable<ProductStateModel>;
    @Select(CartState.getCustomerCart) carts$: Observable<any>;
    @Select(CartState.addProductToCart) addcart$: Observable<any>;
    @Select(FilterState.getCategories) categories$: Observable<CategoriesStateModel>;
    @Select(FilterState.getAttributes) attributes$: Observable<AttributesStateModel>;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;

    selectedCategory: Categories;
    pagination: any;
    cartcount: number=0;
    filterform: FormGroup;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    filter$: BehaviorSubject<any> = new BehaviorSubject({param: '', val: ''});
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    masonryColumns: number = 4;
    attributes = [];
    allcolors = [
        {id: 1, colorcode: 'bg-white', colorname: 'Beyaz'},
        {id: 2, colorcode: 'bg-blue-500', colorname: 'Mavi'},
        {id: 3, colorcode: 'bg-green-500', colorname: 'Yeşil'},
        {id: 4, colorcode: 'bg-yellow-500', colorname: 'Sarı'},
        {id: 5, colorcode: 'bg-red-500', colorname: 'Kırmızı'},
        {id: 6, colorcode: 'bg-pink-500', colorname: 'Pembe'},
        {id: 7, colorcode: 'bg-gray-500', colorname: 'Gri'},
        {id: 8, colorcode: 'bg-black', colorname: 'Siyah'}
    ];

    constructor(
        public _changeDetectorRef: ChangeDetectorRef,
        public toastr: ToastrService,
        public _fuseMediaWatcherService: FuseMediaWatcherService,
        public mainService: MainService,
        public _formBuilder: FormBuilder,
        public store: Store,
        public router: Router) {
    }

    ngOnInit(): void {
        this.filterform = this._formBuilder.group({
            minPrice: [''],
            maxPrice: [''],
            alls: this._formBuilder.array([]),
            colors: this._formBuilder.array([]),
            brands: this._formBuilder.array([]),
            rams: this._formBuilder.array([]),
        });

        this.filter$.pipe(skip(1)).subscribe(data => {
            if (data.param && data.param != '') {
                if (data.param == 'category_name') {
                    if (data.val != null) this.store.dispatch(new GetAttributes(data.val));
                    this.mainService.productGetAllRequest.category_id = data.val;
                } else if (data.param == 'search_key') {
                    this.mainService.productGetAllRequest.search_key = '';
                    if (data.val) this.mainService.productGetAllRequest.search_key = data.val;
                } else if (data.param == 'min_price') {
                    this.mainService.productGetAllRequest.min_price = null;
                    if (data.val && data.val > 0) this.mainService.productGetAllRequest.min_price = data.val;
                } else if (data.param == 'max_price') {
                    this.mainService.productGetAllRequest.max_price = null;
                    if (data.val && data.val > 0) this.mainService.productGetAllRequest.max_price = data.val;
                } else if (data.param == 'attribute_ids_collections') {
                    this.mainService.productGetAllRequest.attribute_ids_collections = null;
                    if (data.val && data.val.length > 0) this.mainService.productGetAllRequest.attribute_ids_collections = data.val;
                }else if (data.param == 'page') {
                    if (data.val) this.mainService.productGetAllRequest.page = data.val;
                }

                this.store.dispatch(new GetProducts(this.mainService.productGetAllRequest)).subscribe(data=>{
                    //console.log(data);
                });
            }
        });
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
            if (matchingAliases.includes('lg')) {
                this.drawerMode = 'side';
                this.drawerOpened = true;
            } else {
                this.drawerMode = 'over';
                this.drawerOpened = false;
            }
            if (matchingAliases.includes('xl')) {
                this.masonryColumns = 5;
            }
            else if (matchingAliases.includes('lg')) {
                this.masonryColumns = 4;
            }
            else if (matchingAliases.includes('md')) {
                this.masonryColumns = 3;
            }
            else if (matchingAliases.includes('sm')) {
                this.masonryColumns = 2;
            }
            else {
                this.masonryColumns = 1;
            }

            this._changeDetectorRef.markForCheck();
        });
        this.attributes$.subscribe(data => {
                if (data.Attributes && data.Attributes.length > 0) {
                    this.removeFArr(<FormArray>this.filterform.controls["alls"]);
                    data.Attributes.forEach(clr => {
                        if (clr.attribute_id != 10) {
                            clr.attribute_terms.forEach(terms => {
                                this.addAttr(
                                    clr.attribute_id,
                                    terms.attribute_term_id,
                                    terms.attribute_value
                                );
                            })
                        }
                    });
                }
        });
        this.filterform.get('minPrice').valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any])  => {
            if (prev!=next)this.filter$.next({param: 'min_price', val: next});
        });
        this.filterform.get('maxPrice').valueChanges.pipe(startWith(null), pairwise()).subscribe(([prev, next]: [any, any]) => {
            if (prev!=next)this.filter$.next({param: 'max_price', val: next});
        });
        this.addcart$.subscribe(cart=>{
            this.cartcount=0;
            if(cart&&cart.order_id!=0&&cart.order_details){
                this.cartcount=cart.order_details.length;
            }
        });
        this.carts$.subscribe(cart=>{
            this.cartcount=0;
            if(cart&&cart.order_id!=0&&cart.order_details){
                this.cartcount=cart.order_details.length;
            }
        });
    }

    addAttr(attribute_id, attribute_term_id, attribute_value) {
        (<FormArray>this.filterform.controls["alls"]).push(this._formBuilder.group({
            attribute_term_id: [attribute_term_id],
            attribute_value: [attribute_value],
            ispick: [false],
            attribute_id: [attribute_id]
        }));
    }

    getcolor(code) {
        return this.allcolors.filter(color => color.colorname == code)[0]?.colorcode;
    }

    addCart(productid){
        this.store.dispatch(new AddProductToCart({product_id:productid,customer_id:this.mainService.selectedCustomer.customer_id})).subscribe({
            next: () => {
                this.toastr.success('Ürün Sepete Eklendi');
            }
        });
    }

    filtered() {
        let attid = [];
        let getSelecteds = [];
        let sendArr = [];
        let tempA = [];
        let alls = [...this.filterform.getRawValue().alls];
        alls.forEach(attr => {
            if (!attid.includes(attr.attribute_id)) attid.push(attr.attribute_id);
        });
        attid.forEach(ids => {
            getSelecteds = alls.filter(attr => attr.attribute_id == ids && attr.ispick == true);
            tempA = [];
            getSelecteds.forEach(Sel => {
                tempA.push(Sel.attribute_term_id);
            });
            if (tempA.length > 0) sendArr.push(tempA);
        });
        this.filter$.next({param: 'attribute_ids_collections', val: sendArr});
    }

    removeFArr(formArray: FormArray) {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }

    pageing(e) {
        this.filter$.next({param: 'page', val: e.pageIndex});
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    filterByQuery(param, val) {
        this.filter$.next({param: param, val: val});
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
