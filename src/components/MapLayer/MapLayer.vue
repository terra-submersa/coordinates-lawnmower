<template>
  <div class="MapLayer">
    <div id="map"></div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet/dist/leaflet-src';
import 'leaflet-draw/dist/leaflet.draw-src';
import { onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useMappingAreaStore } from '@/stores/mappingArea';
import MappingPerimeter from '@/models/mappingPerimeter';

const mappingAreaStore = useMappingAreaStore();

onMounted(() => {
  const map = L.map('map').setView([37.4298357, 23.1321832], 19);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  const editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);

  var options = {
    position: 'topright',
    draw: {
      polyline: false,
      polygon: false,
      circle: false,
      circlemarker: false,

      rectangle: {
        showArea: false,
        shapeOptions: {
          clickable: true
        }
      },
      marker: false
    },
    edit: {
      featureGroup: editableLayers,
      remove: true
    }
  };

  const drawControl = new L.Control.Draw(options);
  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, function (e) {
    const type = e.layerType,
        layer = e.layer;

    if (type === 'rectangle') {

      const latLngs = layer.getLatLngs()
      console.log(latLngs)
      console.log(L.GeometryUtil.geodesicArea(latLngs));
      useMappingAreaStore.perimeter = new MappingPerimeter(latLngs)
    }

    editableLayers.addLayer(layer);
  });
});

</script>

<style>
#map {
  height: 500px;
}
</style>
