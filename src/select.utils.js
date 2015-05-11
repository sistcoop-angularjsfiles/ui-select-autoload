'use strict';

(function(){

    var module = angular.module('ui.select.utils', ['ui.select']);

    module.directive('uiAutofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: 'uiSelect',
            link: function(scope, elem, attr) {
                if(elem.hasClass('ui-select-bootstrap')){
                    if(elem[0].children.length == 4){
                        $timeout(function() {
                            if(attr.uiAutofocus == 'open')
                                elem.find("button.ui-select-match").click();
                            elem.find("input.ui-select-focusser").focus();
                        }, 0);
                    }
                }
            }
        };
    }]);

    module.directive('uiSelectAutoload', function() {
        return {
            restrict: 'E',
            require: '^uiSelect',
            scope: {
                //@ one way binding; = two way binding
                pkName: '@',
                comparator: '=',
                ignoreCase: '@'
            },
            controller: ['$scope', function($scope) {

                //Devuelve un elemento de un Array
                var getElementOfArray = function(object, attributeName, toCompare, ignoreCase){
                    if(object.length){
                        for(var i = 0; i<object.length; i++){
                            var attribute1 = angular.isDefined(ignoreCase) ? object[i][attributeName.toString()].toLowerCase() : object[i][attributeName.toString()];
                            var attribute2 = angular.isDefined(ignoreCase) && toCompare ? toCompare.toLowerCase() : toCompare;
                            if(attribute1 == attribute2)
                                return object[i];
                        }
                    }
                    return undefined;
                };

                //Si el comparador está definido
                if(angular.isDefined($scope.comparator) && $scope.comparator)
                {

                    //WATCH A LA LISTA DE ITEMS
                    var listener = $scope.$parent.$watch('$select.items',function(newValue, oldValue){
                        if(angular.isDefined(newValue) && newValue.length){
                            var items = $scope.$parent.$select.items;
                            var selected = getElementOfArray(items, $scope.pkName, $scope.comparator, $scope.ignoreCase);
                            $scope.$parent.$select.ngModel.$setViewValue(selected);
                            $scope.$parent.$select.ngModel.$render();
                            //unwatch listener
                            listener();
                        }
                    }, true);

                }
                //Si el comparador recien esta siendo cargado le añadimos un watch para esperar su carga
                else
                {
                    //watch a el comparador
                    var listener = $scope.$watch('comparator',function(newValue, oldValue){
                        if(angular.isDefined(newValue)){

                            //WATCH A LA LISTA DE ITEMS
                            var listener = $scope.$parent.$watch('$select.items',function(newValue, oldValue){
                                if(angular.isDefined(newValue) && newValue.length){
                                    var items = $scope.$parent.$select.items;
                                    var selected = getElementOfArray(items, $scope.pkName, $scope.comparator, $scope.ignoreCase);
                                    $scope.$parent.$select.ngModel.$setViewValue(selected);
                                    $scope.$parent.$select.ngModel.$render();
                                    //unwatch listener
                                    listener();
                                }
                            }, true);

                        }
                    }, true);
                }

                $scope.$parent.$watch('$select.ngModel.$modelValue', function(newValue, oldValue){

                    if(angular.isDefined(newValue)){
                        $scope.comparator = $scope.$parent.$select.ngModel.$modelValue[$scope.pkName];
                    }

                }, true);


            }]
        };
    });

})();