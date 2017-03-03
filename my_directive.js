/**========directive MultiStepForm
    Cette Directive va représenter Multi-Step form validation (wizard)
    avec plusieurs étapes. et nous pouvons enregistrer les données que à la fin de létape
    La directive est dynamique en fonction de la indexStep
    indexStep une liste   exemple :
    $scope.steps = [
        'Step 1: Team Info',
        'Step 2: Campaign Info',
        'Step 3: Campaign Media'
    ];

 */
var app = angular.module('multiStepForm', [])
app.directive('multiStepForm', ["$http", "$location", function($http, $location) {
  return {
    restrict: 'E', //la directive sera appelée comme balise html:<multi-step-form>
    transclude: true,
    scope: {
      indexStep: '=', // le nombre des étapes a mettre dans le widget (get it to controller)
      //contentBody:'@', // le contenu de chaque step after .we ll bring the body thanks to ng-include
      toNext: '=',
      //validationController:'@',

    },
    templateUrl: "my_directive_template.pt", //--template of directive'

    link: function(scope, element, attributs) {
      console.log("multi step form loading");

      scope.selection = scope.indexStep[0];

      scope.getCurrentStepIndex = function() {
        // Get the index of the current step given selection
        return scope.indexStep.indexOf(scope.selection);
      };

      // Go to a defined step index
      scope.goToStep = function(index) {
        if (angular.isDefined(scope.indexStep[index])) {
          scope.selection = scope.indexStep[index];
        }
      };

      scope.hasNextStep = function() {
        var stepIndex = scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        // Return true if there is a next step, false if not
        return angular.isDefined(scope.indexStep[nextStep]);
      };

      scope.hasPreviousStep = function() {
        var stepIndex = scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a previouss step, false if not
        return angular.isDefined(scope.indexStep[previousStep]);
      };

      scope.incrementStep = function() {
        if (scope.hasNextStep()) {
          var stepIndex = scope.getCurrentStepIndex();
          var nextStep = stepIndex + 1;
          scope.selection = scope.indexStep[nextStep];
        }
      };

      scope.decrementStep = function() {
        if (scope.hasPreviousStep()) {
          var stepIndex = scope.getCurrentStepIndex();
          var previousStep = stepIndex - 1;
          scope.selection = scope.indexStep[previousStep];
        }
      };

    }
  }
}]);