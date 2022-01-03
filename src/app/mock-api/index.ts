import { AcademyMockApi } from 'app/mock-api/apps/academy/api';
import { ActivitiesMockApi } from 'app/mock-api/pages/activities/api';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { CalendarMockApi } from 'app/mock-api/apps/calendar/api';
import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { ContactsMockApi } from 'app/mock-api/apps/contacts/api';
import { CryptoMockApi } from 'app/mock-api/dashboards/crypto/api';
import { ECommerceInventoryMockApi } from 'app/mock-api/apps/ecommerce/inventory/api';
import { FileManagerMockApi } from 'app/mock-api/apps/file-manager/api';
import { FinanceMockApi } from 'app/mock-api/dashboards/finance/api';
import { HelpCenterMockApi } from 'app/mock-api/apps/help-center/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { MailboxMockApi } from 'app/mock-api/apps/mailbox/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotesMockApi } from 'app/mock-api/apps/notes/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ProjectMockApi } from 'app/mock-api/dashboards/project/api';
import { SearchMockApi } from 'app/mock-api/common/search/api';
import { ScrumboardMockApi } from 'app/mock-api/apps/scrumboard/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { TasksMockApi } from 'app/mock-api/apps/tasks/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import {ProductMockApi} from "./product/api";
import { CustomerMockApi } from './customers/api';

export const mockApiServices = [
    AcademyMockApi,
    ActivitiesMockApi,
    AnalyticsMockApi,
    AuthMockApi,
    CalendarMockApi,
    ChatMockApi,
    ContactsMockApi,
    CryptoMockApi,
    ECommerceInventoryMockApi,
    FileManagerMockApi,
    FinanceMockApi,
    HelpCenterMockApi,
    IconsMockApi,
    MailboxMockApi,
    MessagesMockApi,
    NavigationMockApi,
    NotesMockApi,
    NotificationsMockApi,
    ProjectMockApi,
    SearchMockApi,
    ScrumboardMockApi,
    ShortcutsMockApi,
    TasksMockApi,
    UserMockApi,
    ProductMockApi,
    CustomerMockApi
];
/*
AUTH
/api/v1/auth/login
/api/v1/auth/logout

USERS
/api/v1/users/add
/api/v1/users/update

Roles
/api/v1/roles/getall


Customers
/api/v1/customers/search   (lazım)
/api/v1/customers/getbyid
/api/v1/customers/getall (beşir bey post istedi :)
/api/v1/customers/add
/api/v1/customers/getcontacts
/api/v1/customers/addcontacts
/api/v1/customers/updatecontacts
/api/v1/customers/update

Products
/api/v1/products/getall(search)
/api/v1/products/getbyid
/api/v1/products/add
/api/v1/products/update

Carts(Orders/Order Details)
/api/v1/carts/getbyid
/api/v1/carts/getall (post)
/api/v1/carts/getorderdetails
/api/v1/carts/add
/api/v1/carts/update
/api/v1/carts/delete

Categories
/api/v1/categories/getall
/api/v1/categories/<categoryid>/getattributes

Attributes
/api/v1/attributes/<attributeid>/getattributeterms

Common
/api/v1/common/getcountries
/api/v1/common/<countryid>/getcities
/api/v1/common/<cityid>/getdistricts



* */
