define([
  'app',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/graphic',
  'esri/geometry/screenUtils',
  'dojo/_base/Color',
  'dojo/dom-style',
  'dojo/domReady!'
  

], function (app, SimpleMarkerSymbol, Graphic, screenUtils, Color, domStyle) {

  //yo james 
  // define our map controller and register it with our app
  app.controller("MapCtrl", function($scope,$http){

    // expose a method for handling clicks
    $scope.click = function(e,map){
      $scope.center = [e.mapPoint.x,e.mapPoint.y];
          

      
 
      
      var point = e.mapPoint.x + ',' + e.mapPoint.y, 
          extent = map.extent.xmin +',' + map.extent.ymin +',' + map.extent.xmax +',' + map.extent.ymax;
      //$scope.point = 'X: ' + e.mapPoint.x + 'Y: ' + e.mapPoint.y;
      $scope.x =  e.mapPoint.x;
      $scope.y =  e.mapPoint.y;
      map.graphics.clear();
      var symbol = new SimpleMarkerSymbol()
      .setStyle("circle")
      .setColor(new Color([0,0,255,0.5]));
      var graphic = new Graphic(e.mapPoint, symbol);
      map.graphics.add(graphic);
          

      console.log($scope.visLayer);
      $http.get('http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Online/DistrictElevationPointer/MapServer/identify?f=json&layers=visible:'+$scope.visLayer+'&geometry='+point+'&tolerance=1&returnGeometry=false&mapExtent='+extent+'&imageDisplay=1280%2C629%2C96&geometryType=esriGeometryPoint&sr=102100&visible=true').success(function(data,error){
        $scope.elevation = data.results[0].attributes['Pixel Value'];
        console.log(data);

      });
    };


  });

});