import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";


type PropertyFn<T, R> = (val: T) => R;

interface AbstractControlTyped<T> extends AbstractControl {
    readonly value: T;
    readonly valueChanges: Observable<T>;

    setValue(value: T, options?: Object): T;

    patchValue(value: T, options?: Object): T;

    reset(value?: T, options?: Object): void;

    get(path: Array<string | number> | string): AbstractControl | null;

    get<R>(path: Array<string | number> | string): AbstractControlTyped<R> | null;

    getSafe<R>(propertyFn: PropertyFn<T, R>): AbstractControlTyped<R> | null;
}

export interface FormGroupTyped<T> extends FormGroup {
    readonly value: T;
    readonly valueChanges: Observable<T>;

    setValue(value: T, options?: Object): T;

    patchValue(value?: T, options?: Object): T;

    reset(value?: T, options?: Object): void;

    get(path: Array<string | number> | string): AbstractControl | null;

    get<T>(path: Array<string | number> | string): AbstractControlTyped<T> | null;

    getSafe<R>(propertyFn: PropertyFn<T, R>): AbstractControlTyped<R> | null;

    registerControl(name: string, control: AbstractControl): AbstractControl;

    registerControl<T>(name: string, control: AbstractControl): AbstractControlTyped<T>;

    registerControlSafe<R>(propertyFn: PropertyFn<T, R>, control: AbstractControl): AbstractControlTyped<R>;

    addControlSafe<R>(propertyFn: PropertyFn<T, R>, control: AbstractControl): void;

    removeControlSafe<R>(propertyFn: PropertyFn<T, R>): void;

    setControlSafe<R>(propertyFn: PropertyFn<T, R>, control: AbstractControl): void;
}

type ControlsConfigTyped<T> = {
    [P in keyof T]: FormControl | FormGroup | FormArray | {
    0?: T[P|undefined|null];
    1?: ValidatorFn | ValidatorFn[];
    2?: AsyncValidatorFn | AsyncValidatorFn[];
};
};

@Injectable()
export class TSFormBuilder extends FormBuilder {
    private static getPropertyName(propertyFunction: Function): string {
        // TODO FIX
        const property = propertyFunction.toString()
            .replace(/\r?\n|\r/g, "")
            .replace(/.+?(?=\.)/i, "")
            .slice(1)
            .replace(/\{|\}|\s|;/g, "");

        return property;
    }

    private static getSafe<T, R>(group: AbstractControl, propertyFn: PropertyFn<T, R>): AbstractControlTyped<R> {
        const getStr = TSFormBuilder.getPropertyName(propertyFn);
        return this.mapControl(group.get(getStr) as AbstractControlTyped<R>);
    }

    private static registerControlSafe<T, R>(group: FormGroup, propertyFn: PropertyFn<T, R>, control: AbstractControl): AbstractControlTyped<R> {
        const getStr = TSFormBuilder.getPropertyName(propertyFn);
        return this.mapControl(group.registerControl(getStr, control) as AbstractControlTyped<R>);
    }

    private static addControlSafe<T, R>(group: FormGroup, propertyFn: PropertyFn<T, R>, control: AbstractControl) {
        const getStr = TSFormBuilder.getPropertyName(propertyFn);
        group.addControl(getStr, control);
    }

    private static removeControlSafe<T, R>(group: FormGroup, propertyFn: PropertyFn<T, R>) {
        const getStr = TSFormBuilder.getPropertyName(propertyFn);
        group.removeControl(getStr);
    }

    private static setControlSafe<T, R>(group: FormGroup, propertyFn: PropertyFn<T, R>, control: AbstractControl) {
        const getStr = TSFormBuilder.getPropertyName(propertyFn);
        group.setControl(getStr, control);
    }

    private static mapFormGroup<T>(group: FormGroupTyped<T>): FormGroupTyped<T> {
        group.registerControlSafe = function <T, R>(propertyFn: PropertyFn<T, R>, control: AbstractControl) {
            return TSFormBuilder.registerControlSafe(group, propertyFn, control);
        };

        group.addControlSafe = function <T, R>(propertyFn: PropertyFn<T, R>, control: AbstractControl) {
            TSFormBuilder.addControlSafe(group, propertyFn, control);
        };

        group.removeControlSafe = function <T, R>(propertyFn: PropertyFn<T, R>) {
            TSFormBuilder.removeControlSafe(group, propertyFn);
        };

        group.setControlSafe = function <T, R>(propertyFn: PropertyFn<T, R>, control: AbstractControl) {
            return TSFormBuilder.setControlSafe(group, propertyFn, control);
        };

        return group;
    }

    private static mapControl<T>(control: FormGroupTyped<T>): FormGroupTyped<T>;
    private static mapControl<T>(control: AbstractControlTyped<T>): AbstractControlTyped<T>;
    private static mapControl<T>(control: AbstractControlTyped<T> | FormGroupTyped<T>): AbstractControlTyped<T> {
        control.getSafe = function <T, R>(propertyFn: PropertyFn<T, R>) {
            return TSFormBuilder.getSafe(control, propertyFn);
        };

        if (control instanceof FormGroup) {
            this.mapFormGroup(control);
        }

        return control;
    }

    group(controlsConfig: ControlsConfigTyped<any>, extra?: { [key: string]: any; } | null): FormGroup;
    group<T>(controlsConfig: ControlsConfigTyped<T>, extra?: { [key: string]: any; } | null): FormGroupTyped<T>;
    group<T>(controlsConfig: ControlsConfigTyped<T>, extra?: { [key: string]: any; } | null): FormGroupTyped<T> {
        let group = super.group(controlsConfig, extra) as FormGroupTyped<T>;

        if (group) {
            return TSFormBuilder.mapControl(group);
        }
    }
}
