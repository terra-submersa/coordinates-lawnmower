<template>
  <section class="hero">
    <div class="hero-body">
      <p class="title">
        Swimming photogrammetry lawnmowner trajectory capture
      </p>
      <p class="subtitle">
        Capturing a swimming trajectory in shallow water and exporting for Emlid Reach RS.
      </p>
      <p>
        Tools exist to draw trajectories for drones in order to upload trajectories and send them to collect aerial
        images for photogrammetry.
        However, these tools are not suited to compute such trajectory at low altitudes, typically when surveying
        shallow water (it's mainly a matter of parameter ranges).
      </p>
      <div>
        We propose here a tool to:
        <ol>
          <li>capture the surveying area</li>
          <li>Selecting a camera, the view mode, and shot time intervals;</li>
          <li>The distance to the ground, and picture overlaps;</li>
          <li>The distance between the reported point on the map (swimming to one to the next), the angle of the route
            (take two in order to limit bowing effects), and the point naming;
          </li>
        </ol>
        You will then be able to export the route and import it in an Emlid ReachView project.
      </div>
    </div>
  </section>
  <div>
    <div id="mapViewport" class="mapViewport map-viewport">
    </div>
  </div>
  <div class="columns">
    <div class="column">
      <section class="section">
        <h1>
          <SectionNumber i="1"/>
          Perimeter
        </h1>
        <button class="button is-primary" v-on:click="drawRectangle">
          Draw perimeter
        </button>

        <PerimeterCorners/>
      </section>
      <AcquisitionParams/>
      <TrajectoryParams/>
    </div>
    <div class="column">
      <Route/>
    </div>
    <div id="mouse-position"></div>
  </div>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        By <a href="https://www.linkedin.com/in/alexmass/">Alexandre Masselot</a>, with Terra Submersa at University of
        Geneva.
        The source code is available on <a href="https://github.com/terra-submersa/coordinates-lawnmower">Github</a> and
        licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useMappingAreaStore } from '@/stores/mappingArea';
import MappingPerimeter from '@/models/mappingPerimeter';
import View from 'ol/View';
import Map from 'ol/Map';
import { OSM, Vector as VectorSource, } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { useGeographic } from 'ol/proj';
import { Circle, LineString } from 'ol/geom';
import Draw, { createBox, } from 'ol/interaction/Draw';
import { Feature } from 'ol';
import { Fill, Stroke, Style } from 'ol/style';
import type { Coordinate } from 'openlayers';
import { defaults as defaultControls, MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { useTrajectoryStore } from '@/stores/trajectory';
import TrajectoryParams from '@/components/TrajectoryParams.vue';
import AcquisitionParams from '@/components/AcquisitionParams.vue';
import Route from '@/components/Route.vue';
import SectionNumber from '@/components/SectionNumber.vue';
import PerimeterCorners from '@/components/PerimeterCorners.vue';

const mappingAreaStore = useMappingAreaStore();
const trajectoryStore = useTrajectoryStore();

watch(() => mappingAreaStore.perimeter, () => trajectoryStore.updateTrajectory());
watch(() => mappingAreaStore.perimeter, () => refreshTrajectory);
watch(() => trajectoryStore.trajectory, refreshTrajectory);


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

const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:3857',
});

let map: Map;
onMounted(() => {
  map = new Map({
    layers: [raster, perimeterLayer, trajectoryLayer],
    controls: defaultControls().extend([mousePositionControl]),
    target: 'mapViewport',
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
    // name: 'drawRectangle',
    source: perimeterSource,
    type: 'Circle',
    geometryFunction: createBox(),
  });
  map.addInteraction(draw);

  draw.on('drawend', function (e) {
    map.removeInteraction(draw);

    const coordinates = (e.feature.getGeometry() as any).getCoordinates()[0];
    coordinates.pop();
    const perimeter = new MappingPerimeter(
        coordinates.map((p: Coordinate) => [...p])
    );

    mappingAreaStore.perimeter = perimeter;
  });
}

function refreshTrajectory() {
  trajectorySource.clear();
  const trajectory = trajectoryStore.trajectory;
  if (!(trajectory)) {
    return;
  }

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
