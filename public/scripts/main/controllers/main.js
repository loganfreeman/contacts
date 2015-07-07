/* globals confirm */
(function() {
  'use strict';

  function MainCtrl($scope, $filter, AlertService, ContactsService) {



    /**
     * Reset the form values
     */
    $scope.reset = function() {
      $scope.contact = {
        name: '',
        address: '',
        phone: ''
      };
    };

    /**
     * Returns the number page based in params
     * @return {[type]} [description]
     */
    $scope.numberOfPages = function() {
      return Math.ceil($scope.listContacts.length / $scope.pageSize);
    };

    /**
     * Add a listContacts in $scope.listContacts
     */
    $scope.create = function(contact) {
      $scope.listContacts = ContactsService.create(contact);
      AlertService.add('success', 'Contact "' + contact.name + '" created with success!', 5000);
    };

    /**
     * Editing a individual contact
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    $scope.edit = function(key) {
      $scope.contact = $filter('filter')($scope.listContacts, {
        _id: key
      })[0];
      window.scrollTo(0, 0);
    };

    /**
     * Update item
     * @param  {Object} item [description]
     * @return {[type]}      [description]
     */
    $scope.update = function(item) {
      $scope.listContacts = ContactsService.update(item);
      AlertService.add('success', 'Contact "' + item.name + '" updated with success!', 5000);
    };

    /**
     * Add/edit method abstration
     * @param  {Object} item [description]
     * @return {[type]}      [description]
     */
    $scope.save = function(item) {
      if (typeof item._id !== 'undefined') {
        $scope.update(item);
      } else {
        $scope.create(item);
      }
      $scope.reset();
    };

    /**
     * [delete description]
     * @param  {Integer} index        [description]
     * @param  {Boolean} confirmation [description]
     * @return {Boolean}              [description]
     */
    $scope.delete = function(index, confirmation) {
      confirmation = (typeof confirmation !== 'undefined') ? confirmation : true;
      if (confirmDelete(confirmation)) {
        var message,
          item = ContactsService.delete(index);
        if (!!item) {
          message = 'Contact "' + item.name + '" with id "' + item._id + '" was removed of your contact\'s list';
          AlertService.add('success', message, 5000);
          $scope.listContacts = ContactsService.getListItems();
          return true;
        }
        AlertService.add('error', 'Houston, we have a problem. This operation cannot be executed correctly.', 5000);
        return false;
      }
    };

    /**
     * Method for access "window.confirm" function
     * @param  {Boolean} confirmation [description]
     * @return {Boolean}              [description]
     */
    var confirmDelete = function(confirmation) {
      return confirmation ? confirm('This action is irreversible. Do you want to delete this contact?') : true;
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
          return !(!!searchText) ||_.contains(item.name, searchText) || _.contains(item.address, searchText) || _.contains(item.phone, searchText)
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
      enablePaging: true,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions
    };


    /**
     * Method for class initialization
     * @return {[type]} [description]
     */
    $scope.init = function() {
      $scope.listContacts = $scope.filteredData = ContactsService.getListItems();
      $scope.reset();
      $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    };

    $scope.init();

  }

  angular.module('angularContactsListApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$filter', 'AlertService', 'ContactsService'];

}());