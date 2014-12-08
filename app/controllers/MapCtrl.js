define([
  'app'
], function (app) {

  // define our map controller and register it with our app
  app.controller("MapCtrl", function($scope,$http){

    // expose a method for handling clicks
    $scope.click = function(e,map){
      $scope.center = [e.mapPoint.x,e.mapPoint.y];
 
      
      var point = e.mapPoint.x + ',' + e.mapPoint.y, 
          extent = map.extent.xmin +',' + map.extent.ymin +',' + map.extent.xmax +',' + map.extent.ymax;

      console.log($scope.visLayer);
      $http.get('http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Online/DistrictElevationPointer/MapServer/identify?f=json&layers=visible:'+$scope.visLayer+'&geometry='+point+'&tolerance=1&returnGeometry=false&mapExtent='+extent+'&imageDisplay=1280%2C629%2C96&geometryType=esriGeometryPoint&sr=102100&visible=true').success(function(data,error){
        $scope.elevation = data.results[0].attributes['Pixel Value'];

      });
    };


  });

});