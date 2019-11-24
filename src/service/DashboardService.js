/**
 * This Service will hold all the needed Requests
 * and some manipulations to return to Frontend the
 * Dashboard data
 */
//var baseUrl = ''
var baseUrl='https://10.1.0.25/'
app.service('DashboardService', ['$http', 'FrameworkUtils', function($http, FrameworkUtils) {


    this.getDataSourcesSets = function () {
        return $http.get(baseUrl + "api/datasource/getsets").then(
            function (data) {
                return data;
            })
    }

  
    
}]);