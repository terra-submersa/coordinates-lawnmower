<template>
  <div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-primary" v-on:click="drawRectangle">Draw perimeter</button>
      </div>
      <div class="control">
        <label class="label">Band width
        </label>
        <input
            v-model="mappingAreaStore.bandWidth"
            type="number"
            min="0.5"
            max="50"
            class="input is-primary"
        >
      </div>
      <div class="control">
        <label class="label">Point leap</label>
        <input
            v-model="mappingAreaStore.pointLeap"
            type="number"
            min="0.5"
            max="50"
            class="input is-primary"
        >
      </div>
    </div>
  </div>
  <div>
    <div :ref="mapViewport" class="map-viewport">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMappingAreaStore } from '@/stores/mappingArea';
import MappingPerimeter from '@/models/mappingPerimeter';
import View from 'ol/View';
import Map from 'ol/Map';
import { OSM, Vector as VectorSource, } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { LineString, Circle } from 'ol/geom';
import Draw, {
  createBox,
} from 'ol/interaction/Draw';
import { lawnMowerTrajectory } from '@/models/track';
import { Feature } from 'ol';
import { Stroke, Style, Fill } from 'ol/style';

const mappingAreaStore = useMappingAreaStore();

mappingAreaStore.$subscribe((mutation, state) => {
  if (mutation.events.key === 'bandWidth' || mutation.events.key === 'pointLeap') {
    refreshTrajectory();
  }
});

const mapViewport = ref('mapViewport');
useGeographic();

const raster = new TileLayer({
  source: new OSM(),
});

const perimeterSource = new VectorSource({wrapX: false});
const perimeterLayer = new VectorLayer({
  source: perimeterSource,
});

const trajectorySource = new VectorSource({wrapX: false});
const trajectoryLayer = new VectorLayer({
  source: trajectorySource,
  style: [
    new Style({
      stroke: new Stroke({
        color: 'orangered',
        width: 2
      }),
      fill: new Fill({
        color: 'orangered'
      })
    })
  ]
});


let map: Map;
onMounted(() => {

  map = new Map({
    layers: [raster, perimeterLayer, trajectoryLayer],
    target: mapViewport.value,
    view: new View({
      center: [23.1319788, 37.4283254],
      zoom: 17,
    }),
  });

});

function drawRectangle() {
  perimeterSource.clear();
  trajectorySource.clear();

  const draw = new Draw({
    name: 'drawRectangle',
    source: perimeterSource,
    type: 'Circle',
    geometryFunction: createBox(),
  });
  map.addInteraction(draw);

  draw.on('drawend', function (e) {
    map.removeInteraction(draw);

    const coordinates = e.feature.getGeometry().getCoordinates()[0];
    coordinates.pop();
    const perimeter = new MappingPerimeter(
        coordinates.map(p => [...p])
    );

    mappingAreaStore.perimeter = perimeter;

    refreshTrajectory();
  });
}

function refreshTrajectory() {
  trajectorySource.clear();
  if (!(mappingAreaStore.bandWidth && mappingAreaStore.pointLeap && mappingAreaStore.perimeter)) {
    return;
  }
  const trajectory = lawnMowerTrajectory(
      mappingAreaStore.perimeter,
      mappingAreaStore.bandWidth,
      mappingAreaStore.pointLeap
  );
  mappingAreaStore.trajectory = trajectory;

  // add circles
  const polyline = new LineString(trajectory);
  const feature = new Feature(polyline);
  trajectorySource.addFeature(feature);
  trajectory.forEach(p => trajectorySource.addFeature(new Feature(new Circle(p, 0.000002))));

}
</script>

<style>
.map-viewport {
  height: 500px;
  width: 100%;
}
</style>
