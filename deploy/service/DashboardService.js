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

    /**
     * Get DataSources 
     */
    this.getDataSourcesSets = function () {
     
        return FrameworkUtils.Http_GET(baseUrl + "api/datasource/getsets").then((data) => {
                       
            //#2 - pick first service
            const serviceDataSource = data.data;
            
            let results = [];

            serviceDataSource.forEach(sourceItem => {
                let newSource = Object.assign( new DatasourceItem, { 
                    name : sourceItem.name,
                    description : sourceItem.description,
                    selected : sourceItem.selected,    
                    metaDataEntryId: sourceItem.MetadataEntryId
                })

                // #2.1 - iterate data sources
                sourceItem.itens.forEach(setItem => {
                    let newSet = Object.assign( new DatasetItem(), {
                        name : setItem.name,
                        description : setItem.description,
                        selected : setItem.selected,    
                        metaDataEntryId: setItem.MetadataEntryId
                    })

                    newSource.itens.push(newSet);

                    // #2.2 - iterate data fields
                    setItem.itens.forEach(fieldItem => {
                        let newField = Object.assign( new DatafieldItem(), {
                            name : fieldItem.name,
                            description : fieldItem.description,
                            selected : fieldItem.selected,    
                            metaDataEntryId: fieldItem.MetadataEntryId,
                            serviceId: fieldItem.serviceId
                        })
                        newSet.itens.push(newField);
                    })

                })
                results.push(newSource)
            })

            return {data: results };
        })

     
        return Promise.resolve( (()=> {

            //#1 - Data sets
            const data = this.getSets;
            
            //#2 - pick first service
            const serviceDataSource = data[0];
            
            let results = [];

            serviceDataSource.itens.forEach(sourceItem => {
                let newSource = Object.assign( new DatasourceItem, { 
                    name : sourceItem.name,
                    description : sourceItem.description,
                    selected : sourceItem.selected,    
                    metaDataEntryId: sourceItem.MetadataEntryId
                })

                // #2.1 - iterate data sources
                sourceItem.itens.forEach(setItem => {
                    let newSet = Object.assign( new DatasetItem(), {
                        name : setItem.name,
                        description : setItem.description,
                        selected : setItem.selected,    
                        metaDataEntryId: setItem.MetadataEntryId
                    })

                    newSource.itens.push(newSet);

                    // #2.2 - iterate data fields
                    setItem.itens.forEach(fieldItem => {
                        let newField = Object.assign( new DatafieldItem(), {
                            name : fieldItem.name,
                            description : fieldItem.description,
                            selected : fieldItem.selected,    
                            metaDataEntryId: fieldItem.MetadataEntryId
                        })
                        newSet.itens.push(newField);
                    })

                })
                results.push(newSource)
            })

            
            return this.sleep(5).then((result)=>{
                return {data :results};
            });




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

    /**
     * Get all availble Dashboards
     * [{"Id":13,"Name":"chartSet1"},{"Id":14,"Name":"chartSet1"}]
     */
    this.getDashboards = function(){
        return FrameworkUtils.Http_GET(baseUrl + "api/ChartSet/GetDashBoards").then((data) => {
            return data.data.map(dashboard => Object.assign(new DashboardItem(), { id: dashboard.Id, title: dashboard.Name }) )
        })            

    }

    /**
     * Get Itens of Dashboard
     */
    this.getDashboardItems = function(id){
        return FrameworkUtils.Http_GET(baseUrl + `api/chartConfig/GetDashBoardItens?DashBoardId=${id}`).then((data) => {
            return data.data.map(chartConfig => Object.assign(new ChartConfigItem(), {                
                name: chartConfig.Name,
                description: chartConfig.Description,
                chartSetId: chartConfig.ChartSetId,
                chartType: chartConfig.ChartType,
                backgroundColor: chartConfig.BackGroundColor,
                color: chartConfig.Color,
                posX: chartConfig.PosX,
                posY: chartConfig.PosY,
                width: chartConfig.Width,
                heigth: chartConfig.Heigth,
                fields: chartConfig.Fields,
                chartConfigId: chartConfig.ChartConfigId
            }))
            
        })
    }


    /**
     * Create dashboard
     */
    this.createDashboard = function(name){
        return FrameworkUtils.Http_POST(baseUrl + `api/ChartSet/Create?name=${name}`).then((data) => {
            if(data.data)
                return Object.assign(new DashboardItem(), { id: data.data, title: name });
        })     
    }

    /**
     * Delete dashboard
     */
    this.deleteDashboard = function(id){
        return FrameworkUtils.Http_POST(baseUrl + `api/ChartSet/Delete?chartSetId=${id}`).then((data) => {
            console.log(data)
        })     
    }

    /**
     * Fetch Chart Result
     */
    this.fecthChartResult = function() {}

    /**
     * Fetch Chart Result By Dates
     */
    this.fecthChartResultByDates = function(startDate, endDate, fieldsID = []) {
      // setup param to send
      const param = {        
        MetadataEntriesIds: fieldsID,
        StartingDate: startDate,
        EndingDate: endDate        
      }
       
      return FrameworkUtils.Http_POST(baseUrl + 'api/DataEntries/GetChartDataEntriesByDates', param).then((data) => {
        if(data.data){
          return data.data;          
        }         

        return [];
      })   
    }

    /**
     * Create chart config
     */
    this.createChart = function(chartConfig){
      // setup param to send
      const param = chartConfig;
       
      return FrameworkUtils.Http_POST(baseUrl + '/api/ChartConfig/Create', param).then((data) => {
        if(data.data){
          return data.data          
        }        
        return undefined;
      })   
    }

    /**
     * Update chart config
     */
    this.updateChart = function(chartConfig){
      // setup param to send
      const param = chartConfig;
       
      return FrameworkUtils.Http_POST(baseUrl + '/api/ChartConfig/Update', param).then((data) => {
        if(data.data){
          return data.data          
        }        
        return undefined;
      })   
    }

    /**
     * Get available chartConfig types to
     * build a new chart
     */
    this.getChartItemsConfigToBuild = function () {
      return FrameworkUtils.Http_GET(baseUrl + '/api/ChartConfig/GetChartTypes').then((data) => {
        let result = [];
        let alreadyMapped = [];  
        data.data.forEach(chartType => {                  
          if(!alreadyMapped.includes(chartType.name)){
            result.push(
                Object.assign(new ChartConfigItem(), {   
                  chartType: chartType.name
              })
            )
            // mark as mapped
            alreadyMapped.push(chartType.name)
          }          
      })

      return { data: result};
        
    })

      
        return Promise.resolve({ data: [
            { type: 'pie_01', icon: 'fa-pie-chart' },
            { type: 'pie_02', icon: 'fa-pie-chart' },
            { type: 'pie_03', icon: 'fa-pie-chart' },
            { type: 'pie_04', icon: 'fa-pie-chart' },
            { type: 'pie_05', icon: 'fa-pie-chart' },
            { type: 'pie_06', icon: 'fa-pie-chart' }

        ] });

      

       
    }

  
    /**
     * Mockups
     */
    this.getSets = [
        {
          "type": 1,
          "name": "SRC01EUA_APPLE",
          "description": "SRC01EUA_APPLE",
          "selected": false,
          "itens": [
            {
              "type": 2,
              "name": "SRV01EUA_APPLE",
              "description": "SRV01EUA_APPLE",
              "selected": false,
              "itens": [
                {
                  "type": 3,
                  "name": "DB Size",
                  "description": "DB Size",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Allocated (MB)",
                      "description": "Allocated (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 8
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": true,
                      "itens": [],
                      "MetadataEntryId": 9
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": true,
                      "itens": [],
                      "MetadataEntryId": 10
                    }
                  ],
                  "MetadataEntryId": 7
                },
                {
                  "type": 3,
                  "name": "Job",
                  "description": "Job",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Count Error",
                      "description": "Count Error",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 19
                    }
                  ],
                  "MetadataEntryId": 18
                },
                {
                  "type": 3,
                  "name": "CPU Utilization",
                  "description": "CPU Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Number Core",
                      "description": "Number Core",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 26
                    },
                    {
                      "type": 4,
                      "name": "Percent",
                      "description": "Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 27
                    }
                  ],
                  "MetadataEntryId": 25
                },
                {
                  "type": 3,
                  "name": "Memory Utilization",
                  "description": "Memory Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Installed (MB)",
                      "description": "Installed (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 34
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 35
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 36
                    }
                  ],
                  "MetadataEntryId": 33
                },
                {
                  "type": 3,
                  "name": "Page File Checks",
                  "description": "Page File Checks",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Deviation",
                      "description": "Deviation",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 45
                    },
                    {
                      "type": 4,
                      "name": "Total File (MB)",
                      "description": "Total File (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 46
                    }
                  ],
                  "MetadataEntryId": 44
                }
              ],
              "MetadataEntryId": null
            }
          ],
          "MetadataEntryId": null
        },
        {
          "type": 1,
          "name": "SRC02PRT_APPLE",
          "description": "SRC02PRT_APPLE",
          "selected": false,
          "itens": [
            {
              "type": 2,
              "name": "SRV01PRT_APPLE",
              "description": "SRV01PRT_APPLE",
              "selected": false,
              "itens": [
                {
                  "type": 3,
                  "name": "DB Size",
                  "description": "DB Size",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Allocated (MB)",
                      "description": "Allocated (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 54
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 55
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 56
                    }
                  ],
                  "MetadataEntryId": 53
                },
                {
                  "type": 3,
                  "name": "Job",
                  "description": "Job",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Count Error",
                      "description": "Count Error",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 65
                    }
                  ],
                  "MetadataEntryId": 64
                },
                {
                  "type": 3,
                  "name": "CPU Utilization",
                  "description": "CPU Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Number Core",
                      "description": "Number Core",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 72
                    },
                    {
                      "type": 4,
                      "name": "Percent",
                      "description": "Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 73
                    }
                  ],
                  "MetadataEntryId": 71
                },
                {
                  "type": 3,
                  "name": "Memory Utilization",
                  "description": "Memory Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Installed (MB)",
                      "description": "Installed (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 80
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 81
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 82
                    }
                  ],
                  "MetadataEntryId": 79
                },
                {
                  "type": 3,
                  "name": "Page File Checks",
                  "description": "Page File Checks",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Deviation",
                      "description": "Deviation",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 91
                    },
                    {
                      "type": 4,
                      "name": "Total File (MB)",
                      "description": "Total File (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 92
                    }
                  ],
                  "MetadataEntryId": 90
                }
              ],
              "MetadataEntryId": null
            }
          ],
          "MetadataEntryId": null
        },
        {
          "type": 1,
          "name": "SRC03BRA_APPLE",
          "description": "SRC03BRA_APPLE",
          "selected": false,
          "itens": [
            {
              "type": 2,
              "name": "SRV05BRA_APPLE",
              "description": "SRV05BRA_APPLE",
              "selected": false,
              "itens": [
                {
                  "type": 3,
                  "name": "DB Size",
                  "description": "DB Size",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Allocated (MB)",
                      "description": "Allocated (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 100
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 101
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 102
                    }
                  ],
                  "MetadataEntryId": 99
                },
                {
                  "type": 3,
                  "name": "Job",
                  "description": "Job",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Count Error",
                      "description": "Count Error",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 111
                    }
                  ],
                  "MetadataEntryId": 110
                },
                {
                  "type": 3,
                  "name": "CPU Utilization",
                  "description": "CPU Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Number Core",
                      "description": "Number Core",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 118
                    },
                    {
                      "type": 4,
                      "name": "Percent",
                      "description": "Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 119
                    }
                  ],
                  "MetadataEntryId": 117
                },
                {
                  "type": 3,
                  "name": "Memory Utilization",
                  "description": "Memory Utilization",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Installed (MB)",
                      "description": "Installed (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 126
                    },
                    {
                      "type": 4,
                      "name": "Used (MB)",
                      "description": "Used (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 127
                    },
                    {
                      "type": 4,
                      "name": "Used Percent",
                      "description": "Used Percent",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 128
                    }
                  ],
                  "MetadataEntryId": 125
                },
                {
                  "type": 3,
                  "name": "Page File Checks",
                  "description": "Page File Checks",
                  "selected": false,
                  "itens": [
                    {
                      "type": 4,
                      "name": "Deviation",
                      "description": "Deviation",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 137
                    },
                    {
                      "type": 4,
                      "name": "Total File (MB)",
                      "description": "Total File (MB)",
                      "selected": false,
                      "itens": [],
                      "MetadataEntryId": 138
                    }
                  ],
                  "MetadataEntryId": 136
                }
              ],
              "MetadataEntryId": null
            }
          ],
          "MetadataEntryId": null
        }
      ]
    
}]);

