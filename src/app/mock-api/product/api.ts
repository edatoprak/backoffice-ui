import {Injectable} from '@angular/core';
import {cloneDeep} from 'lodash-es';
import {FuseMockApiService} from '@fuse/lib/mock-api/mock-api.service';
import {categories, protucts} from "./data";

@Injectable({
    providedIn: 'root'
})
export class ProductMockApi {
    private _products: any[] = protucts;
    private _categories: any[] = categories;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {

        this._fuseMockApiService
            .onGet('/api/v1/categories/getall')
            .reply(({request}) => {
                let categories = cloneDeep(this._categories);

                console.log('tekrar categories');
                return [
                    200,
                    {
                        Categories: categories
                    }
                ];
            });
        this._fuseMockApiService
            .onGet('/api/v1/test')
            .reply(({request}) => {
                return [
                    200,
                    {
                        Tests: {
                            formClass: 'flex flex-row w-full gap-x-3 px-4 mt-4 flex-wrap ',

                            dynamics: [
                                {
                                    controlType: 'input',
                                    controlName: 'Name',
                                    controlValues: '',
                                    controlValidators: ['required', {name: 'minLength', value: 5}],
                                    placeHolder: '',
                                    hint: 'Adı',
                                    label: 'Adı',
                                    width: 'w-1/4'
                                },
                                {
                                    controlType: 'input',
                                    controlName: 'SurName',
                                    controlValues: '',
                                    controlValidators: ['required', {name: 'minLength', value: 5}],
                                    placeHolder: 'Soyadı',
                                    hint: '',
                                    label: 'Soyadı',
                                    width: 'w-2/4'
                                },
                                {
                                    controlType: 'date',
                                    controlName: 'BirthDate',
                                    controlValues: '',
                                    controlValidators: ['required'],
                                    placeHolder: '',
                                    hint: '',
                                    label: 'Doğum Tarihi',
                                    width: 'w-1/4'
                                },
                                {
                                    controlType: 'radio',
                                    controlName: 'BirthDate',
                                    controlValues: [{name: 'İlkOkul', value: 1}, {name: 'OrtaOkul', value: 2}, {name: 'Lise', value: 3}, {name: 'Üniversite', value: 4}],
                                    controlValidators: ['required'],
                                    placeHolder: '',
                                    hint: '',
                                    label: 'Doğum Tarihi',
                                    width: 'w-1/4'
                                }
                            ]
                        }
                    }
                ];
            });


        this._fuseMockApiService
            .onGet('api/v1/products/getall', 300)
            .reply(({request}) => {
                const search = request.params.get('search');
                const sort = request.params.get('sort') || 'product_name';
                const order = request.params.get('order') || 'asc';
                const page = parseInt(request.params.get('page') ?? '0', 10);
                const size = parseInt(request.params.get('size') ?? '20', 10);
                let products: any[] | null = cloneDeep(this._products);
                if (sort === 'product_name' || sort === 'description') {
                    products.sort((a, b) => {
                        const fieldA = a[sort].toString().toUpperCase();
                        const fieldB = b[sort].toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                } else {
                    products.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }
                if (search && search != '' && search['search'] && search['search'].toString() != '') {
                    products = products.filter(dd => dd.product_name && dd.product_name.toLowerCase().includes(search['search'].toString().toLowerCase()));
                }

                if (search && search != '' && search['category_name'] && search['category_name'].toString() != '') {
                    products = products.filter(dd => dd.category_id && dd.category_id == search['category_name']);
                }


                const productsLength = products.length;
                const begin = page * size;
                const end = Math.min((size * (page + 1)), productsLength);
                const lastPage = Math.max(Math.ceil(productsLength / size), 1);
                let pagination = {};
                if (page > lastPage) {
                    products = null;
                    pagination = {
                        lastPage
                    };
                } else {
                    products = products.slice(begin, end);
                    pagination = {
                        length: productsLength,
                        size: size,
                        page: page,
                        lastPage: lastPage,
                        startIndex: begin,
                        endIndex: end - 1
                    };
                }
                return [
                    200,
                    {
                        Products: products,
                        Pagination: pagination
                    }
                ];
            });

    }
}
