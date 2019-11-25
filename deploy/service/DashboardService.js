/**
 * This Service will hold all the needed Requests
 * and some manipulations to return to Frontend the
 * Dashboard data
 */
//var baseUrl = ''
var baseUrl='https://10.1.0.25/'
app.service('DashboardService', ['$http', 'FrameworkUtils', function($http, FrameworkUtils) {

    this.sleep = function(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    this.getDataSourcesSets = function () {
        return Promise.resolve( (()=> {
            let datasources = [];
            

            datasources.push(
                new DatasourceItem('windows', 1, (()=>{
                 return [
                     new DatasetItem('Available_Physical_Memory', 2, []),
                     new DatasetItem('Backup Failure(Full Diff) 24 hrs', 2, [], true),
                     new DatasetItem('BAvailable Physical Memory(pct)', 2, [])                 
                ]                 
             })() )   
            );

            datasources.push(
                new DatasourceItem('windows-new', 1, (()=>{
                    return [
                        new DatasetItem('Available_Physical_Memory', 2, [], true),
                        new DatasetItem('Backup Failure(Full Diff) 24 hrs', 2, []),
                        new DatasetItem('BAvailable Physical Memory(pct)', 2, [])                 
                    ]                 
                })() )   
                );

            datasources.push(
                new DatasourceItem('windows-shecma', 1, (()=>{
                    return [
                        new DatasetItem('Available_Physical_Memory', 2, []),
                        new DatasetItem('Backup Failure(Full Diff) 24 hrs', 2, [], true),
                        new DatasetItem('BAvailable Physical Memory(pct)', 2, [], true)                 
                    ]                 
                })() )   
            );

            datasources.push(
                new DatasourceItem('azure db', 1, (()=>{
                    return [
                        new DatasetItem('Available_Physical_Memory', 2, []),
                        new DatasetItem('Backup Failure(Full Diff) 24 hrs', 2, [], true),
                        new DatasetItem('BAvailable Physical Memory(pct)', 2, [], true)                 
                    ]                 
                })() )   
            );


            datasources.push(
                new DatasourceItem('unix-shecma', 1, (()=>{
                    return [
                        new DatasetItem('Available_Physical_Memory', 2, []),
                        new DatasetItem('Backup Failure(Full Diff) 24 hrs', 2, [], true),
                        new DatasetItem('BAvailable Physical Memory(pct)', 2, [], true)                 
                    ]                 
                })() )   
            );

            return this.sleep(5).then((result)=>{
                return {data :datasources};
            });
            
            
            
        })());
        return $http.get(baseUrl + "api/datasource/getsets").then(
            function (data) {
                return data;
            })
    }

    this.getChartsToBuild = function () {
        return Promise.resolve({ data: [1,2,3,4,5] });
       
    }

  
    
}]);