import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ListParams} from "../state/models/role";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _httpClient: HttpClient) { }

    getTests() {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/formcontrols/getformcontrols/'+'1');
    }
    getCountries() {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/common/getcountries');
    }

    getCities(countryId) {
      return this._httpClient.get('http://159.69.28.194:8080/api/v1/common/' + countryId + '/getcitiesbycountry');
    }
    getDistricts(cityId) {
        return this._httpClient.get('http://159.69.28.194:8080/api/v1/common/' + cityId + '/getdistrictsbycity');
    }

    getAllRoles(listparams: ListParams){
      return this._httpClient.post('http://159.69.28.194:8080/api/v1/roles/getall', listparams)
    }

}
