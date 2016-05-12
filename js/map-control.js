window.onload = function() {
    
    // Instantiate new map object, place it in 'map' element -- Uses Leaflet.js
    var map_object = new L.Map('map',{
        center: [-34.0000, 18.5800],
        // Starting Point
        zoom: 12,
    });
    
    // Put layer data into a JS object
    var layerSource = {
        user_name: 'adi45',
        type: 'cartodb',
        sublayers: [{
            sql: "SELECT * FROM is_matrix_epsg4326_region",
            // IS Region -- Upgrade Category
            cartocss: '#is_matrix_epsg4326_region {polygon-opacity: 1;line-color: #FFCC00;line-width: 1;line-opacity: 1;} #is_matrix_epsg4326_region[upgrade_category="City land. Can be upgraded"] {polygon-fill: #A6CEE3;}#is_matrix_epsg4326_region[upgrade_category="National land. Can be upgraded"] {polygon-fill: #1F78B4;}#is_matrix_epsg4326_region[upgrade_category="Provincial land. Can be upgraded"] {polygon-fill: #B2DF8A;}#is_matrix_epsg4326_region[upgrade_category="Some constraints. May need to be relocated"] {polygon-fill: #33A02C;}',
            interactivity: "is_cluster, pocket_alias",
        }, 
        {
            sql: "SELECT * FROM is_matrix_epsg4326_region",
            // IS Region -- Temporary Sanitation
            cartocss: '#is_matrix_epsg4326_region{polygon-fill: #FFFFB2;polygon-opacity: 1;line-color: #FFF;line-width: 0.5;line-opacity: 1;}#is_matrix_epsg4326_region [ temporary_sanitation <= 100] {polygon-fill: #003973;line-color: #00fbff;line-width: 1;line-opacity: 1;}#is_matrix_epsg4326_region [ temporary_sanitation <= 80] {polygon-fill: #225ea8;line-color: #00fbff;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ temporary_sanitation <= 60] {polygon-fill: #1d91c0;line-color: #00fbff;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ temporary_sanitation <= 40] {polygon-fill: #41b6c4;line-color: #00fbff;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ temporary_sanitation <= 20] {polygon-fill: #7fcdbb;line-color: #00fbff;line-width: 1;line-opacity: 1}',
            interactivity: "is_cluster, pocket_alias",
        }, 
        {
            sql: "SELECT * FROM is_matrix_epsg4326_region",
            // IS Region -- Age
            cartocss: '#is_matrix_epsg4326_region {polygon-opacity: 1;line-color: #FFF;line-width: 0.5;line-opacity: 1;}#is_matrix_epsg4326_region[age_of_pocket="0 - 5 years"] {polygon-fill: #B40903;}#is_matrix_epsg4326_region[age_of_pocket="10 - 15 years"] {polygon-fill: #FFA300;}#is_matrix_epsg4326_region[age_of_pocket="15 - 20 years"] {polygon-fill: #A53ED5;}#is_matrix_epsg4326_region[age_of_pocket="5 - 10 years"] {polygon-fill: #FF5C00;}#is_matrix_epsg4326_region[age_of_pocket="> 20 years"] {polygon-fill: #0F3B82;}',
            interactivity: "is_cluster, pocket_alias",
        }, 
        {
            sql: "SELECT * FROM is_matrix_epsg4326_region",
            // IS Region -- Structure Count
            cartocss: '#is_matrix_epsg4326_region{polygon-fill: #F2D2D3;polygon-opacity: 1;line-color: #FFF;line-width: 0.5;line-opacity: 1;}#is_matrix_epsg4326_region [ structure_count <= 7963] {polygon-fill: #67000d;line-color: #d60000;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ structure_count <= 6370.4] {polygon-fill: #a50f15;line-color: #d60000;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ structure_count <= 4777.799999999999] {polygon-fill: #cb181d;line-color: #d60000;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ structure_count <= 3185.2] {polygon-fill: #ef3b2c;line-color: #d60000;line-width: 1;line-opacity: 1}#is_matrix_epsg4326_region [ structure_count <= 1592.6] {polygon-fill: #fb6a4a;line-color: #d60000;line-width: 1;line-opacity: 1}',
            interactivity: "is_cluster, pocket_alias",
        }]
    }
    
    // For storing the sublayers
    var sublayers = [];
    
    // Basemap pull tiles
    var basemap1 = L.tileLayer('https://maps.nlp.nokia.com/maptiler/v2/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?lg=eng&token=61YWYROufLu_f8ylE0vn0Q&app_id=qIWDkliFCtLntLma2e6O', {
        attribution: 'Nokia'
    }).addTo(map_object);
    // add new basemap option
    var basemap2 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: 'CartoDB'
    
    
    });
    
    
    
    // Basemap function
    // Add data layer to your map
    cartodb.createLayer(map_object, layerSource)
    .addTo(map_object)
    
    .done(function(layer) {
        
        var hovers = [];
        layer.bind('featureOver', function(e, latlon, pxPos, data, layer) {
            hovers[layer] = 1;
            if (_.any(hovers)) {
                $('#map').css('cursor', 'pointer');
            }
        });
        layer.bind('featureOut', function(m, layer) {
            hovers[layer] = 0;
            if (!_.any(hovers)) {
                $('#map').css('cursor', 'move');
            }
        });
        
        
        for (var i = 0; i < 4; i++) {
            sublayer = layer.getSubLayer(i);
            sublayer.setInteraction(true);
            sublayer.setInteractivity('is_cluster,pocket_alias,ratio_hhs_toilets');
            console.log("num layers", layer.getSubLayerCount());
            
            sublayer.on('featureClick', function(e, latlng, pos, data, layerNumber) {
                $('#dashboard').removeClass("hidden")
                cartodb.log.log(e, latlng, pos, data, layerNumber);
                $("#is_cluster").text(data.is_cluster);
                $("#pocket_alias").text(data.pocket_alias);
                $("#ratio_hhs_toilets").text(data.ratio_hhs_toilets);
            });
        }
        var legend = new cdb.geo.ui.Legend({
            type: "custom",
            data: [
            {
                name: "first 1",
                value: "#FFC926"
            }, 
            {
                name: "Category 2",
                value: "#76EC00"
            }, 
            {
                name: "Category 3",
                value: "#00BAF8"
            }, 
            {
                name: "Category 4",
                value: "#D04CFD"
            }
            ]
        });
        
        $('#map').append(legend.render().el);
        for (var i = 0; i < layer.getSubLayerCount(); i++) {
            sublayers[i] = layer.getSubLayer(i);
            //alert("Congrats, you added sublayer #" + i + "!");
        }
        
        
        
        // define ZIndex of the CartoDB layer
        layer.setZIndex(9000);
        // define basemap options
        var LayerActions = {
            satellite: function() {
                // if map_object has already a basemap, remove it and add a new one
                if (map_object.hasLayer(basemap1) || (map_object.hasLayer(basemap2))) {
                    map_object.removeLayer(basemap1);
                    map_object.removeLayer(basemap2);
                }
                
                map_object.addLayer(basemap1);
                return true;
            },
            // if map_object has already a basemap, remove it and add a new one
            positron: function() {
                if (map_object.hasLayer(basemap1) || (map_object.hasLayer(basemap2))) {
                    map_object.removeLayer(basemap1);
                    map_object.removeLayer(basemap2);
                }
                map_object.addLayer(basemap2);
                return true;
            }
        }
        $('#selector').change(function() {
            LayerActions[$(this).val()]();
        });
    
    })// end function
    
    .error(function(err) {
        console.log("error: " + err);
    });
    
    
    // Add button events Sublayer 0 - Upgrade Category
    var sublayer0Shown = true;
    $("#sublayer0").on('click', function() {
        sublayers[1].hide();
        sublayers[2].hide();
        sublayers[3].hide();
        sublayers[0].show();
        $('.cartodb-legend').addClass("hidden")
        var legend = new cdb.geo.ui.Legend({
            type: "custom",
            data: [
            {
                name: "Upgrade Category",
                value: "#FFC926"
            }, 
            {
                name: "Category 2",
                value: "#76EC00"
            }, 
            {
                name: "Category 3",
                value: "#00BAF8"
            }, 
            {
                name: "Category 4",
                value: "#D04CFD"
            }
            ]
        });
        $('#map').append(legend.render().el);
    });
    
    // Add button events Sublayer 1 - Temporary Sanitation
    var sublayer1Shown = true;
    $("#sublayer1").on('click', function() {
        sublayers[0].hide();
        sublayers[2].hide();
        sublayers[3].hide();
        sublayers[1].show();
        $('.cartodb-legend').addClass("hidden")
        var legend = new cdb.geo.ui.Legend({
            type: "custom",
            data: [
            {
                name: "Temporary Sanitation",
                value: "#FFC926"
            }, 
            {
                name: "Category 2",
                value: "#76EC00"
            }, 
            {
                name: "Category 3",
                value: "#00BAF8"
            }, 
            {
                name: "Category 4",
                value: "#D04CFD"
            }
            ]
        });
        $('#map').append(legend.render().el);
    
    });
    
    // Add button events Sublayer 2 - Age
    var sublayer2Shown = true;
    $("#sublayer2").on('click', function() {
        sublayers[0].hide();
        sublayers[1].hide();
        sublayers[3].hide();
        sublayers[2].show();
        $('.cartodb-legend').addClass("hidden")
        var densityLegend = new cdb.geo.ui.Legend.Density({
            left: "Age",
            right: "High",
            colors: ["#FFFFB2", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#B10026"]
        });
        $('#map').append(densityLegend.render().el);
    
    });
    
    // Add button events Sublayer 3 - Structure Count
    var sublayer3Shown = true;
    $("#sublayer3").on('click', function() {
        sublayers[0].hide();
        sublayers[2].hide();
        sublayers[1].hide();
        sublayers[3].show();
        $('.cartodb-legend').addClass("hidden")
        var legend = new cdb.geo.ui.Legend({
            type: "custom",
            data: [
            {
                name: "Structure Count",
                value: "#FFC926"
            }, 
            {
                name: "Category 2",
                value: "#76EC00"
            }, 
            {
                name: "Category 3",
                value: "#00BAF8"
            }, 
            {
                name: "Category 4",
                value: "#D04CFD"
            }
            ]
        });
        $('#map').append(legend.render().el);
    });
}
//closes function
