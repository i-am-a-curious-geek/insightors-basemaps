import React, {
  PureComponent
}                         from 'react';
import PropTypes          from 'prop-types';
import { Card, CardBody, Col } from 'reactstrap';

import L from "leaflet";

export default class ElderlyMap extends PureComponent {
  constructor() {
    super();
    this.map = null;

    this.featureGroupLayer = null;
    this.featureGroupMarkers = null;
    this.featureGroupMarkers_2 = null;

    this.attribution = null;   
    this.basemap = null;   
  }  

  componentWillMount() {          
  	const { 
  		featureGroupLayer,
  		featureGroupMarkers,
  		featureGroupMarkers_2
  	} = this.props;

    this.featureGroupLayer = featureGroupLayer; 
    this.featureGroupMarkers = featureGroupMarkers; 
    this.featureGroupMarkers_2 = featureGroupMarkers_2; 

    this.attribution = L.control.attribution({ prefix: '<small class="prefix-attribution"><img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:10px;width:10px;"/> New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">SLA</a></small>'
    });
  }
  
  componentDidMount() {        
    this.map = new L.Map('map-canvas', {
        center: new L.LatLng(1.33883688455388, 103.83842469658703),
        zoom: 11,
        minZoom: 11,
        maxZoom: 17,
        attributionControl: false,
        zoomControl: true,
        scaleControl: false
    });    
    this.map.addLayer(this.featureGroupLayer); 
    this.featureGroupLayer.bringToBack;
    this.map.addLayer(this.featureGroupMarkers);
    this.featureGroupMarkers.bringToFront;
    this.map.addLayer(this.featureGroupMarkers_2);
    this.featureGroupMarkers_2.bringToFront;

    this.attribution.addTo(this.map);

    document.getElementById("map-canvas").style.background = "#bed4f9";
    this.basemap = L.tileLayer("http://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png",{    	
		detectRetina: true,
		maxZoom: 18,
		minZoom: 11,		
		attribution: false
	});
	this.map.addLayer(this.basemap);
	this.addGeojsonLayer();
	this.addGeojsonMarkers();
	this.addGeojsonMarkers_2();
  }

