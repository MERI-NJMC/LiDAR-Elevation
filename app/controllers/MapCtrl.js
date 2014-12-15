define([
  'app',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/graphic',
  'esri/geometry/screenUtils',
  'dojo/_base/Color',
  'dojo/dom-style',
  'esri/geometry/Point', //for the conversion
  'esri/geometry', //for conversion
  'esri/geometry/webMercatorUtils',
  'dojo/domReady!'
  

], function (app, SimpleMarkerSymbol, Graphic, screenUtils, Color, domStyle, Point, geometry,webMercatorUtils) {

  //yo james 
  // define our map controller and register it with our app
  app.controller("MapCtrl", function($scope,$http){

    // expose a method for handling clicks
    $scope.click = function(e,map){
      //$scope.center = [e.mapPoint.x,e.mapPoint.y]; //centers to where clicked
      console.log(e);



      var point = e.mapPoint.x + ',' + e.mapPoint.y, 
          extent = map.extent.xmin +',' + map.extent.ymin +',' + map.extent.xmax +',' + map.extent.ymax;
     
      
      //var prelat = e.mapPoint.x 
      //var prelon = e.mapPoint.y

      var mp = esri.geometry.webMercatorToGeographic(e.mapPoint);

      $scope.x = mp.x;
      $scope.y = mp.y;


      

  
      

      /*
      $scope.x =  e.mapPoint.x;
      $scope.y =  e.mapPoint.y;
      console.log($scope.x);
      console.log($scope.y);
      */
      
      map.graphics.clear();
      var symbol = new SimpleMarkerSymbol()
      .setStyle("cross")
      .setColor(new Color([0,0,255,0.5]));
      var graphic = new Graphic(e.mapPoint, symbol);
      map.graphics.add(graphic);
          

      console.log($scope.visLayer);
      $http.get('http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Online/DistrictElevationPointer/MapServer/identify?f=json&layers=visible:3,4&geometry='+point+'&tolerance=1&returnGeometry=false&mapExtent='+extent+'&imageDisplay=1280%2C629%2C96&geometryType=esriGeometryPoint&sr=102100&visible=true').success(function(data,error){
        $scope.elevationHH = data.results[0].attributes['Pixel Value'];
        $scope.elevationBE = data.results[1].attributes['Pixel Value'];
        console.log(data);
        

      });
    };


  });

});

