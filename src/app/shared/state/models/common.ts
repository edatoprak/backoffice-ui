export interface Countries {
    country_id: number;
    country_name: string;
    nation_code: string;
}

export interface Cities {
    city_id: number;
    city_name: string;
}

export interface Districts{
    district_id: number;
    district_name: string;
}

export class CountryStateModel {
    Countries: Countries[];
}

export class CityStateModel {
    Cities: Cities[];
}

export class DistrictStateModel {
    Districts: Districts[];
}
