webpackJsonp([1],{"5W1q":function(e,t){},E834:function(e,t){},NHnr:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:true});var r=a("j1ja");var n=a.n(r);var s=a("hKoQ");var i=a.n(s);var o=a("j9g7");var l=a.n(o);var c=a("7+uW");var u=a("3EgV");var d=a.n(u);var v=new c["default"];var p=a("uTBe");var f=a.n(p);var m=a("Dd8w");var h=a.n(m);var y=a("M4fF");var g=a.n(y);var j=a("DAYN");var b=a.n(j);var x=a("NYxO");var k={name:"VLegend",props:{layer:{type:Object}}};var _=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{attrs:{id:"legend-div"}},[e.layer.barlegend?a("div",{staticClass:"bar-wrapper"},[a("div",{staticClass:"bar",style:e.layer.barlegend}),e._v(" "),a("div",{staticClass:"bartext"},[e._v(e._s(e.layer.bartext)+" ")])]):e._e(),e._v(" "),e.layer.legendlabels?a("div",{staticClass:"bar-wrapper"},[a("v-layout",{staticClass:"color-label",attrs:{wrap:""}},e._l(e.layer.legendlabels,function(t,r){return a("v-layout",{key:r,attrs:{"align-center":""}},[e.layer.legendcolors?a("span",{staticClass:"colored-span",style:"background-color: "+e.layer.legendcolors[r]}):e._e(),e._v(" "),e.layer.legendstripes?a("span",{staticClass:"colored-striped-span",style:"background-color: "+e.layer.legendstripes[r]}):e._e(),e._v(" "),a("label",{staticClass:"ma-1"},[e._v(e._s(t))])])}),1)],1):e._e()])};var L=[];var w={render:_,staticRenderFns:L};var Y=w;function M(e){a("adFo")}var E=a("VU/8");var S=false;var D=M;var z=null;var C=null;var F=E(k,Y,S,D,z,C);var O=F.exports;var P={name:"layer-control",computed:h()({},Object(x["b"])(["getAllLayers"]),Object(x["d"])(["layers"]),{menulayers:{get:function e(){return this.layers},set:function e(t){this.setLayers(t)}}}),data:function e(){return{jarkusLoading:true}},mounted:function e(){var t=this;v.$on("map-loaded",function(e){t.map=e});v.$on("check-layer-order",function(){t.sortLayers()});v.$on("jarkus-loaded",function(){t.jarkusLoading=false})},methods:h()({},Object(x["c"])(["setLayers","updateLayer"]),{sortLayers:function e(){if(g.a.isNil(this.map)){return}for(var t=this.getAllLayers.length-2;t>=0;--t){for(var a=0;a<this.getAllLayers[t].data.length;++a){var r=this.getAllLayers[t].data[a];if(this.map.getLayer(r.id)!==undefined){this.map.moveLayer(r.id)}if(this.map.getLayer(r.id+"_"+r.ghostlayercount)!==undefined){this.map.moveLayer(r.id+"_"+r.ghostlayercount)}}}},toggleLayers:function e(t){var a=this;if(g.a.isNil(this.map)){return}if(!t)return;this.updateLayer(t);if(t.name==="Suppleties"){v.$emit("update-suppleties")}var r=["none","visible"];if(t.layertype==="deckgl-layer"){v.$emit("update-deckgl",t.active)}else if(t.layertype==="gee-layer"){t.data.forEach(function(e){var n=e.id+"_"+t.ghostlayercount;if(t.active){v.$emit("update-gee-layer",t)}if(a.map.getLayer(n)){if(t.active){a.map.setLayoutProperty(n,"visibility",r[1])}else{a.map.setLayoutProperty(n,"visibility",r[0])}}})}else{t.data.forEach(function(e){if(a.map.getLayer(e.id)){if(t.active){a.map.setLayoutProperty(e.id,"visibility",r[1])}else{a.map.setLayoutProperty(e.id,"visibility",r[0])}}})}this.sortLayers()}}),components:{draggable:b.a,VLegend:O}};var T=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{staticClass:"layer-control"},[a("div",{staticClass:"layer-header"},[a("v-card",{attrs:{small:"",flat:""}},[a("v-card-title",[a("h1",[e._v("\n          Kaartlagen\n        ")])])],1)],1),e._v(" "),a("div",{staticClass:"layer-div"},[a("draggable",{staticClass:"draggable",on:{start:function(t){e.drag=true},end:function(t){e.drag=false;e.sortLayers()}},model:{value:e.menulayers,callback:function(t){e.menulayers=t},expression:"menulayers"}},e._l(e.layers,function(t){return a("v-list",{key:t.id,attrs:{"three-line":"",dense:"","pt-0":""}},[a("v-list-tile",[a("v-list-tile-action",[a("v-switch",{attrs:{disabled:t.layertype==="deckgl-layer"&&e.jarkusLoading},on:{change:function(a){return e.toggleLayers(t)}},model:{value:t.active,callback:function(a){e.$set(t,"active",a)},expression:"layer.active"}})],1),e._v(" "),a("v-list-tile-content",[a("v-list-tile-title",[e._v("\n              "+e._s(t.name)+"\n            ")]),e._v(" "),a("v-list-tile-sub-title",[a("v-legend",{attrs:{layer:t}})],1)],1),e._v(" "),t.layertype==="deckgl-layer"?a("v-list-tile-action",[e.jarkusLoading?a("v-progress-circular",{attrs:{indeterminate:"",color:"purple"}}):e._e()],1):e._e()],1)],1)}),1)],1)])};var V=[];var N={render:T,staticRenderFns:V};var R=N;function $(e){a("pXvq")}var q=a("VU/8");var I=false;var U=$;var B=null;var H=null;var J=q(P,R,I,U,B,H);var A=J.exports;var X=a("7t+N");var G=a.n(X);var W=a("PJh5");var K=a.n(W);var Q=a("w+/p");var Z=a.n(Q);var ee=a("5W1q");var te=a.n(ee);var ae="Y-MM-DD";var re={name:"time-slider",props:{showPlay:{type:Boolean,default:true},extent:{type:Array,default:[K()("2008"),K()("2018")]}},data:function e(){return{sliders:[],slider:null,defaultFrom:K()("2009","YYYY"),defaultTo:K()("2019","YYYY")}},mounted:function e(){this.generateTimeslider()},watch:{extent:{handler:function e(t,a){if(t.length===2){this.updateSlider()}}}},methods:{generateTimeslider:function e(){var t="MM-YYYY";var a=this.$el.querySelector("input.slider");G()(a).ionRangeSlider({type:"double",drag_interval:true,force_edges:true,grid:false,step:1,from:this.defaultFrom.format("x"),to:this.defaultTo.format("x"),min:this.defaultFrom.format("x"),max:this.defaultTo.format("x"),prettify:function e(a){return K()(a,"x").format(t)},onChange:function e(t){v.$emit("slider-update",{begindate:t.from_pretty,enddate:t.to_pretty})},onFinish:function e(t){v.$emit("slider-end",{begindate:t.from_pretty,enddate:t.to_pretty});v.$emit("slider-update",{begindate:t.from_pretty,enddate:t.to_pretty})}});v.$emit("slider-created",{begindate:this.defaultFrom,enddate:this.defaultTo});this.slider=G()(a).data("ionRangeSlider")},updateSlider:function e(){this.slider.update({type:"double",drag_interval:true,min:this.extent[0].format("x"),max:this.extent[1].format("x"),to_min:this.extent[0].format("x"),to_max:this.extent[1].format("x"),from_min:this.extent[0].format("x"),from_max:this.extent[1].format("x"),from:this.defaultFrom.format("x"),to:this.defaultTo.format("x")})}}};var ne=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("v-toolbar",{attrs:{color:"rgba(255, 0, 0, 0)",flat:"",floating:"",role:"slider",id:"time-slider"}},[a("div",{staticClass:"time-slider-wrapper"},[a("input",{staticClass:"slider",attrs:{type:"text",name:"slider",value:""}})])])};var se=[];var ie={render:ne,staticRenderFns:se};var oe=ie;function le(e){a("E834")}var ce=a("VU/8");var ue=false;var de=le;var ve=null;var pe=null;var fe=ce(re,oe,ue,de,ve,pe);var me=fe.exports;var he=a("W3Iv");var ye=a.n(he);var ge={name:"v-mapbox-style-picker",data:function e(){return{id:this._uid,satelliteSwitch:0}},inject:["getMap"],mounted:function e(){var t=this;this.map=this.getMap();this.map.on("load",function(){t.deferredMountedTo()});this.mapstyles=this.mapboxstyles||this.mapstyles;this.mapstyle=this.mapboxstyle||this.mapstyle},methods:{deferredMountedTo:function e(){this.map.addControl(this,"bottom-right");this.map.addLayer({id:"satellite",type:"raster",source:{type:"raster",tiles:["https://portal.geoserve.nl/tiles/NSO_mosaics/tileserver/20190601_20190715_SV_50cm_RD_8bit_RGB_Mosaic/{z}/{x}/{y}"],tileSize:256},paint:{"raster-opacity":0}},"country-label-lg")},onAdd:function e(t){return this.$refs[this.id]},onRemove:function e(){return null},switchSatellite:function e(){if(this.satelliteSwitch===1){this.satelliteSwitch=0}else{this.satelliteSwitch=1}this.map.setPaintProperty("satellite","raster-opacity",this.satelliteSwitch)}}};var je=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{ref:e.id,staticClass:"mapboxgl-ctrl mapboxgl-ctrl-bottom-right mapboxgl-ctrl-group mapbox-style-picker",attrs:{id:e.id}},[a("v-btn",{attrs:{id:"satelliteBtn"},nativeOn:{click:function(t){return e.switchSatellite()}}},[e.satelliteSwitch===0?a("img",{attrs:{src:"static/images/satellite.png",height:"30"}}):e._e(),e._v(" "),e.satelliteSwitch===1?a("img",{attrs:{src:"static/images/light.png",height:"30"}}):e._e()])],1)};var be=[];var xe={render:je,staticRenderFns:be};var ke=xe;function _e(e){a("p3u/")}var Le=a("VU/8");var we=false;var Ye=_e;var Me="data-v-d931353a";var Ee=null;var Se=Le(ge,ke,we,Ye,Me,Ee);var De=Se.exports;var ze={name:"VMapboxLegend",computed:h()({},Object(x["d"])(["layers"]),{activeLayers:{get:function e(){return this.layers.filter(function(e){return e.active&&(e.barlegend||e.legendlabels)})}}}),components:{VLegend:O}};var Ce=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div",{staticClass:"mapboxgl-ctrl-bottom-left pl-2 pb-4",attrs:{id:"legend"}},e._l(e.activeLayers,function(t){return a("div",[e._v("\n    "+e._s(t.name)+"\n    "),a("v-legend",{attrs:{layer:t}})],1)}),0)};var Fe=[];var Oe={render:Ce,staticRenderFns:Fe};var Pe=Oe;function Te(e){a("lUVo")}var Ve=a("VU/8");var Ne=false;var Re=Te;var $e=null;var qe=null;var Ie=Ve(ze,Pe,Ne,Re,$e,qe);var Ue=Ie.exports;var Be=a("NQNX");var He=a("v+Ly");var Je=a("ogBu");var Ae=a("woOf");var Xe=a.n(Ae);var Ge=a("mvHQ");var We=a.n(Ge);var Ke=a("gRE1");var Qe=a.n(Ke);var Ze=a("//Fk");var et=a.n(Ze);var tt=a("qMAk");var at=a.n(tt);var rt=a("1e2d");var nt=a.n(rt);var st="https://s3-eu-west-1.amazonaws.com/deltares-opendata/jarkus/jarkus_";var it="https://coast-viewer-dot-hydro-engine.appspot.com";var ot={};var lt=true;var ct={name:"DataLayers",computed:h()({},Object(x["b"])(["getAllLayers"]),Object(x["d"])(["layers","jarkusLayers","deckgl"])),watch:{layers:{handler:function e(t,a){var r=this;var n=t.find(function(e){return e.layertype==="deckgl-layer"});if(n&&this.years.length===0){this.years=g.a.range(parseInt(K()(n.timeslider.begindate,n.timeslider.format).format("YYYY")),parseInt(K()(n.timeslider.enddate,n.timeslider.format).format("YYYY")));this.steps=this.years[this.years.length-1]-this.years[0]+1;et.a.all(this.years.map(function(e){return r.fetchJarkus(e)})).then(function(e){v.$emit("jarkus-loaded")})}}}},data:function e(){return{activeYears:[],steps:0,timeExtent:[],years:[]}},created:function e(){var t=this;v.$on("slider-created",function(e){t.timeExtent[0]=K()(e.begindate,"MM-YYYY");t.timeExtent[1]=K()(e.enddate,"MM-YYYY")})},mounted:function e(){var t=this;this.popup=new nt.a.Popup({closeButton:true,closeOnClick:false});v.$on("map-loaded",function(e){t.map=e;t.addMapboxLayers();t.updateNourishmentFilter()});v.$on("update-gee-layer",function(e){console.log("update-gee");t.updateGEELayer(e)});v.$on("slider-update",function(e){var a=t.layers.find(function(e){return e.data[0].id==="jarkus"});t.timeExtent[0]=e.begindate;t.timeExtent[1]=e.enddate;var r=K()(t.timeExtent[1],"MM-YYYY").format("YYYY");var n=K()(t.timeExtent[0],"MM-YYYY").format("YYYY");var s=g.a.range(r,n);if(!t.map){return}if(t.activeYears[t.activeYears.length-1]!==r){var i=t.layers.find(function(e){return e.name==="Kustindicatoren"});t.updateKust(i,r)}if(t.activeYears!==s){if(a&&a.active){t.activeYears=s;t.updateJarkusLayer(t.activeYears,a.active)}}t.updateNourishmentFilter()});v.$on("update-deckgl",function(e){t.updateJarkusLayer(t.activeYears,e)});v.$on("slider-end",function(e){var a=t.layers.filter(function(e){return e.layertype==="gee-layer"&&e.active});a.forEach(function(e){t.updateGEELayer(e)})})},methods:h()({},Object(x["c"])(["setJarkusLayers","updateLayer"]),{updateNourishmentFilter:function e(){var t=this;var a=["all",[">",["get","begin"],K()(this.timeExtent[0],"MM-YYYY").format("YYYY-MM")],["<",["get","eind"],K()(this.timeExtent[1],"MM-YYYY").format("YYYY-MM")]];var r=["nourishments","nourishments_points","nourishments_hover","nourishments_points_hover"];r.forEach(function(e){if(t.map.getLayer(e)){t.map.setFilter(e,a)}})},addMapboxLayers:function e(){var t=this;this.layers.forEach(function(e,a){if(e.layertype==="mapbox-layer-group"){e.data.forEach(function(e,a){if(!t.map.getLayer(e.id)){t.map.addLayer(e);t.map.setLayoutProperty(e.id,"visibility","none")}})}else if(e.layertype==="mapbox-layer"){if(!t.map.getLayer(e.id)){t.map.addLayer(e);t.map.setLayoutProperty(e.id,"visibility","none")}}})},fetchJarkus:function e(t){var a=this;return fetch(""+st+t+".json").then(function(e){return e.json()}).catch(function(e){return console.log("error is",e)}).then(function(e){var r=5e-5;e.features.forEach(function(a){var n=e.features[0].geometry.coordinates;var s=n[0];var i=n[n.length-1];var o=i[0]-s[0];var l=i[1]-s[1];var c=Math.atan(o/l)+1.25*Math.PI;a.geometry.coordinates.forEach(function(e){e[0]+=(t-1964)*r*Math.cos(c);e[1]+=(t-1964)*r*Math.sin(c);return e});return a});var n=at()("#5614b0","#dbd65c").rgb(a.steps);var s={id:"jarkus-"+t,data:e,pickable:true,filled:false,extruded:true,lineWidthScale:20,getElevation:30,wireframe:false,fp64:false,getLineColor:function e(a){var r=n[t-1965].toRgb();r.a=255;return Qe()(r)},getLineWidth:1,onHover:function e(r){if(r.index===-1){a.popup.remove()}else{a.popup.setLngLat([r.lngLat[0],r.lngLat[1]]).setHTML("Transect Id: "+r.object.id.split("-")[0].toString()+"<br> year: "+t).addTo(a.map)}},onClick:function e(t){return window.open(coastviewerServer+"/coastviewer/1.1.0/transects/"+t.object.id.split("-")[0].toString()+"/info","_blank")}};a.setJarkusLayers({year:t,layer:s})})},updateJarkusLayer:function e(t,a){var r=this;var n=[];if(a){var n=t.map(function(e){return new He["c"](r.jarkusLayers[String(e)])})}this.deckgl.setProps({layers:n})},getTileUrl:function e(t,a){var r="https://earthengine.googleapis.com/map";var n=r+"/"+t+"/{z}/{x}/{y}?token="+a;return n},updateGEELayer:function e(t){var a=this;console.log("updategeelayer",t.name);if(!t.static){t.ghostlayercount+=1;this.updateLayer(t)}t.data.forEach(function(e){var r="MM-YYYY";var n={dataset:e.id,begin_date:K()(a.timeExtent[0],r),end_date:K()(a.timeExtent[1],r),min:e.min,max:e.max};if(t.hillshade){n.hillshade=t.hillshade}if(t.static){if(a.map.getLayer(e.id)){return}else{r=t.timeslider.format;n.begin_date=K()(t.timeslider.begindate,r);n.end_date=K()(t.timeslider.enddate,r)}}fetch(it+"/get_bathymetry",{method:"POST",body:We()(n),headers:{"Content-Type":"application/json"}}).then(function(e){return e.json()}).then(function(r){if(r.mapid&&r.token){var n=a.getTileUrl(r.mapid,r.token);e.source.tiles=[n];e.layout.visibility="visible";var s=Xe()({},e);s.id=e.id+"_"+t.ghostlayercount;a.map.addLayer(s);var i=e.id+"_"+(t.ghostlayercount-1);if(a.map.getLayer(i)){setTimeout(function(){a.map.removeLayer(i);a.map.removeSource(i)},5e3)}v.$emit("check-layer-order")}})})},updateKust:function e(t,a){var r=this;if(!t.active)return;t.data.forEach(function(e){var t=e.source.data.split(".json")[0];var n=t.slice(0,-4);r.map.getSource(e.id).setData(""+n+a+".json")})}})};var ut=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("div")};var dt=[];var vt={render:ut,staticRenderFns:dt};var pt=vt;function ft(e){a("yZfO")}var mt=a("VU/8");var ht=false;var yt=ft;var gt=null;var jt=null;var bt=mt(ct,pt,ht,yt,gt,jt);var xt=bt.exports;var kt={name:"MapComponent",props:{showLegend:{type:Boolean}},provide:function e(){var t=this;return{getMap:function e(){return t.map}}},data:function e(){return{map:null,deckgl:null}},mounted:function e(){var t=this;this.viewState={latitude:52,longitude:4,zoom:10};this.createMapboxMap();this.createMapboxPopup();this.createDeckGlObject();this.map.on("load",function(e){v.$emit("map-loaded",t.map);t.map.on("move",function(e){t.viewState={longitude:t.map.getCenter().lng,latitude:t.map.getCenter().lat,zoom:t.map.getZoom(),bearing:t.map.getBearing(),pitch:t.map.getPitch()};t.deckgl.setProps({viewState:t.viewState})});t.map.resize()});v.$on("slider-update",function(e){t.popup.remove()});v.$on("update-suppleties",function(){t.popup.remove()})},methods:h()({},Object(x["c"])(["setDeckgl"]),{createMapboxMap:function e(){nt.a.accessToken="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA";this.map=new nt.a.Map({container:"map",style:"mapbox://styles/mapbox/light-v9",interactive:true,center:[this.viewState.longitude,this.viewState.latitude],zoom:this.viewState.zoom});this.map.addControl(new nt.a.NavigationControl)},createMapboxPopup:function e(){this.popup=new nt.a.Popup({closeButton:true,closeOnClick:false})},createDeckGlObject:function e(){var t=this;this.deckgl=new Je["b"]({canvas:"deck-canvas",width:"100%",height:"100%",controller:true,initialViewState:this.viewState,onViewStateChange:function e(a){var r=a.viewState;t.viewState=r;t.map.jumpTo({center:[r.longitude,r.latitude],zoom:r.zoom,bearing:r.bearing,pitch:r.pitch})},onClick:function e(a){t.popup.remove();var r=t.map.queryRenderedFeatures([a.x,a.y]);if(!r[0]){return}var n=r[0].layer.id;if(n==="nourishments_hover"||n==="nourishments_points_hover"){var n=r[1].layer.id}if(n==="nourishments"||n==="nourishments_points"){var s=r[0];var i="";ye()(s.properties).forEach(function(e){if(e[0]!=="id"){if(e[0]==="volume per metre"){e[0]="volume per meter"}i+="<tr><th>"+e[0]+"</th><th>"+e[1]+"</th></tr>"}});t.popup.setLngLat([a.lngLat[0],a.lngLat[1]]).setHTML("<table>"+i+"</table>").addTo(t.map)}},onHover:function e(a){var r=1;var n=t.map.queryRenderedFeatures([a.x-1,a.y-1,a.x+1,a.y+1]);t.map.getCanvas().style.cursor="";if(!n[0]){return}t.map.getCanvas().style.cursor="pointer";var s=n[0].layer.id;var i=[{layerId:"nourishments_points",hoverId:"nourishments_points_hover"},{layerId:"nourishments",hoverId:"nourishments_hover"}];i.forEach(function(e){if(t.map.getLayer(e.hoverId)){if(s===e.layerId||s===e.hoverId){t.map.setFilter(e.hoverId,["==","id",n[0].properties.id])}else{t.map.setFilter(e.hoverId,["==","id",""])}}})}});this.setDeckgl(this.deckgl)}}),components:{VMapboxStylePicker:De,DataLayers:xt,VMapboxLegend:Ue}};var _t=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("v-container",{attrs:{fluid:"","fill-height":"","pa-0":""}},[a("div",{attrs:{id:"map"}},[a("v-mapbox-legend",{directives:[{name:"show",rawName:"v-show",value:e.showLegend,expression:"showLegend"}]}),e._v(" "),e.map!==null?a("v-mapbox-style-picker"):e._e(),e._v(" "),a("data-layers")],1),e._v(" "),a("canvas",{attrs:{id:"deck-canvas"}})])};var Lt=[];var wt={render:_t,staticRenderFns:Lt};var Yt=wt;function Mt(e){a("NL4t")}var Et=a("VU/8");var St=false;var Dt=Mt;var zt=null;var Ct=null;var Ft=Et(kt,Yt,St,Dt,zt,Ct);var Ot=Ft.exports;var Pt={props:{showSettings:{type:Boolean}},data:function e(){return{startDate:null,endDate:null,startDateMenu:false,endDateMenu:false,fixed:false}}};var Tt=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("v-dialog",{attrs:{transition:"dialog-top-transition","max-width":"500px"},model:{value:e.showSettings,callback:function(t){e.showSettings=t},expression:"showSettings"}},[a("v-card",[a("v-card-text",[a("v-layout",{attrs:{row:"",wrap:""}},[a("v-flex",{attrs:{xs11:"",sm5:""}},[a("v-menu",{attrs:{lazy:"","close-on-content-click":false,transition:"scale-transition","offset-y":"","full-width":"","nudge-right":40,"max-width":"290px","min-width":"290px"},model:{value:e.startDateMenu,callback:function(t){e.startDateMenu=t},expression:"startDateMenu"}},[a("v-text-field",{attrs:{slot:"activator",label:"Start date","prepend-icon":"event",readonly:""},slot:"activator",model:{value:e.startDate,callback:function(t){e.startDate=t},expression:"startDate"}}),e._v(" "),a("v-date-picker",{attrs:{type:"month","no-title":"",scrollable:"",actions:""},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.save;var n=t.cancel;return[a("v-card-actions",[a("v-spacer"),e._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:n}},[e._v("Cancel")]),e._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:r}},[e._v("OK")])],1)]}}]),model:{value:e.startDate,callback:function(t){e.startDate=t},expression:"startDate"}})],1)],1),e._v(" "),a("v-flex",{attrs:{xs11:"",sm5:""}},[a("v-menu",{attrs:{lazy:"","close-on-content-click":false,transition:"scale-transition","offset-y":"","full-width":"","nudge-right":40,"max-width":"290px","min-width":"290px"},model:{value:e.endDateMenu,callback:function(t){e.endDateMenu=t},expression:"endDateMenu"}},[a("v-text-field",{attrs:{slot:"activator",label:"End date","prepend-icon":"event",readonly:""},slot:"activator",model:{value:e.endDate,callback:function(t){e.endDate=t},expression:"endDate"}}),e._v(" "),a("v-date-picker",{attrs:{type:"month","no-title":"",scrollable:"",actions:""},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.save;var n=t.cancel;return[a("v-card-actions",[a("v-spacer"),e._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:n}},[e._v("Cancel")]),e._v(" "),a("v-btn",{attrs:{flat:"",color:"primary"},on:{click:r}},[e._v("OK")])],1)]}}]),model:{value:e.endDate,callback:function(t){e.endDate=t},expression:"endDate"}})],1)],1)],1)],1),e._v(" "),a("v-card-actions",[a("v-spacer"),e._v(" "),a("v-btn",{attrs:{icon:""},nativeOn:{click:function(t){e.showSettings=false}}},[a("v-icon",[e._v("close")])],1)],1)],1)],1)};var Vt=[];var Nt={render:Tt,staticRenderFns:Vt};var Rt=Nt;var $t=a("VU/8");var qt=false;var It=null;var Ut=null;var Bt=null;var Ht=$t(Pt,Rt,qt,It,Ut,Bt);var Jt=Ht.exports;var At={data:function e(){return{layers:[],extent:[],map:null,deckgl:null,startDate:null,endDate:null,startDateMenu:false,endDateMenu:false,drawer:false,fixed:false,showSettings:false,showLegend:true,items:[{icon:"bubble_chart",title:"Inspire"}],rightDrawer:false}},created:function e(){this.retrieveData()},mounted:function e(){var t=this;v.$on("map-loaded",function(e){c["default"].set(t,"map",e)})},components:{LayerControl:A,TimeSlider:me,MapComponent:Ot,TimeSliderSettings:Jt},methods:{retrieveData:function e(){var t=this;fetch("./static/data/datalayers.json").then(function(e){return e.json()}).then(function(e){var a=e;t.$store.commit("setLayers",a);var r="MM-YYYY";var n=a.filter(function(e){return e.timeslider});n.forEach(function(e){var a=K()(e.timeslider.begindate,r);var n=K()(e.timeslider.enddate,r);if(t.extent.length===0){t.extent=[a,n]}if(t.extent[0]>a){t.extent[0]=a}if(t.extent[1]<n){t.extent[1]=n}})})}}};var Xt=function(){var e=this;var t=e.$createElement;var a=e._self._c||t;return a("v-app",[a("v-toolbar",{attrs:{id:"main-toolbar",fixed:"",prominent:"",app:""}},[a("v-toolbar-title",[e._v("Coastviewer")]),e._v(" "),a("v-spacer"),e._v(" "),a("time-slider",{ref:"timeslider",attrs:{extent:e.extent,"show-play":false}}),e._v(" "),a("v-spacer"),e._v(" "),a("v-btn",{attrs:{icon:""},on:{click:function(t){t.stopPropagation();e.showLegend=!e.showLegend}}},[a("v-icon",[e._v("format_list_bulleted")])],1),e._v(" "),a("v-btn",{attrs:{icon:""},on:{click:function(t){t.stopPropagation();e.rightDrawer=!e.rightDrawer}}},[a("v-icon",[e._v("layers")])],1)],1),e._v(" "),a("v-content",[a("map-component",{attrs:{showLegend:e.showLegend}})],1),e._v(" "),a("v-navigation-drawer",{attrs:{"hide-overlay":"",id:"drawer",right:"",fixed:"",floating:"",width:"450"},model:{value:e.rightDrawer,callback:function(t){e.rightDrawer=t},expression:"rightDrawer"}},[a("layer-control",{attrs:{layers:e.layers}})],1)],1)};var Gt=[];var Wt={render:Xt,staticRenderFns:Gt};var Kt=Wt;function Qt(e){a("vbgL")}var Zt=a("VU/8");var ea=false;var ta=Qt;var aa=null;var ra=null;var na=Zt(At,Kt,ea,ta,aa,ra);var sa=na.exports;var ia=a("YaEn");var oa=a.n(ia);c["default"].use(x["a"]);var la=new x["a"].Store({state:{jarkusLayers:{},layers:[],geojsonLayers:{},deckgl:null,endYear:null,geojsonVTLayers:{}},mutations:{setJarkusLayers:function e(t,a){t.jarkusLayers[a.year]=a.layer},setLayers:function e(t,a){t.layers=a},updateLayer:function e(t,a){t.layers=t.layers.map(function(e){if(e.name===a.name){return a}else{return e}})},setGeoJsonVTLayers:function e(t,a){t.geojsonVTLayers[a.year]=a.layer},setDeckgl:function e(t,a){t.deckgl=a},setYear:function e(t,a){t.endYear=a}},getters:{getAllLayers:function e(t){return t.layers}}});var ca=a("QCv7");var ua=a.n(ca);c["default"].use(d.a);c["default"].config.productionTip=false;new c["default"]({store:la,el:"#app",router:oa.a,template:"<App/>",components:{App:sa}})},NL4t:function(e,t){},QCv7:function(e,t){},YaEn:function(e,t){},adFo:function(e,t){},lUVo:function(e,t){},"p3u/":function(e,t){},pXvq:function(e,t){},uTBe:function(e,t){},uslO:function(e,t,a){var r={"./af":"3CJN","./af.js":"3CJN","./ar":"3MVc","./ar-dz":"tkWw","./ar-dz.js":"tkWw","./ar-kw":"j8cJ","./ar-kw.js":"j8cJ","./ar-ly":"wPpW","./ar-ly.js":"wPpW","./ar-ma":"dURR","./ar-ma.js":"dURR","./ar-sa":"7OnE","./ar-sa.js":"7OnE","./ar-tn":"BEem","./ar-tn.js":"BEem","./ar.js":"3MVc","./az":"eHwN","./az.js":"eHwN","./be":"3hfc","./be.js":"3hfc","./bg":"lOED","./bg.js":"lOED","./bm":"hng5","./bm.js":"hng5","./bn":"aM0x","./bn.js":"aM0x","./bo":"w2Hs","./bo.js":"w2Hs","./br":"OSsP","./br.js":"OSsP","./bs":"aqvp","./bs.js":"aqvp","./ca":"wIgY","./ca.js":"wIgY","./cs":"ssxj","./cs.js":"ssxj","./cv":"N3vo","./cv.js":"N3vo","./cy":"ZFGz","./cy.js":"ZFGz","./da":"YBA/","./da.js":"YBA/","./de":"DOkx","./de-at":"8v14","./de-at.js":"8v14","./de-ch":"Frex","./de-ch.js":"Frex","./de.js":"DOkx","./dv":"rIuo","./dv.js":"rIuo","./el":"CFqe","./el.js":"CFqe","./en-au":"Sjoy","./en-au.js":"Sjoy","./en-ca":"Tqun","./en-ca.js":"Tqun","./en-gb":"hPuz","./en-gb.js":"hPuz","./en-ie":"ALEw","./en-ie.js":"ALEw","./en-il":"QZk1","./en-il.js":"QZk1","./en-nz":"dyB6","./en-nz.js":"dyB6","./eo":"Nd3h","./eo.js":"Nd3h","./es":"LT9G","./es-do":"7MHZ","./es-do.js":"7MHZ","./es-us":"INcR","./es-us.js":"INcR","./es.js":"LT9G","./et":"XlWM","./et.js":"XlWM","./eu":"sqLM","./eu.js":"sqLM","./fa":"2pmY","./fa.js":"2pmY","./fi":"nS2h","./fi.js":"nS2h","./fo":"OVPi","./fo.js":"OVPi","./fr":"tzHd","./fr-ca":"bXQP","./fr-ca.js":"bXQP","./fr-ch":"VK9h","./fr-ch.js":"VK9h","./fr.js":"tzHd","./fy":"g7KF","./fy.js":"g7KF","./gd":"nLOz","./gd.js":"nLOz","./gl":"FuaP","./gl.js":"FuaP","./gom-latn":"+27R","./gom-latn.js":"+27R","./gu":"rtsW","./gu.js":"rtsW","./he":"Nzt2","./he.js":"Nzt2","./hi":"ETHv","./hi.js":"ETHv","./hr":"V4qH","./hr.js":"V4qH","./hu":"xne+","./hu.js":"xne+","./hy-am":"GrS7","./hy-am.js":"GrS7","./id":"yRTJ","./id.js":"yRTJ","./is":"upln","./is.js":"upln","./it":"FKXc","./it.js":"FKXc","./ja":"ORgI","./ja.js":"ORgI","./jv":"JwiF","./jv.js":"JwiF","./ka":"RnJI","./ka.js":"RnJI","./kk":"j+vx","./kk.js":"j+vx","./km":"5j66","./km.js":"5j66","./kn":"gEQe","./kn.js":"gEQe","./ko":"eBB/","./ko.js":"eBB/","./ky":"6cf8","./ky.js":"6cf8","./lb":"z3hR","./lb.js":"z3hR","./lo":"nE8X","./lo.js":"nE8X","./lt":"/6P1","./lt.js":"/6P1","./lv":"jxEH","./lv.js":"jxEH","./me":"svD2","./me.js":"svD2","./mi":"gEU3","./mi.js":"gEU3","./mk":"Ab7C","./mk.js":"Ab7C","./ml":"oo1B","./ml.js":"oo1B","./mn":"CqHt","./mn.js":"CqHt","./mr":"5vPg","./mr.js":"5vPg","./ms":"ooba","./ms-my":"G++c","./ms-my.js":"G++c","./ms.js":"ooba","./mt":"oCzW","./mt.js":"oCzW","./my":"F+2e","./my.js":"F+2e","./nb":"FlzV","./nb.js":"FlzV","./ne":"/mhn","./ne.js":"/mhn","./nl":"3K28","./nl-be":"Bp2f","./nl-be.js":"Bp2f","./nl.js":"3K28","./nn":"C7av","./nn.js":"C7av","./pa-in":"pfs9","./pa-in.js":"pfs9","./pl":"7LV+","./pl.js":"7LV+","./pt":"ZoSI","./pt-br":"AoDM","./pt-br.js":"AoDM","./pt.js":"ZoSI","./ro":"wT5f","./ro.js":"wT5f","./ru":"ulq9","./ru.js":"ulq9","./sd":"fW1y","./sd.js":"fW1y","./se":"5Omq","./se.js":"5Omq","./si":"Lgqo","./si.js":"Lgqo","./sk":"OUMt","./sk.js":"OUMt","./sl":"2s1U","./sl.js":"2s1U","./sq":"V0td","./sq.js":"V0td","./sr":"f4W3","./sr-cyrl":"c1x4","./sr-cyrl.js":"c1x4","./sr.js":"f4W3","./ss":"7Q8x","./ss.js":"7Q8x","./sv":"Fpqq","./sv.js":"Fpqq","./sw":"DSXN","./sw.js":"DSXN","./ta":"+7/x","./ta.js":"+7/x","./te":"Nlnz","./te.js":"Nlnz","./tet":"gUgh","./tet.js":"gUgh","./tg":"5SNd","./tg.js":"5SNd","./th":"XzD+","./th.js":"XzD+","./tl-ph":"3LKG","./tl-ph.js":"3LKG","./tlh":"m7yE","./tlh.js":"m7yE","./tr":"k+5o","./tr.js":"k+5o","./tzl":"iNtv","./tzl.js":"iNtv","./tzm":"FRPF","./tzm-latn":"krPU","./tzm-latn.js":"krPU","./tzm.js":"FRPF","./ug-cn":"To0v","./ug-cn.js":"To0v","./uk":"ntHu","./uk.js":"ntHu","./ur":"uSe8","./ur.js":"uSe8","./uz":"XU1s","./uz-latn":"/bsm","./uz-latn.js":"/bsm","./uz.js":"XU1s","./vi":"0X8Q","./vi.js":"0X8Q","./x-pseudo":"e/KL","./x-pseudo.js":"e/KL","./yo":"YXlc","./yo.js":"YXlc","./zh-cn":"Vz2w","./zh-cn.js":"Vz2w","./zh-hk":"ZUyn","./zh-hk.js":"ZUyn","./zh-tw":"BbgG","./zh-tw.js":"BbgG"};function n(e){return a(s(e))}function s(e){var t=r[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}n.keys=function e(){return Object.keys(r)};n.resolve=s;e.exports=n;n.id="uslO"},vbgL:function(e,t){},yZfO:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.53a2a44787f4b6a40fb7.js.map