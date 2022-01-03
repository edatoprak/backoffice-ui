import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Select, Store} from "@ngxs/store";
import {FilterState, ProductState} from "../../../shared/state/product.state";
import {Observable} from "rxjs";
import {AttributesStateModel, CategoriesStateModel, GetProductByIDStateModel, ProductUpdateRequest} from "../../../shared/state/models/product";
import {skip} from "rxjs/operators";
import {AddProductImage, GetAttributes, GetProductByID, UpdateProduct} from "../../../shared/state/actions/product.action";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-product-det',
    templateUrl: './product-det.component.html',
    styleUrls: ['./product-det.component.scss']
})
export class ProductDetComponent implements OnInit {
    @ViewChild('supportNgForm') supportNgForm: NgForm;

    @Select(FilterState.getCategories) categories$: Observable<CategoriesStateModel>;
    @Select(FilterState.getAttributes) attributes$: Observable<AttributesStateModel>;
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    alert: any;
    productForm: FormGroup;
    localUrl: any;
    ProductID: number;
    fileLup: any;
    selected: any;
    getbyid:GetProductByIDStateModel;
    attrArrays: { [k: string]: any } = {};

    constructor(public store: Store,public sanitizer: DomSanitizer,
                public _formBuilder: FormBuilder,
                public router: Router,
                public route: ActivatedRoute
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
        this.ProductID = +this.route.snapshot.paramMap.get('id');
        this.store.dispatch(new GetProductByID(this.ProductID)).subscribe(()=>{
            this.getbyid=this.store.selectSnapshot(ProductState.getProductByID);
            this.productForm.patchValue(this.getbyid);
            if(this.getbyid.category_name){
                this.productForm.get('category_name').setValue({category_name:this.getbyid.category_name,category_id:this.getbyid.category_id});
                if (this.getbyid.category_id != null) this.store.dispatch(new GetAttributes(this.getbyid.category_id)).subscribe(()=>{
                    setTimeout(()=>{
                        this.getbyid.product_attribute_term_dtos.forEach(attribute_term=>{
                            this.setAttr(attribute_term.attribute_id,attribute_term.attribute_term_id);
                        });
                    },100);
                });
            }
            if(this.getbyid.product_price_dto&&this.getbyid.product_price_dto.length>0)this.productForm.get('price').setValue(this.getbyid.product_price_dto[0].actual_price);
            if(this.getbyid.product_image_dto_list&&this.getbyid.product_image_dto_list.length>0){
                this.fileLup =new File([this.dataURItoBlob(this.getbyid.product_image_dto_list[0].image)], this.getbyid.product_image_dto_list[0].product_image_name);
                this.localUrl=this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.getbyid.product_image_dto_list[0].image}`);
            }

        });
    }
    setAttr(attribute_id,attribute_terms){
        (<FormArray>this.productForm.get('attributes')).controls.forEach(control=>{
            if (control.get('attribute_id').value==attribute_id){
                control.get('attribute_select')
                    .setValue({
                        attribute_term_id: attribute_terms,
                        attribute_value: ''});
            }
        });
    }
    compareObjects(o1: any, o2: any): boolean {
       return o1.category_name === o2.category_name && o1.category_id === o2.category_id;
    }
    compareAttr(o1: any, o2: any): boolean {
        if (o1&&o2&&  o1.attribute_term_id&&o2.attribute_term_id)
        return o1.attribute_term_id === o2.attribute_term_id;
        return false;
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
    clearForm(): void {
        // Reset the form
        this.supportNgForm.resetForm();
    }
    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([int8Array], {type: 'image/png'});
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
        let post: ProductUpdateRequest = {
            product_price_dtos: [{
                actual_price: +this.productForm.get('price').value,
                discounted_price: +this.productForm.get('price').value,
                created_date: "2021-09-22T07:17:02.571Z",
                is_active: true
            }],
            product_attribute_term_dtos: attribute_term_id,
            category_id: +this.productForm.get('category_id').value,
            product_id: this.ProductID,
            product_name: this.productForm.get('product_name').value,
            description: this.productForm.get('description').value,
            short_description: this.productForm.get('short_description').value,
            barcode: this.productForm.get('barcode').value,
            units_in_stock: +this.productForm.get('units_in_stock').value
        };
        this.store.dispatch(new UpdateProduct(post)).subscribe(data => {
            this.store.dispatch(new AddProductImage({file: this.fileLup, prodid:  this.ProductID}));
            this.router.navigate(['/product/list']);
        });
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
        let me = this;
        let file =fileList[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        if (fileList && fileList[0]) {
            let reader = new FileReader();
            reader.onload = (event: any) => {
                this.localUrl = event.target.result;
                this.fileLup = fileList[0];
            }
            reader.readAsDataURL(fileList[0]);
        }
    }
    removeAvatar(): void {
        this.localUrl = null;
    }

}
