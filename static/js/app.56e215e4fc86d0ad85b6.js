webpackJsonp([1],{NHnr:function(e,t,a){"use strict";function i(e){a("fOFA")}function n(e){a("o41F")}Object.defineProperty(t,"__esModule",{value:!0});var r=a("7+uW"),o=a("3EgV"),l=a.n(o),s=(a("QCv7"),a("uTBe"),{data:function(){return{drawer:!1,fixed:!1,timeSelect:!1,items:[{icon:"bubble_chart",title:"Inspire"}],rightDrawer:!1}}}),c=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-app",[a("v-navigation-drawer",{attrs:{fixed:"",app:""},model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[a("v-list",[a("v-list-tile",{attrs:{href:"#/"}},[a("v-list-tile-action",[a("v-icon",[e._v("home")])],1),e._v(" "),a("v-list-tile-content",[a("v-list-tile-title",[e._v("Home")])],1)],1),e._v(" "),a("v-list-tile",{attrs:{href:"#/compare"}},[a("v-list-tile-action",[a("v-icon",[e._v("home")])],1),e._v(" "),a("v-list-tile-content",[a("v-list-tile-title",[e._v("Compare")])],1)],1)],1)],1),e._v(" "),a("v-toolbar",{attrs:{fixed:"",app:""}},[a("v-toolbar-side-icon",{on:{click:function(t){t.stopPropagation(),e.drawer=!e.drawer}}}),e._v(" "),a("v-toolbar-title",[e._v("Coastviewer")]),e._v(" "),a("v-spacer"),e._v(" "),a("v-btn",{attrs:{icon:""},on:{click:function(t){t.stopPropagation(),e.rightDrawer=!e.rightDrawer}}},[a("v-icon",[e._v("map")])],1)],1),e._v(" "),a("v-content",[a("router-view")],1),e._v(" "),a("v-navigation-drawer",{attrs:{temporary:"",right:"",fixed:""},model:{value:e.rightDrawer,callback:function(t){e.rightDrawer=t},expression:"rightDrawer"}},[e._v("\n    layers\n    "),a("v-list",[a("v-list-tile",[a("v-list-tile-action",[a("v-icon",[e._v("compare_arrows")])],1),e._v(" "),a("v-list-tile-title",[e._v("Layers")])],1)],1)],1),e._v(" "),a("v-footer",{attrs:{fixed:e.fixed,app:""}},[a("span",[e._v("© 2017")])]),e._v(" "),a("v-dialog",{attrs:{transition:"dialog-bottom-transition",overlay:!1,scrollable:""},model:{value:e.timeSelect,callback:function(t){e.timeSelect=t},expression:"timeSelect"}},[a("v-card",[a("v-card-actions",[a("v-btn",{attrs:{icon:"",dark:""},nativeOn:{click:function(t){e.timeSelect=!1}}},[a("v-icon",[e._v("close")])],1)],1)],1)],1)],1)},p=[],m={render:c,staticRenderFns:p},v=m,d=a("VU/8"),u=d(s,v,!1,null,null,null),f=u.exports,h=a("/ocq"),g=a("Dd8w"),_=a.n(g),w=a("Qc9b"),b=a("5BM0"),x=a.n(b),y=w.a.DeckGLJS;w.a.MapControllerJS;r.a.use(x.a);var k={name:"HelloWorld",data:function(){return{msg:"Welcome to Your Vue.js App",layers:[],sources:[]}},mounted:function(){var e=this,t={latitude:52,longitude:4,zoom:10,bearing:0,pitch:60};new y(_()({canvas:document.getElementById("deck")},t,{width:300,height:300,debug:!0}));this.$refs.map.map.on("load",function(){fetch("http://coastal-test.eu-west-1.elasticbeanstalk.com/vaklodingen").then(function(e){return e.json()}).then(function(t){var a=e.getTileUrl(t.mapid,t.token),i={id:"imageLayer",type:"raster",source:{type:"raster",tiles:[a],tileSize:256}};e.$refs.map.map.addLayer(i),e.layers.push(i)})})},methods:{getTileUrl:function(e,t){var a=["https://earthengine.googleapis.com/map",e,"{z}","{x}","{y}"].join("/");return a+="?token="+t},addDeck:function(){}}},I=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{fluid:"","fill-height":"","pa-0":""}},[a("v-mapbox",{ref:"map",staticClass:"xs12",attrs:{"access-token":"pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA","map-style":"mapbox://styles/mapbox/satellite-streets-v10",center:[4,52],zoom:10,pitch:60,bearing:-0,"min-zoom":5,id:"map"}}),e._v(" "),a("canvas",{attrs:{id:"deck",width:"300",height:"300"}})],1)},A=[],F={render:I,staticRenderFns:A},J=F,C=a("VU/8"),S=i,j=C(k,J,!1,S,"data-v-84f2ca96",null),z=j.exports,D=a("gihg"),E=a.n(D);a("uFAQ");r.a.use(x.a);var M={name:"MapCompare",data:function(){return{msg:""}},mounted:function(){new E.a(this.$refs.map1.map,this.$refs.map2.map,{mousemove:!1})},methods:{}},Q=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{staticClass:"compare",attrs:{fluid:"","fill-height":"","pa-0":""}},[a("v-mapbox",{ref:"map1",staticClass:"xs12 compare-map",attrs:{"access-token":"pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA","map-style":"mapbox://styles/mapbox/satellite-streets-v10",center:[4,52],zoom:10,pitch:60,bearing:-0,"min-zoom":5,id:"map1"}}),e._v(" "),a("v-mapbox",{ref:"map2",staticClass:"xs12 compare-map",attrs:{"access-token":"pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA","map-style":"mapbox://styles/mapbox/dark-v9",center:[4,52],zoom:10,pitch:60,bearing:-0,"min-zoom":5,id:"map2"}})],1)},U=[],O={render:Q,staticRenderFns:U},Y=O,$=a("VU/8"),Z=n,H=$(M,Y,!1,Z,null,null),T=H.exports;r.a.use(h.a);var V=new h.a({routes:[{path:"/",name:"HelloWorld",component:z},{path:"/compare",name:"MapCompare",component:T}]});r.a.use(l.a),r.a.config.productionTip=!1,new r.a({el:"#app",router:V,template:"<App/>",components:{App:f}})},QCv7:function(e,t){},fOFA:function(e,t){},o41F:function(e,t){},uFAQ:function(e,t){},uTBe:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.56e215e4fc86d0ad85b6.js.map