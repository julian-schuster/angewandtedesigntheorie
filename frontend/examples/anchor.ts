import * as THREE from "three";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  PCFSoftShadowMap,
  sRGBEncoding,
  Mesh,
  BoxBufferGeometry,
  MeshNormalMaterial,
  MathUtils,
  Vector3,
} from "three";
import {
  LOADER_OPTIONS,
  MAP_ID
} from "./config";
import {
  ThreeJSOverlayView,
  latLngToVector3,
  WORLD_SIZE
} from "../src";
import {
  Loader
} from "@googlemaps/js-api-loader";
import * as JQuery from "jquery";

const $ = JQuery.default;

// setting initial values for required parameters
let acceleration = 15;
let bounce_distance = 400000;
let time_step = 5;
// time_counter is calculated to be the time the ball just reached the top position
// this is simply calculated with the s = (1/2)gt*t formula, which is the case when ball is dropped from the top position
let time_counter = Math.sqrt((bounce_distance * 2) / acceleration);
let initial_speed = acceleration * time_counter;
//Performs Bouncing Animation for selected Stations
function bounceSelectedStations() {
  for (let i = 0; i < bounceStations.length; i++) {
    if (bounceStations[i].mesh.position.y < bounceStations[i].initPos.y) {
      bounceStations[i].bounceTimer = 0;
    }
    // calculate sphere position with the s2 = s1 + ut + (1/2)gt*t formula
    // this formula assumes the ball to be bouncing off from the bottom position when time_counter is zero
    bounceStations[i].mesh.position.y =
      bounceStations[i].initPos.y +
      initial_speed * bounceStations[i].bounceTimer -
      0.5 * acceleration * Math.pow(bounceStations[i].bounceTimer, 2);
    bounceStations[i].bounceTimer +=
      time_step + 0.1 * bounceStations[i].apiElement.aqi;
  }
}

const API_TOKEN = "d682992ef96ee97090732fae769b5dda151a69cc";

var MeasureStationList = [];
let intersectedStations = [];
let bounceStations = [];

$(document).on("change", "#countryTbl>tr>td>input", function (e) {
  let key = $(this).attr("id");

  var filteredObjs = MeasureStationList.filter((x) => x.id == key);

  filteredObjs.forEach((element) => {
    element.mesh.visible = !element.mesh.visible;
  });
});

$(document).on("click", "#showAllCountriesBtn", function (e) {
  MeasureStationList.filter((x) => x.mesh.visible == false).forEach(
    (element) => {
      element.mesh.visible = true;
    }
  );

  let elements = $("#countryTbl>tr>td>input");

  console.log(elements);

  for (let i = 0; i < elements.length; i++) {
    $(elements[i]).prop("checked", true);
  }
});

$(document).on("click", "#stationsname-header", function (e) {
  sortTable(0);
});

//heading: 45,
//tilt: 67,
const mapOptions = {
  center: {
    lng: 9.686856998342828,
    lat: 50.56532483245101,
  },
  mapId: MAP_ID,
  zoom: 8,
};

