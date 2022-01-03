import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CURRENCY_MASK_CONFIG, CurrencyMaskConfig, CurrencyMaskModule} from "ng2-currency-mask";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    decimal: ",",
    precision: 0,
    prefix: "",
    suffix: "",
    thousands: "."
};
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatSliderModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule
    ], providers: [
        { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
    ]
})
export class SharedModule
{
}
