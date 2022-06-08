<template>
  <div>
    <div class="control">
      <button class="button is-link" v-on:click="drawRectangle">Submit</button>
    </div>
    <div>
      <div :ref="mapViewport" class="map-viewport">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMappingAreaStore } from '@/stores/mappingArea';
import MappingPerimeter from '@/models/mappingPerimeter';
import View from 'ol/View';
import Map from 'ol/Map';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import Draw, {
  createBox,
} from 'ol/interaction/Draw';

const mappingAreaStore = useMappingAreaStore();

// const center = ref([23.1319788, 37.4283254]);
// const projection = ref('EPSG:4326');
// const zoom = ref(17);
// const rotation = ref(0);


const mapViewport = ref('mapViewport');

useGeographic();

const raster = new TileLayer({
  source: new OSM(),
});

const vectorSource = new VectorSource({wrapX: false});
const vector = new VectorLayer({
  source: vectorSource,
});



let map: Map;
onMounted(() => {

  map = new Map({
    layers: [raster, vector],
    target: mapViewport.value,
    view: new View({
      center: [23.1319788, 37.4283254],
      zoom: 16,
    }),
  });
  console.log(map.getInteractions())


});


function drawRectangle(){
  const draw = new Draw({
    name: 'drawRectangle',
    source: vectorSource,
    type: 'Circle',
    geometryFunction: createBox(),
  });
  const x = map.addInteraction(draw);
  console.log(x)

  draw.on('drawend', function (e) {
    console.log(e.feature.getGeometry().getExtent())
    const currentFeature = e.feature;//this is the feature fired the event
    map.removeInteraction(draw);
  });


}
</script>

<style>
.map-viewport {
  height: 500px;
  width: 100%;
}
</style>