new Loader(LOADER_OPTIONS).load().then(() => {
  // instantiate the map
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  // instantiate a ThreeJS Scene
  const scene = new THREE.Scene();
  //load all Stations from waqi REST-API and their AQI values 
  $.get(
    "http://localhost/angewandtedesigntheorie/frontend/src/countryBounds.json", // url
    function (data) {
      let countryCounter = 0;
      let countryAmount = Object.entries(data).length;
      for (const [key, value] of Object.entries(data)) {
        let country = value;
        let url =
          "https://api.waqi.info/v2/map/bounds?latlng=" +
          country.ne.lat +
          "," +
          country.ne.lon +
          "," +
          country.sw.lat +
          "," +
          country.sw.lon +
          "&networks=all&token=" +
          API_TOKEN;
        $.get(
          url, // url
          function (data) {
            if (data.data.length > 0) {
              $("#countryTbl").append(
                '<tr><td><input type="checkbox" id="' +
                key +
                '" ></td><td>' +
                key +
                "</td></tr>"
              );
              data.data.forEach((element) => {
                element.id = key;
                if (!isNaN(element.aqi)) {
                  addMarker(scene, element);
                }
              });
            }
          }
        ).then(function () {
          if (countryCounter < countryAmount) {
            countryCounter++;
          }

          if (countryCounter == countryAmount) {
            //Default Countries on startup
            var perDefaultCountries = [
              "FRA",
              "DEU",
              "GBR",
              "ITA",
              "CHI",
              "ESP",
              "AUT",
              "CZE",
              "POL",
              "DNK",
            ];

            //turn on selected countries again
            var filteredObjs = MeasureStationList.filter((x) =>
              perDefaultCountries.includes(x.id)
            );

            filteredObjs.forEach((element) => {
              element.mesh.visible = !element.mesh.visible;
            });

            for (let i = 0; i < perDefaultCountries.length; i++) {
              $("#" + perDefaultCountries[i]).prop("checked", true);
            }
          }
        });
      }
    }
  );

  //Ambient Light
  const light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);
  //scene.add(new THREE.AxesHelper(WORLD_SIZE));

  // add ThreeJS Overlay view anchored to center of map
  const overlay = new ThreeJSOverlayView({
    scene,
    map,
    THREE: {
      Scene,
      WebGLRenderer,
      PerspectiveCamera,
      PCFSoftShadowMap,
      sRGBEncoding,
    },
  });

  //Create Selection Plane
  const geometry = new THREE.BoxGeometry(100000, 100000);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    opacity: 0.1,
    transparent: true,
  });
  const circle = new THREE.Mesh(geometry, material);
  circle.rotateX(80);
  circle.position.copy(latLngToVector3(mapOptions.center));
  scene.add(circle);
  //start scalingfac at 1
  let currentScaleFac = 1;
  $(document).on("change", "#inputSearchRadius", function (e) {

    let selectedScaleFac = $(this).val();
    let currentScaleVec = circle.scale;

    if (selectedScaleFac > currentScaleFac) {
      for (let i = 0; i < selectedScaleFac - currentScaleFac; i++) {
        currentScaleVec.multiplyScalar(2);
      }
    } else {
      for (let i = 0; i < currentScaleFac - selectedScaleFac; i++) {
        currentScaleVec.multiplyScalar(0.5);
      }
    }
    currentScaleFac = selectedScaleFac;
  });

  google.maps.event.addListener(map, "rightclick", function (e) {

    $('#selectedStationsTbl > tbody').html("")
    remove_duplicates_safe(intersectedStations).forEach(element => {
      $('#selectedStationsTbl > tbody').append("<tr><td>" + element.station.name + "</td><td>" + element.aqi + "</td></tr>");
    });

  });

  function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      if (!(arr[i].uid in seen)) {
        ret_arr.push(arr[i]);
        seen[arr[i].uid] = true;
      }
    }
    return ret_arr;
  }

  google.maps.event.addListener(map, "mousemove", function (event) {
    let pnt = event.latLng;
    var lat = pnt.lat();
    var lng = pnt.lng();
    let location = new google.maps.LatLng(lat, lng);
    let test = {
      center: {
        lng: 9.686856998342828,
        lat: 50.56532483245101,
      },
    };
    test.center.lng = lng;
    test.center.lat = lat;
    circle.position.copy(latLngToVector3(test.center));

    let circleBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    circleBB.setFromObject(circle);

    intersectedStations = [];

    if (bounceStations.length > 0) {
      for (let i = 0; i < bounceStations.length; i++) {
        bounceStations[i].mesh.position.copy(bounceStations[i].initPos);

        // console.log(bounceStations[i]);
      }

      bounceStations = [];
    }

    //TODO BoundingSphere instead of Box for better Collision detection
    //Moving Objects update BoundingBox
    MeasureStationList.forEach((station) => {
      //Create new BB Here  otherwise not working properly
      let stationBB = station.bb;

      if (circleBB.intersectsBox(stationBB) && station.mesh.visible) {
        station.mesh.material.color = new THREE.Color("blue");
        intersectedStations.push(station.apiElement);
        bounceStations.push(station);
      } else {
        station.mesh.material.color = new THREE.Color(station.initColor);
      }
    });

    if (intersectedStations.length > 0) {
      //Update Average AQI in GUI
      let avgAQI = 0;

      for(let i = 0; i < intersectedStations.length;i++) {

        avgAQI  += Number(intersectedStations[i].aqi);
      }

      avgAQI /=intersectedStations.length;

      $("#aqiLabel>label").empty();
      $("#aqiLabel>label").append(""+Math.floor(avgAQI));

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/api/data",
        data: JSON.stringify(intersectedStations),
        contentType: "application/json",
        success: function (result) {
          // console.log('Call was successful');
        },
      });
    }
  });

  //Enable specific countries

  const animate = () => {
    //bounceSelectedStations();
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
});

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = $('#selectedStationsTbl');

  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table[0].rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// Function for adding a THREE marker to the page.
function addMarker(scene, element) {
  let color = "#009966";
  if (element.aqi >= 50) {
    color = "#ffde33";
  } if (element.aqi >= 100) {
    color = "#ff9933";
  } if (element.aqi >= 150) {
    color = "#cc0033";
  } if (element.aqi >= 200) {
    color = "#660099";
  } if (element.aqi >= 300) {
    color = "#7e0023";
  }

  const box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(10000, 5000 * element.aqi, 10000),
    new THREE.MeshStandardMaterial({
      color: color,
    })
  );

  let location = new google.maps.LatLng(element.lat, element.lon);

  box.position.copy(latLngToVector3(location));
  try {
    scene.add(box);
  } catch (error) {
    console.log(error);
  }

  let addedObj = {
    mesh: box,
    bb:new THREE.Box3().setFromObject(box),
    apiElement: element,
    initColor: color,
    initPos: new THREE.Vector3(box.position.x, box.position.y, box.position.z),
    bounceTimer: Math.sqrt((bounce_distance * 2) / acceleration),
    id: element.id,
  };

  //per Default Box is not visible
  box.visible = false;
  
  //Global Array holding all necessary informations about a station object
  MeasureStationList.push(addedObj);
}
