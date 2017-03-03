var app = angular.module('myForm', ['ui.bootstrap', 'multiStepForm']);
app.controller('MainCtrl', function($scope) {

  $scope.name = 'World';

  $scope.steps = [
    'Step 1 Definition',
    'Step 2 Translation',
    'Step 3 Infos'
  ];
  // condition to say if can i to pass in the next step
  // gloabal variable because i need to change it in child controller
  $scope.$root.to_next = true;

});
//configure location with html5
app.config(function($locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
});



///////////////--- makerControllerData  ---///////////////////////////
////////////// new controller for the content of each step ///////////

app.controller('makerControllerData', function($scope, $http, $uibModal, $location, $controller) {
  $scope.message_data = {
    'category_name': '',
    'messageCount': 0,
    'message_type': '',
    'original_message': '',
    'pattern': '',
    'comment': '',
    'title_pattern': {
      'fr': '',
      'en': ''
    },
    'id_pattern_task': 0,
    'pattern_splitted': [{
      type : 'fixed',
      value : ''
    }, ],
    'translation': {
      'fr' : '',
      'en' : ''
    },
    'send_notification': false,
    'send_email': false,
    'emails': [],
  };
  //liste des email de diffusion
  $scope.emails = [];
  $scope.message_id = null; // le grand Dico
  var $modalCheckPattern;

  // I need to inherit to the parent makerController to access to btn check pattern
  $controller('MainCtrl', {
    $scope: $scope,
  });

  var params = $location.search();
  if (params) {
    $scope.message_id = params.message_id;
  }

  /**********commentaire*/
  $scope.notification = function() {
    setTimeout(function() {
      toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
      };
      toastr.success('Définition du Pattern', 'Opération effectuée avec succès');

    }, 300);
  };

  if (params.message_id) {
    $http.post("/get-data-maker", {
        '_csrf': 'csrf',
        'message_id': params.message_id
      })
      .success(function(response) {
        if (response.results === null) {
          console.warn('attention data return none');
        } else {
          $scope.message_data = response.results;
          //modifier la liste des e-mails pour s'afficher dans le champs e-mails
          $scope.emails = [];
          if ($scope.message_data.emails && $scope.message_data.emails.length > 0) {
            angular.forEach($scope.message_data.emails, function(value, key) {
              $scope.emails.push({
                text: value
              });
            });
          }
        }
        // console.log($scope.message_data)
      })
      .error(function(data, status) {
        alert(status);
      });
  } else {
    if (params.orphan_id) {
      $http.post("/get-data-maker", {
          '_csrf': 'csrf',
          'orphan_id': params.orphan_id
        })
        .success(function(response) {
          $scope.message_data.category_name = response.results.category_name;
          $scope.message_data.original_message = response.results.original_message;
        })
        .error(function(data, status) {
          alert(status);
        });
    }
    $scope.$root.to_next = false;
  }

  /**********commentaire*/
  $scope.changePatternColumn = function(index, new_value) {
    $scope.$root.to_next = false;
  };

  $scope.addElemPattern = function(index) {
    $scope.$root.to_next = false;
    var new_elem = {
      'type': 'fixed',
      'value': '',
      'traduction': {
        'fr': '',
        'en': ''
      }
    };
    $scope.message_data.pattern_splitted.push(new_elem);
  };

  /**********commentaire*/
  $scope.removeElemPattern = function(index) {
    $scope.$root.to_next = false;
    $scope.message_data.pattern_splitted.splice(index, 1);
  };

  //======close modal
  $scope.close = function() {
    var is_pattern_valid = document.getElementById('pattern_message_valid').textContent;
    if (is_pattern_valid.toLowerCase().indexOf("pattern valide") > -1) {
      $scope.$root.to_next = true;
    }
    $modalCheckPattern.dismiss({
      'state': ''
    });
  };

  /**********commentaire*/
  $scope.getPatternMsg = function() {
    var pattern_msg = '';
    for (var elem in $scope.message_data.pattern_splitted) {
      if ($scope.message_data.pattern_splitted[elem].type == 'fixed') {
        pattern_msg = pattern_msg + $scope.message_data.pattern_splitted[elem].value;
      }
      if ($scope.message_data.pattern_splitted[elem].type == 'variable') {
        pattern_msg = pattern_msg + ' {' + $scope.message_data.pattern_splitted[elem].value + '} ';
      }
    }
    return pattern_msg.trim();
  };

  /**********commentaire*/
  $scope.checkPattern = function() {
    var data = $scope.getPatternMsg();
    var id_pattern_task = $scope.message_data.id_pattern_task;

    $modalCheckPattern = $uibModal.open({
      templateUrl: "/get-result-check-pattern?data=" + data + "&id_pattern_task=" + id_pattern_task,
      scope: $scope,
      backdrop: 'static',
    });
  };

  /**********commentaire**********/
  $scope.applyPatternInCurrentData = function() {
    $scope.$root.to_next = true;
    var new_pattern_id = $("#new_pattern_id_matching").val();

    $http.post('/apply-new-pattern', {
        '_csrf': 'csrf',
        'new_pattern_id': new_pattern_id
      })
      .success(function(response) {
        $scope.message_data = response.results;
        //matcher la liste des email avec le champs multi-tag des e-mails
        $scope.emails = [];
        if ($scope.message_data.emails && $scope.message_data.emails.length > 0) {
          angular.forEach($scope.message_data.emails, function(value, key) {
            $scope.emails.push({
              text: value
            });
          });
        }
        $modalCheckPattern.close();
      })
      .error(function(status) {
        console.log('error function applyPatternInCurrentData');
      });
  };

  /**********commentaire*/
  $scope.changeElemPatternDown = function(index) {
    $scope.$root.to_next = false;
    if ($scope.message_data.pattern_splitted.length == 1 || index == $scope.message_data.pattern_splitted.length - 1) {
      return false;
    }
    var temp = angular.copy($scope.message_data.pattern_splitted[index]);
    $scope.message_data.pattern_splitted[index] = $scope.message_data.pattern_splitted[index + 1];
    $scope.message_data.pattern_splitted[index + 1] = temp;
  };
  /**********commentaire*/
  $scope.changeElemPatternUp = function(index) {
    $scope.$root.to_next = false;
    if ($scope.message_data.pattern_splitted.length === 1 || index === 0) {
      return false;
    }
    var temp = angular.copy($scope.message_data.pattern_splitted[index]);
    $scope.message_data.pattern_splitted[index] = $scope.message_data.pattern_splitted[index - 1];
    $scope.message_data.pattern_splitted[index - 1] = temp;
  };
  /**********commentaire*/
  $scope.addPartVariable = function(key, value) {
    switch (key) {
      case "fr":
        $scope.message_data.translation.fr = $scope.message_data.translation.fr + " {" + value + "}";
        break;
      case "en":
        $scope.message_data.translation.en = $scope.message_data.translation.en + " {" + value + "}";
        break;
      default:
        console.log('no action to do !');
    }
  };
  /**********commentaire*/
  $scope.validationForm = function(message_data) {
    // here w ll FIXE ME TODO i vérify if type of pattern is here or not
    if (message_data.category_name === undefined || message_data.category_name === '') {
      alert("Le champ type de message est obligatoire !");
      return;
    }
    // nettoyer la liste des emails
    var emails = $scope.transforEmails($scope.emails);
    //ajouter les emails au data to send
    $scope.message_data.emails = angular.copy(emails);
    console.log($scope.message_data);
    $http.post("/validation-pattern", {
        '_csrf': 'csrf',
        'message_data': angular.toJson($scope.message_data)
      })
      .success(function(response) {
        $scope.notification();
      })
      .error(function(data, status) {
        console.log('Error');
      });
  };

  /**********commentaire*/
  $scope.requiredCheckPattern = function() {
    $scope.$root.to_next = false;
  };

  /*permet de transformer la liste des e-mails pour s'dapter au plugin ng-tags-input
   *@param emails: liste des objet[{text:""}]
   *@return : liste des chaines de caracatères
   */
  $scope.transforEmails = function(emails) {
    var emails_return = [];
    angular.forEach(emails, function(value, key) {
      emails_return.push(value.text);
    });
    return emails_return;
  };

});