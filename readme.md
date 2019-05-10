# Introduction
The library "angular-type-safe-form" is a convenience library which extends the FormBuilder 
from Angular and enables you to use type-safety within reactive forms. 

The library does not manipulate any existing function or property. It defines new functions (mostly postfixed - safe e.g. getSafe()).
Those function perform the same action but return a type safe interface. 
 


## Installation
To install this library use npm with the following command:

``npm i angular-type-safe-form --save``

## Getting started

Import the ReactiveFormsModule to be able to use FormBuilder. 
Also provide the TSFormBuilder within a Module (e.g. CoreModule). 

----------------

```
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    TSFormBuilder
  ]
})
export class CoreModule { }
```

Import the Core module within your app.module.ts

-----------

Inject the TSFormBuilder with DI in the Constructor. 

```
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'type-safe-demo';


  constructor(
    private tsFormBuilder: TSFormBuilder
  ) {
  }
}
```

Define a interface for your form: 

```
interface AddressFormInterface {
  city: string;
  street: string;
  plz: string;
  country: 'CH' | 'DE' | 'AT';
}

export interface UserFormInterface {
  firstName: string;
  lastName: string;
  address: AddressFormInterface;
}
```
Define a property with the type safe implementation of FormGroup called FormGroupTyped. 
`  private userForm: FormGroupTyped<UserFormInterface>;`

Create the new form in a type safe way `this.tsFormBuilder.group<UserFormInterface>(...)`.

Use the magic: 



Starting to build our form: 

![alt text](https://raw.githubusercontent.com/Schmitda/type-safe-demo/master/src/assets/imgs/01_address.png "Type Safety")

Building subforms: 

![alt text](https://raw.githubusercontent.com/Schmitda/type-safe-demo/master/src/assets/imgs/01_typesafe.png "Type Safety")

Completed form: 

![alt text](https://raw.githubusercontent.com/Schmitda/type-safe-demo/master/src/assets/imgs/01_typesafe_completed.png "Type Safety")

Partial forms (see the missing first and lastname): 

![alt text](https://raw.githubusercontent.com/Schmitda/type-safe-demo/master/src/assets/imgs/01_typesafe_partial.png "Type Safety")



# Functions on FormGroupTypes

this.userForm.value | returns UserFormInterface

getSafe() | get a formcontrol on a safe way `this.userForm.getSafe(x => x.lastName).setValidators(Validators.required);`

![alt text](https://raw.githubusercontent.com/Schmitda/type-safe-demo/master/src/assets/imgs/02_typesafe_partial.png "Type Safety")

addControlSafe() | add a new control
``    this.userForm.addControlSafe(x => x.lastName, new FormControl());
``

registerControlSafe() | `this.userForm.registerControlSafe(x => x.firstName, new FormControl());
`

setControlSafe() | `this.userForm.setControlSafe(x => x.firstName, new FormControl());
`

removeControlSafe() | removes a control type safely 

### Example - Accessing subforms

The following example accesses the user form and accesses the subform to patch the value of street.

`this.userForm.getSafe(x => x.address.street).patchValue('Kuchenweg 12');`
