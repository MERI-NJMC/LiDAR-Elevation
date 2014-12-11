define([
  'app',
  'esri/map',
  'esri/geometry/Point',
  'esri/dijit/LocateButton',
  'esri/dijit/Geocoder',
  'dojo/domReady!'

], function (app, Map, Point, LocateButton, Geocoder) {

  // register a new directive called esriMap with our app
  app.directive('esriMap', function(){
    // this object will tell angular how our directive behaves
    return {
      // only allow esriMap to be used as an element (<esri-map>)
      restrict: 'E',

      // this directive shares $scope with its parent (this is the default)
      scope: false,

      // define how our template is compiled this gets the $element our directive is on as well as its attributes ($attrs)
      compile: function($element, $attrs){
        // remove the id attribute from the main element
        $element.removeAttr("id");

        // append a new div inside this element, this is where we will create our map
        $element.append("<div id=" + $attrs.id + "></div>");

        // since we are using compile we need to return our linker function
        // the 'link' function handles how our directive responds to changes in $scope
        return function (scope, element, attrs, controller){
          scope.$watch("center", function (newCenter, oldCenter) {
            if(newCenter !== oldCenter){
              controller.centerAt(newCenter);
            }
          });
        };
      },

      // even though $scope is shared we can declare a controller for manipulating this directive
      // this is great for when you need to expose an API for manipulaiting your directive
      // this is also the best place to setup our map
      controller: function($scope, $element, $attrs){
        // setup our map options based on the attributes and scope
        var mapOptions = { //takes in all attributes from esri map element from index.html 
          center: ($attrs.center) ? $attrs.center.split(",") : $scope.center,
          zoom: ($attrs.zoom) ? $attrs.zoom : $scope.zoom,
          basemap: ($attrs.basemap) ? $attrs.basemap : $scope.basemap
        };

        $scope.visLayer = 4;
        $scope.visLayer4 = true;
        $scope.visLayer3 = false;

        console.log($scope.visLayer4);

        // declare our map
        var map = new Map($attrs.id, mapOptions); //$attrs.id is where the map will be(the map ID from index.html), 

        //geolacte gos button
        var geoLocate = new LocateButton({
          map: map,
        }, "LocateButton");

        geoLocate.startup();

        geocoder = new esri.dijit.Geocoder({
          map: map,
          autoComplete: true,
          
        },"Search");
        geocoder.startup();
      



        // start exposing an API by setting properties on "this" which is our controller
        // lets expose the "addLayer" method so child directives can add themselves to the map
        this.addLayer = function(layer){
          return map.addLayer(layer);
        };

        // lets expose a version of centerAt that takes an array of [lng,lat]
        this.centerAt = function(center){
          var point = new Point({
            x: center[0],
            y: center[1],
            spatialReference: {
              wkid:102100
            }
          });

          map.centerAt(point);
        };

        // listen for click events and expost them as broadcasts on the scope and suing the scopes click handler
        map.on("click", function(e){
       
          
          // emit a message that bubbles up scopes, listen for it on your scope
          $scope.$emit("map.click", e);

          // use the scopes click fuction to handle the event
          $scope.$apply(function() {
            $scope.click.call($scope, e, map);
          });
        });
      }
    };
  });
});