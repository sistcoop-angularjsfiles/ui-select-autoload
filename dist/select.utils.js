'use strict';

(function(){

    var module = angular.module('ui.select.utils', ['ui.select']);

    module.directive('uiAutofocus', function($timeout) {
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
    });

    module.directive('uiSelectAutoload', function(Util) {
        return {
            restrict: 'E',
            require: '^uiSelect',
            scope: {
                //@ one way binding; = two way binding
                pkName: '@',
                comparator: '=',
                ignoreCase: '@'
            },
            controller: function($scope) {
                if(angular.isDefined($scope.comparator) && $scope.comparator){
                    var listener = $scope.$parent.$watch('$select.items',function(newValue, oldValue){
                        if(angular.isDefined(newValue) && newValue.length){
                            var items = $scope.$parent.$select.items;
                            var selected = Util.getElementOfArray(items, $scope.pkName, $scope.comparator, $scope.ignoreCase);
                            $scope.$parent.$select.ngModel.$setViewValue(selected);
                            $scope.$parent.$select.ngModel.$render();
                            //unwatch listener
                            listener();
                        }
                    }, true);
                }

                $scope.$parent.$watch('$select.ngModel.$modelValue', function(newValue, oldValue){
                    if(angular.isDefined(newValue)){
                        $scope.comparator = $scope.$parent.$select.ngModel.$modelValue[$scope.pkName];
                    }
                }, true);
            }
        };
    });

})();