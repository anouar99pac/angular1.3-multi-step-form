# angular1.3-multi-step-form

Below is Multi-Step-Form, a project developed using Angular 1.3. It is a flexible means that enables the user to edit DOM, to remove or add new steps to your forms.

The following demo shows how the project is used for multi-data binding under Angular.

DEMO: 

http://plnkr.co/edit/YI5XximZJIfEQDUoRZi8?p=preview

# Development tools
- Angular 1.3
- Bootstrap css
- ui-bootstrap

# Features
Responsive design
Form validation (ng-validation)
Extensible with other modules

## How to use Multi-Step-Form

 The number of form steps can be set in the Controller of the Directive.
For example, adding or removing steps to a three-step form is achieved by editing the following Scope variable: 
$scope.steps = [ 'Step 1 Definition', 'Step 2 Translation', 'Step 3 Infos' ];

 
`$scope.steps = [`
     `'Step 1 Definition',`
     `'Step 2 Translation',`
     `'Step 3 Infos'`
   `];`


