/* tslint:disable:max-line-length */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'customer',
        title: 'Müşteri Ara',
        type : 'basic',
        icon : 'heroicons_outline:search',
        link : '/customer'

    },
    {
        id: 'product',
        title: 'Ürünler',
        type: 'basic',
        icon: 'heroicons_outline:template',
        link: '/product/list'
    },
    {
        id   : 'order',
        title: 'Siparişler',
        type : 'basic',
        icon : 'heroicons_outline:shopping-cart',
        link : '/order/list'

    },
    {
        id   : 'user',
        title: 'Kullanıcılar',
        type : 'basic',
        icon : 'heroicons_outline:user',
        link : '/user/list'

    },
];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