  addGeojsonMarkers() {
  	const { 
		geojsonMarkers,		
		opacity
	} = this.props;

	var markers = new L.geoJson(geojsonMarkers, {
        onEachFeature: function(feature, layer) {
	        layer.on({
		      mouseover: function(e) {
				let layer = e.target;

				layer.setStyle({
					radius: 6,
	                fillColor: '#ffffff',
	                color: '#f7931e',
	                weight: 2,
	                opacity: 1.0,
	                fillOpacity: 1.0
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}
				
				let name = feature["properties"]["DESCRIPTION"];	
				let address = feature["properties"]["ADDRESSSTREETNAME"];					

				let str = "<b>Name: </b><span>" + name + "</span><br /><b>Address:</b> <span>" + address + "</span>";	
				layer.bindTooltip(str).openTooltip();          
			  },
			  mouseout: function(e) {
				var layer = e.target;

				layer.setStyle({
				  	radius: 3,
	                fillColor: '#ffffff',
	                color: '#f7931e',
	                weight: 2,
	                opacity: 1.0,
	                fillOpacity: 1.0
				});
			  }	
	    	});
	    },
        pointToLayer: function(feature, latlng) {   
        	/*let icon = L.icon({
			    iconUrl: "/assets/img/eldercare-services-marker.png",
			    iconSize: [10, 10]
			});
			return L.marker(latlng, {
				icon: icon
			});*/     	
            return L.circleMarker(latlng, {
                radius: 3,
                fillColor: '#ffffff',
                color: '#f7931e',
                weight: 2,
                opacity: 1.0,
                fillOpacity: 1.0
            });
        }
    });
	
  	this.featureGroupMarkers.addLayer(markers);
  }  

  addGeojsonMarkers_2() {
  	const { 
		geojsonMarkers_2,		
		opacity
	} = this.props;

	var markers = new L.geoJson(geojsonMarkers_2, {
        onEachFeature: function(feature, layer) {
	        layer.on({
		      mouseover: function(e) {
				let layer = e.target;

				layer.setStyle({
					radius: 6,
	                fillColor: '#ffffff',
	                color: '#f7931e',
	                weight: 2,
	                opacity: 1.0,
	                fillOpacity: 1.0
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToFront();
				}
				
				let name = feature["properties"]["NAME"];	
				let address = feature["properties"]["ADDRESSSTREETNAME"];					

				let str = "<b>Name: </b><span>" + name + "</span><br /><b>Address:</b> <span>" + address + "</span>";	
				layer.bindTooltip(str).openTooltip();          
			  },
			  mouseout: function(e) {
				var layer = e.target;

				layer.setStyle({
				  	radius: 3,
	                fillColor: '#ffffff',
	                color: '#4ce1b6',
	                weight: 2,
	                opacity: 1.0,
	                fillOpacity: 1.0
				});
			  }	
	    	});
	    },
        pointToLayer: function(feature, latlng) {   
        	/*let icon = L.icon({
			    iconUrl: "/assets/img/eldercare-services-marker.png",
			    iconSize: [10, 10]
			});
			return L.marker(latlng, {
				icon: icon
			});*/     	
            return L.circleMarker(latlng, {
                radius: 3,
                fillColor: '#ffffff',
                color: '#4ce1b6',
                weight: 2,
                opacity: 1.0,
                fillOpacity: 1.0
            });
        }
    });
	
  	this.featureGroupMarkers_2.addLayer(markers);
  }  



  addGeojsonLayer() {
  	const { 
		geojsonLayer,
		attribute,
		breaks, 
		colors,
		tooltipCaption,
		tooltipAttribute,
		opacity
	} = this.props;

	let layer = L.geoJson(geojsonLayer, {
      	style: function(feature) {		    
			var count = parseInt(feature["properties"][attribute]);	
			var color = colors[0];
			                      
			if(count >= breaks[6]) {
			  color = colors[6];
			} else if(count >= breaks[4]) {
			  color = colors[5];;
			} else if(count >= breaks[3]) {
			  color = colors[3];
			} else if(count >= breaks[2]) {
			  color = colors[2];
			} else if(count >= breaks[1] || count !== breaks[0]) {
			  color = colors[1];
			}

			return {
				weight: 2,
				opacity: parseFloat(opacity/100),
				color: "#333333",
				dashArray: "3",
				fillOpacity: parseFloat(opacity/100),
				fillColor: color
			}    
	    },
      	onEachFeature: function(feature, layer) {		  	
		    layer.on({
		      mouseover: function(e) {
				let layer = e.target;

				layer.setStyle({
					weight: 5,
					color: "#333333",
					dashArray: ""
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					layer.bringToBack();
				}

				let count = feature["properties"][attribute];		
				let str = "<b>" + tooltipCaption + ": </b><span>" + feature["properties"][tooltipAttribute] + "</span><br /><b>Count:</b> <span>" + count + "</span>";	
				layer.bindTooltip(str).openTooltip();          
			  },
			  mouseout: function(e) {
				var layer = e.target;

				layer.setStyle({
				  weight: 2,
				  color: "#333333",
				  dashArray: "3"
				});
			  }	
	    	});
	  	} 
  	}); 

  	this.featureGroupLayer.addLayer(layer);
  }

  render() {     	      
  	const { 
  		title,
  		symbol
  	} = this.props;

  	let icon = <svg className={`icon icon-${symbol}`}><use xlinkHref={`#icon-${symbol}`}></use></svg>;

  	const { 		
		breaks, 
		colors
	} = this.props;

    return(<Col xs={12} md={12}>
            <Card>
              <CardBody>
              <h5 className="bold-text"><b>{icon}{title}</b></h5>                                  
                <div className="row">        
              		<Col xs={12} md={4}>                			
                		<table className="map-legend pull-left">
                			<tbody> 
                				<tr><th colSpan={2}>DISTRIBUTION</th></tr> 
		                		<tr>
		                			<th><small>{breaks[0]}-{breaks[1]}</small></th>
		                			<td><span className="square-symbol" style={{backgroundColor: colors[1]}}></span></td>
		            			</tr>
		            			<tr>
		                			<th><small>{breaks[1]}-{breaks[2]}</small></th>
		                			<td><span className="square-symbol" style={{backgroundColor: colors[2]}}></span></td>
		            			</tr>
		            			<tr>
		                			<th><small>{breaks[2]}-{breaks[3]}</small></th>
		                			<td><span className="square-symbol" style={{backgroundColor: colors[3]}}></span></td>
		            			</tr>
		            			<tr>
		                			<th><small>{breaks[3]}-{breaks[4]}</small></th>
		                			<td><span className="square-symbol" style={{backgroundColor: colors[4]}}></span></td>
		            			</tr>
		            			<tr>
		                			<th><small>{breaks[4]}-{breaks[5]}</small></th>
		                			<td><span className="square-symbol" style={{backgroundColor: colors[5]}}></span></td>
		            			</tr>
	            			</tbody>
                		</table>
                		<table className="map-legend pull-left">
                			<tbody>                 				
		                		<tr>
		                			<th>ELDERCARE SERVICE</th>
		                			<td><span className="dot-symbol" style={{border: "2px solid #f7931e"}}></span></td>
		            			</tr>
		            			<tr>
		                			<th>CHAS CLINIC</th>
		            				<td><span className="dot-symbol" style={{border: "2px solid #4ce1b6"}}></span></td>
		            			</tr>
	            			</tbody>
                		</table>
                	</Col>   
              		<Col xs={12} md={8}>                        
                		<div id="map-canvas"></div> 
                	</Col>                   	                   
                </div>                        
              </CardBody>                
           </Card>
          </Col>);      
  }

}