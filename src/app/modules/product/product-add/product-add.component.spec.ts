import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductAddComponent} from './product-add.component';
import {NgxsModule, Store} from "@ngxs/store";
import {FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MainService} from "../../../shared/main.service";
import {CommonService} from "../../../shared/services/common.service";
import {ProductService} from "../../../shared/services/product.service";
import {CartService} from "../../../shared/services/cart.service";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {RouterTestingModule} from "@angular/router/testing";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FilterState, ProductState} from "../../../shared/state/product.state";
import {CartState} from "../../../shared/state/cart.state";
import {ChangeDetectorRef, NO_ERRORS_SCHEMA} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {FuseMediaWatcherService} from "../../../../@fuse/services/media-watcher";
import {ToastrService} from "ngx-toastr";
import {ProductDetComponent} from "../product-det/product-det.component";
import {of} from "rxjs";
import {GetAttributes, GetProductByID} from "../../../shared/state/actions/product.action";

describe('ProductAddComponent', () => {
    let component: ProductAddComponent;
    let fixture: ComponentFixture<ProductAddComponent>;
    let store: Store;
    let formBuilder: FormBuilder;
    let mainService: MainService;
    let commonService: CommonService;
    let productService: ProductService;
    let cartService: CartService;

    interface MockFile {
        name: string;
        body: string;
        mimeType: string;
    }

    const createFileFromMockFile = (file: MockFile): File => {
        const blob = new Blob([file.body], {type: file.mimeType}) as any;
        blob['lastModifiedDate'] = new Date();
        blob['name'] = file.name;
        return blob as File;
    };
    const createMockFileList = (files: MockFile[]) => {
        const fileList: FileList = {
            length: files.length,
            item(index: number): File {
                return fileList[index];
            }
        };
        files.forEach((file, index) => fileList[index] = createFileFromMockFile(file));

        return fileList;
    };

    beforeEach(async () => {
        const changeDetectorRefStub = () => ({markForCheck: () => ({})});
        const matDialogStub = () => ({});
        const fuseMediaWatcherServiceStub = () => ({
            onMediaChange$: {pipe: () => ({subscribe: f => f({matchingAliases: ['lg']})})}
        });
        const mainServiceStub = () => ({
            productGetAllRequest: {
                category_id: {},
                search_key: {},
                min_price: {},
                max_price: {},
                attribute_ids_collections: {}
            },
            saveProductFilter: {},
            selectedCustomer: {customer_id: {}}
        });
        const toastrServiceStub = () => ({
            success: string => ({}),
            error: (string, string1, object) => ({})
        });
        await TestBed.configureTestingModule({
            imports: [HttpClientModule, FormsModule, ReactiveFormsModule,
                MatSelectModule, RouterTestingModule, MatAutocompleteModule, MatSelectModule,
                MatFormFieldModule, MatInputModule, BrowserAnimationsModule,
                NgxsModule.forRoot([ProductState, CartState, FilterState])],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ProductAddComponent],
            providers: [
                {provide: ChangeDetectorRef, useFactory: changeDetectorRefStub},
                {provide: MatDialog, useFactory: matDialogStub},
                {
                    provide: FuseMediaWatcherService,
                    useFactory: fuseMediaWatcherServiceStub
                },
                FormBuilder, ProductService, CommonService, CartService,
                {provide: MainService, useFactory: mainServiceStub},
                {provide: ToastrService, useFactory: toastrServiceStub}
            ]
        })
            .compileComponents();
        store = TestBed.inject(Store);
        mainService = TestBed.inject(MainService);
        commonService = TestBed.inject(CommonService);
        productService = TestBed.inject(ProductService);
        cartService = TestBed.inject(CartService);
        fixture = TestBed.createComponent(ProductAddComponent);
        component = fixture.componentInstance;
        formBuilder = TestBed.inject(FormBuilder);
        Object.defineProperty(component, 'attributes$', {writable: true});
        Object.defineProperty(component, 'categories$', {writable: true});
        component.attributes$ = of({
            Attributes: [
                {
                    "attribute_id": 2,
                    "attribute_title": "Renk",
                    "attribute_terms": [
                        {
                            "attribute_term_id": 1,
                            "attribute_value": "Kırmızı"
                        },
                        {
                            "attribute_term_id": 2,
                            "attribute_value": "Siyah"
                        }
                    ]
                },
                {
                    "attribute_id": 4,
                    "attribute_title": "Marka",
                    "attribute_terms": [
                        {
                            "attribute_term_id": 3,
                            "attribute_value": "Samsung"
                        },
                        {
                            "attribute_term_id": 4,
                            "attribute_value": "Apple"
                        }
                    ]
                },
                {
                    "attribute_id": 8,
                    "attribute_title": "Bellek",
                    "attribute_terms": [
                        {
                            "attribute_term_id": 7,
                            "attribute_value": "4GB"
                        },
                        {
                            "attribute_term_id": 8,
                            "attribute_value": "8GB"
                        }
                    ]
                },
                {
                    "attribute_id": 10,
                    "attribute_title": "Fiyat",
                    "attribute_terms": [
                        {
                            "attribute_term_id": 10,
                            "attribute_value": "min"
                        },
                        {
                            "attribute_term_id": 11,
                            "attribute_value": "max"
                        }
                    ]
                }
            ]
        });
        component.categories$ = of({Categories: []});
        component.productForm = formBuilder.group({
            category_id: new FormControl(''),
            category_name: new FormControl(''),
            product_name: new FormControl(''),
            description: new FormControl(''),
            short_description: new FormControl(''),
            barcode: new FormControl(''),
            units_in_stock: new FormControl(''),
            price: new FormControl(''),
            attributes: new FormArray([]),
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should removeAvatar return null', () => {
        component.removeAvatar();
        expect(component.localUrl).toEqual(null);
    });
    it('should clearForm return null', () => {
        component.clearForm();
        expect(component.productForm.get('category_id').value).toEqual(null);
    });
    it('should selectCategory work', () => {
        spyOn(productService, 'getAttributes').and
            .callFake(function (value) {
                return of({
                    "success": true,
                    "id": null,
                    "message": null,
                    "data": [
                        {
                            "attribute_id": 2,
                            "attribute_title": "Renk",
                            "attribute_terms": [
                                {
                                    "attribute_term_id": 1,
                                    "attribute_value": "Kırmızı"
                                },
                                {
                                    "attribute_term_id": 2,
                                    "attribute_value": "Siyah"
                                }
                            ]
                        },
                        {
                            "attribute_id": 4,
                            "attribute_title": "Marka",
                            "attribute_terms": [
                                {
                                    "attribute_term_id": 3,
                                    "attribute_value": "Samsung"
                                },
                                {
                                    "attribute_term_id": 4,
                                    "attribute_value": "Apple"
                                }
                            ]
                        },
                        {
                            "attribute_id": 8,
                            "attribute_title": "Bellek",
                            "attribute_terms": [
                                {
                                    "attribute_term_id": 7,
                                    "attribute_value": "4GB"
                                },
                                {
                                    "attribute_term_id": 8,
                                    "attribute_value": "8GB"
                                }
                            ]
                        },
                        {
                            "attribute_id": 10,
                            "attribute_title": "Fiyat",
                            "attribute_terms": [
                                {
                                    "attribute_term_id": 10,
                                    "attribute_value": "min"
                                },
                                {
                                    "attribute_term_id": 11,
                                    "attribute_value": "max"
                                }
                            ]
                        }
                    ]
                });
            })
        component.selectCategory({value: {category_id: 4}});
        const selectCategory = store.selectSnapshot(FilterState.getAttributes);-
            expect(selectCategory.Attributes.length).toEqual(4);
    });
    describe('addAttr', () => {
        it('makes expected vals', () => {
            component.addAttr("Renk", 2, [
                {
                    "attribute_term_id": 1,
                    "attribute_value": "Kırmızı"
                },
                {
                    "attribute_term_id": 2,
                    "attribute_value": "Siyah"
                }
            ]);
            expect((<FormArray>component.productForm.controls["attributes"]).length).toEqual(4);
        });
        it('makes expected vals', () => {
            component.addAttr('1', 2, 3);
            expect(component.attrArrays['1']).toEqual(3);
        });
    });
    describe('removeFArr', () => {
        it('makes expected calls', () => {
            const formArrayStub: FormArray = new FormArray([new FormControl('')]);
            spyOn(formArrayStub, 'removeAt').and.callThrough();
            component.removeFArr(formArrayStub);
            expect(formArrayStub.removeAt).toHaveBeenCalled();
        });
        it('makes expected remove', () => {

            const formArrayStub: FormArray = new FormArray([new FormControl('')]);
            formArrayStub.at(0).setValue('1');
            component.removeFArr(formArrayStub);
            expect(formArrayStub.length).toEqual(0);
        });
    });
    describe('uploadAvatar', () => {
        it('should uploadAvatar work', async () => {
            const fileList = createMockFileList([
                {
                    body: 'test',
                    mimeType: 'text/plain',
                    name: 'test.txt'
                }
            ]);
            component.uploadAvatar(fileList);
            expect(component.fileLup).toEqual(undefined);
        });
        it('should uploadAvatar work null', async () => {
            component.uploadAvatar(null);
            expect(component.fileLup).toEqual(undefined);
        });
    });
    describe('addimage', () => {
        it('should addimage work', async () => {
            component.addimage();
            expect(component.fileLup).toEqual(undefined);
        });
    });
    describe('ngOnInit', () => {
        it('makes expected calls', () => {
            spyOn(productService, 'getAttributes').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": [
                            {
                                "attribute_id": 2,
                                "attribute_title": "Renk",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 1,
                                        "attribute_value": "Kırmızı"
                                    },
                                    {
                                        "attribute_term_id": 2,
                                        "attribute_value": "Siyah"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 4,
                                "attribute_title": "Marka",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 3,
                                        "attribute_value": "Samsung"
                                    },
                                    {
                                        "attribute_term_id": 4,
                                        "attribute_value": "Apple"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 8,
                                "attribute_title": "Bellek",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 7,
                                        "attribute_value": "4GB"
                                    },
                                    {
                                        "attribute_term_id": 8,
                                        "attribute_value": "8GB"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 10,
                                "attribute_title": "Fiyat",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 10,
                                        "attribute_value": "min"
                                    },
                                    {
                                        "attribute_term_id": 11,
                                        "attribute_value": "max"
                                    }
                                ]
                            }
                        ]
                    });
                });
            component.store.dispatch(new GetAttributes(4));
            component.ngOnInit();
            expect(component.store.selectSnapshot(FilterState.getAttributes)).toBeTruthy();
        });
    });

    describe('sendForm', () => {
        it('makes expected calls', () => {
            spyOn(productService, 'getAttributes').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": null,
                        "data": [
                            {
                                "attribute_id": 2,
                                "attribute_title": "Renk",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 1,
                                        "attribute_value": "Kırmızı"
                                    },
                                    {
                                        "attribute_term_id": 2,
                                        "attribute_value": "Siyah"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 4,
                                "attribute_title": "Marka",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 3,
                                        "attribute_value": "Samsung"
                                    },
                                    {
                                        "attribute_term_id": 4,
                                        "attribute_value": "Apple"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 8,
                                "attribute_title": "Bellek",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 7,
                                        "attribute_value": "4GB"
                                    },
                                    {
                                        "attribute_term_id": 8,
                                        "attribute_value": "8GB"
                                    }
                                ]
                            },
                            {
                                "attribute_id": 10,
                                "attribute_title": "Fiyat",
                                "attribute_terms": [
                                    {
                                        "attribute_term_id": 10,
                                        "attribute_value": "min"
                                    },
                                    {
                                        "attribute_term_id": 11,
                                        "attribute_value": "max"
                                    }
                                ]
                            }
                        ]
                    });
                });
            component.store.dispatch(new GetAttributes(4));
            spyOn(productService, 'addProduct').and
                .callFake(function (value) {
                    return of({
                        "success": true,
                        "id": null,
                        "message": "Product Güncellendi"
                    });
                });
            component.sendForm();
            expect(component.store.selectSnapshot(FilterState.getAttributes)).toBeTruthy();
        });
    });
});
