import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Select, Store} from "@ngxs/store";
import {FilterState, ProductState} from "../../../shared/state/product.state";
import {Observable} from "rxjs";
import {AttributesStateModel, CategoriesStateModel, ProductSaveRequest} from "../../../shared/state/models/product";
import {AddProduct, AddProductImage, GetAttributes} from "../../../shared/state/actions/product.action";

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;

    @Select(FilterState.getCategories) categories$: Observable<CategoriesStateModel>;
    @Select(FilterState.getAttributes) attributes$: Observable<AttributesStateModel>;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    alert: any;
    productForm: FormGroup;
    localUrl: any;
    fileLup: any;
    attrArrays: { [k: string]: any } = {};

    constructor(public store: Store,
                public _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.productForm = this._formBuilder.group({
            category_id: ['', Validators.required],
            category_name: ['', Validators.required],
            product_name: ['', Validators.required],
            description: ['', Validators.required],
            short_description: ['', Validators.required],
            barcode: ['', Validators.required],
            units_in_stock: ['', Validators.required],
            price: ['', Validators.required],
            attributes: this._formBuilder.array([]),
        });

        this.attributes$.subscribe(data => {
            if (data.Attributes && data.Attributes.length > 0) {
                data.Attributes.forEach(attr => {
                    if (attr.attribute_id != 10)
                        this.addAttr(
                            attr.attribute_title,
                            attr.attribute_id,
                            attr.attribute_terms);
                });
            }
        });
    }

    addAttr(attribute_title, attribute_id, attribute_terms) {
        (<FormArray>this.productForm.controls["attributes"])
            .push(this._formBuilder.group({
                attribute_title: [attribute_title],
                attribute_id: [attribute_id],
                attribute_select: [''],
            }));
        this.attrArrays[attribute_title] = attribute_terms;
    }

    removeFArr(arr: FormArray) {
        while (arr.controls.length > 0) {
            arr.removeAt(arr.length - 1);
        }
    }


    sendForm(): void {
        let attribute_term_id = [];
        let attributes = this.productForm.get('attributes').value;
        attributes.forEach(attr => {
            if (attr.attribute_select.attribute_term_id) attribute_term_id.push(
                {
                    attribute_id: +attr.attribute_id,
                    attribute_term_id: +attr.attribute_select.attribute_term_id
                }
            );
        });
        let post: ProductSaveRequest = {
            product_price_dtos: [{
                actual_price: +this.productForm.get('price').value,
                discounted_price: +this.productForm.get('price').value,
                created_date: "2021-09-22T07:17:02.571Z",
                is_active: true
            }],
            product_attribute_term_dtos: attribute_term_id,
            category_id: +this.productForm.get('category_id').value,
            product_name: this.productForm.get('product_name').value,
            description: this.productForm.get('description').value,
            short_description: this.productForm.get('short_description').value,
            barcode: this.productForm.get('barcode').value,
            units_in_stock: +this.productForm.get('units_in_stock').value
        };
        this.store.dispatch(new AddProduct(post)).subscribe(data => {
            let proid = this.store.selectSnapshot(ProductState.addProduct);
            if (proid.AddProductID)this.store.dispatch(new AddProductImage({file: this.fileLup, prodid: proid.AddProductID}));
            this.alert = {
                type: 'success',
                message: 'Ürün Eklendi'
            };
            this.clearForm();
        });
    }

    addimage() {
        this.store.dispatch(new AddProductImage({file: this.fileLup, prodid: 27}));
    }

    selectCategory($event) {
        this.productForm.get('category_id').setValue($event.value.category_id);
        this.removeFArr(<FormArray>this.productForm.controls["attributes"]);
        if ($event.value.category_id != null) this.store.dispatch(new GetAttributes($event.value.category_id));
    }

    uploadAvatar(fileList: FileList): void {
        if (!fileList||!fileList.length) {
            return;
        }
        if (fileList && fileList[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
                this.fileLup = fileList[0];
            }
            reader.readAsDataURL(fileList[0]);
        }
    }
    clearForm(): void {
        this.supportNgForm.resetForm();
        this.localUrl=null;
        this.fileLup=null;
    }
    removeAvatar(): void {
        this.localUrl = null;
    }

}
