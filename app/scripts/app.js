/*global L:false */
/*global window:false */
/*global document:false */
/*global ccBuildings:false */
/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  app.displayInstalledToast = function() {
    document.querySelector('#caching-complete').show();
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
      
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
      app.init();
  });

  // Close drawer after menu item is selected if drawerPanel is narrow
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector('#paperDrawerPanel');
    if (drawerPanel.narrow) {
      drawerPanel.closeDrawer();
    }
  };
    
  app.init = function(){
    var buildingListEl = document.getElementById('buildingList'),
        docfrag = document.createDocumentFragment(),
        mymap = L.map('map'),
        markers = L.layerGroup().addTo(mymap),
        initialCenter = [38.8486555, -104.824],
        initialZoom = 17;
    mymap.setView(initialCenter, initialZoom);
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18,
        minZoom: 16
    }).addTo(mymap);
      var locateControl = L.control.locate({drawCircle: false, markerStyle: {className: 'myLoc'}}).addTo(mymap);
      ccBuildings.features.forEach(function(val){
       var name = val.properties.NAME,
           a = document.createElement("a"),
           span = document.createElement("span");
          span.textContent = name;
          a.appendChild(span);
          a.setAttribute('href', '#');
          a.addEventListener("click", function(){showBuilding(val);}, false);
          docfrag.appendChild(a);
          
      });
      buildingListEl.querySelector('.content').appendChild(docfrag);
      
      var showBuilding = function(val){
          console.log(val);
          var coords = [val.geometry.coordinates[1], val.geometry.coordinates[0]],
              bldg = L.marker(coords).bindPopup(val.properties.NAME);
          document.querySelector('paper-drawer-panel').closeDrawer();
          markers.clearLayers();
          markers.addLayer(bldg);
          mymap.setView(coords);
          bldg.openPopup();
      };
      
      /**** GEOLOCATION ****/
      var geoLocToggle = document.getElementById('geoLocToggle');
      geoLocToggle.addEventListener("click", function(){
          locateControl.start();
      }, false);
      
      /**** RESET VIEW ****/
      var resetViewControl = document.getElementById('resetViewControl');
      resetViewControl.addEventListener("click", function(){
          mymap.setView(initialCenter, initialZoom);
      }, false);
      
      
  };
  

})(document);
