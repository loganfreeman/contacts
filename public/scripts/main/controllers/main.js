/* globals confirm */
(function() {
  'use strict';

  function MainCtrl($scope, $filter, ContactsService, AlertService, SweetAlert, $modal, $log) {

    $scope.footerTemplate = '<div class="ngFooterTotalItems"><span class="ngLabel">{{i18n.ngTotalItemsLabel}} {{maxRows()}}</span><span ng-show="filterText.length > 0" class="ngLabel">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span></div>';


    /**
     * Reset the form values
     */
    $scope.reset = function() {
      $scope.contact = {
        firstname: '',
        lastname: '',
        phone: '',
        address: ''
      };
    };

    $scope.reload = function() {
      Promise.resolve(ContactsService.getListItems())
        .then(function(result) {
          $scope.init(result.data);
        });
    }


    /**
     * Add a listContacts in $scope.listContacts
     */
    $scope.create = function(form) {
      Promise.resolve(ContactsService.create($scope.contact))
        .then(function(result) {
          console.log(result.data);
          $scope.reload();
        })

      .catch(function(e) {
        $scope.errors = e.data.errors;
        angular.forEach($scope.errors, function(error, field) {
          form[field].$setValidity('mongoose', false);
        });
      });
    };



    /**
     * Update item
     * @param  {Object} item [description]
     * @return {[type]}      [description]
     */
    $scope.edit = function(item, index) {
      var modalInstance = $modal.open({
        templateUrl: 'contact.html',
        controller: function($scope, $modalInstance) {
          $scope.contact = item;


          $scope.ok = function() {
            $modalInstance.close($scope.contact);
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          };
        },

      });

      modalInstance.result.then(function(contact) {
        //$scope.selected = selectedItem;
        //$scope.activeUser.stacks.push( selectedItem.stack );
        // $scope.activeUser.instances.push( selectedItem.instance );
        ContactsService
          .save(contact)
          .then(function(result) {
            console.log(result.data);
            $scope.reload();
          });

      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };



    /**
     * [delete description]
     * @param  {Integer} index        [description]
     * @param  {Boolean} confirmation [description]
     * @return {Boolean}              [description]
     */
    $scope.remove = function(item, index) {
      SweetAlert.swal({
        title: 'Are you sure?',
        html: true,
        text: '<pre class=\'code\'>' + JSON.stringify(item) + '</pre>',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, do it!',
        closeOnConfirm: true
      }, function(isConfirm) {
        if (isConfirm) {


          ContactsService.delete(item._id)
            .then(function(result) {
              $scope.reload();
            })

        }
      })
    };



    /**
     * grid options
     */

    $scope.filterOptions = {
      filterText: "",
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [5, 10, 50],
      pageSize: 5,
      currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
      var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.filteredData = pagedData;
      $scope.totalServerItems = data.length;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
      setTimeout(function() {
        var data = _.filter($scope.listContacts, function(item) {
          return !(!!searchText) || _.contains(item.email, searchText) || _.contains(item.address, searchText) || _.contains(item.phone, searchText)
        })
        $scope.setPagingData(data, page, pageSize);
      }, 100);
    };


    $scope.$watch('pagingOptions', function(newVal, oldVal) {
      if (newVal.pageSize !== oldVal.pageSize || newVal.currentPage !== oldVal.currentPage) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.gridOptions = {
      data: 'filteredData',
      enableColumnResize: true,
      multiSelect: false,
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      rowTemplate: '<div style="height: 100%" >' +
        '<div ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
        '<div ng-cell></div>' +
        '</div>' +
        '</div>',
      columnDefs: [{
          field: 'email',
          displayName: 'EMail'
        }, {
          field: 'firstname',
          displayName: 'First Name'
        }, {
          field: 'lastname',
          displayName: 'Last Name'
        }, {
          field: 'address',
          displayName: 'address'
        }, {
          displayName: 'Actions',
          minWidth: 250,
          width: 250,
          cellTemplate: '<button class="btn btn-primary" ng-click="edit(row.entity, row.rowIndex)" ><i class="fa fa-edit"></i> Modify</button>&nbsp&nbsp<button class="btn btn-danger" ng-click="remove(row.entity, row.rowIndex)"><i class="fa fa-trash-o"></i> Delete</button>'
        }



      ]
    };


    /**
     * Method for class initialization
     * @return {[type]} [description]
     */
    $scope.init = function(items) {
      $scope.listContacts = $scope.filteredData = items;
      $scope.reset();
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    };

    Promise.resolve(ContactsService.getListItems())
      .then(function(result) {
        $scope.init(result.data);
      });

  }

  angular.module('angularContactsListApp')
    .controller('MainCtrl', MainCtrl)
    .service('ContactsService', function($http) {
      this.getListItems = function() {
        return $http.get('/api/contacts');
      }

      this.create = function(contact) {
        return $http.post('/api/contacts', contact)
      }

      this.delete = function(id) {
        return $http.delete('/api/contact/' + id);
      }

      this.save = function(contact) {
        return $http.put('/api/contact/' + contact._id, contact);
      }
    })
    .service('AlertService', function(SweetAlert) {
      this.alert = function(title, message) {
        return SweetAlert.swal({
          title: title,
          text: message
        });
      }
    })
    .directive('mongooseError', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          element.on('keydown', function() {
            return ngModel.$setValidity('mongoose', true);
          });
        }
      };
    });


}());