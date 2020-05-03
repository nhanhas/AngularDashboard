//Framework Utils

//#Remote
app.service('FrameworkUtils', ['$http', function($http) {

   /**
    * Remote Services Utils
    */
    //GET Type
    this.Http_GET  = function(serviceURL, access_token){        
        return $http({
                    method: 'GET',
                    url: serviceURL,
                    headers: { 'Athorization': 'Bearer ' + access_token }
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return 'error';
                });
    }

    //POST Type
    this.Http_POST  = function(serviceURL, data){        

        return $http({
                    method: 'POST',
                    data: data,
                    url: serviceURL
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return 'error';
                });
    }

    //POST Type (TOKEN)
    this.Http_POST_TOKEN  = function(serviceURL, data){        

        return $http({
                    method: 'POST',
                    data: data,
                    url: serviceURL,
                    headers: this.getHeaders()
                }).then(function successCallback(response) {
                    return response;
                }, function errorCallback(response) {
                    return 'error';
                });
    }


    /**
     * Basic Utils
     */
  
    //Parameters from QueryString 
    this.getParameterByName = function (name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    this.getHeaders = function(access_token = ''){
        /*return  {
            'Athorization': 'Bearer ' + access_token,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded'
        }*/
        return  {
            'Access-Control-Allow-Origin': true,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    // Get typeof object
    this.typeOf = function(obj){
        return obj.constructor.name;
    }

}]);



