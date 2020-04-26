import {FormControl, ValidationErrors} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";

export function emailValidation(c): ValidationErrors {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(c.value) ? null : {'email': true}
}
export function emailValidationMessage(error, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" неправильный формат. Пример поля: uir@uir.ru`
}

export function passwordValidation(c): ValidationErrors {
  return /^.{6,40}$/.test(c.value) ? null : {'password': true}
}
export function passwordValidationMessage(error, field: FormlyFieldConfig) {
  return 'Пароль должен быть от 6 до 40 символов';
}

export function maxLengthValidation(control: FormControl, field: FormlyFieldConfig): ValidationErrors {
  return control.value.length > field.templateOptions.max ? {'max': true} : null;
}

export function minLengthValidation(control: FormControl, field: FormlyFieldConfig): ValidationErrors {
  return control.value.length < field.templateOptions.min ? {'min': true} : null;

}

export function maxValidationMessage(err, field) {
  return `Значение не может быть больше ${field.templateOptions.max}`;
}

export function maxLengthValidationMessage(err, field) {
  return `Длина не может быть больше ${field.templateOptions.max}`;
}

export function minLengthValidationMessage(err, field) {
  return `Длина не может быть меньше ${field.templateOptions.min}`;
}
