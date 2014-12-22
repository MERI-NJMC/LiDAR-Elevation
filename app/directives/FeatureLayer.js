define([
  'app',
  'esri/layers/FeatureLayer',
  'esri/layers/ArcGISDynamicMapServiceLayer',
  "dojo/dom",
  "dojo/on",
  "dojo/query",
  "dojo/domReady!"
], function (app, FeatureLayer, ArcGISDynamicMapServiceLayer, dom, on, query) {
  app.directive('esriFeatureLayer', function(){
    // this object will tell angular how our directive behaves
    return {
      // only allow esriFeatureLayer to be used as an element (<esri-feature-layer>)
      restrict: 'E'
,
      // require the esriFeatureLayer to have its own controller as well an esriMap controller
      // you can access these controllers in the link function
      require: ["esriFeatureLayer", "^esriMap"],

      // replace this element with our template.
      // since we aren't declaring a template this essentially destroys the element
      replace: true,

      // define an interface for working with this directive
      controller: function($scope, $element, $attrs){

        // now is a good time to declare our FeautreLayer
        var layer = new ArcGISDynamicMapServiceLayer($attrs.url,
          {
            id: "layer",
            visible: true,
            opacity: 0.5,
          });
        //default layer ids
        var visibleLayerIDs = [0,1,2,4];
      


        console.log($scope.visLayer);
        layer.setVisibleLayers(visibleLayerIDs); //setVisibleLayers takes in an array of integers
        
        on(dom.byId('layerSelect'), 'change', function(evt) { //listening for any change on layer select
          console.log(evt);
          if (evt.target.value === '4') {
            visibleLayerIDs = [0,1,2,4];
            layer.setVisibleLayers(visibleLayerIDs);

          } else {
            visibleLayerIDs = [0,1,2,3];
            layer.setVisibleLayers(visibleLayerIDs);
          }
          
        });
        // lets expose a function to get the layer
        this.getLayer = function(){
          return layer;
        };
      },

      // now we can link our directive to the scope, but we can also add it to the map..
      link: function(scope, element, attrs, controllers){
        // controllers is now an array of the controllers from the 'require' option
        var layerController = controllers[0];
        var mapController = controllers[1];

        // now we can use the 'addLayer' method exposed on the controller
        // of the esriMap directive to add the layer to the map
        mapController.addLayer(layerController.getLayer());
      }
    };
  });
});