<template>
  <div>
    <section class="section">
      <h1>Planned route</h1>
      <table class="table is-striped is-fullwidth">
        <tbody>
        <tr>
          <td>Area</td>
          <td>{{ mappingAreaStore.width.toFixed(0) }} x  {{ mappingAreaStore.height.toFixed(0) }} = {{ mappingAreaStore.area.toFixed(0) }} m<sup>2</sup></td>
        </tr>
        <tr>
          <td>Band width</td>
          <td>{{ acquisitionStore.sideShotDistance.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Distance</td>
          <td>{{trajectoryStore.distance.toFixed(0) }} m
          </td>
        </tr>
        <tr>
          <td>Moving speed</td>
          <td>{{ acquisitionStore.swimmingSpeed.toFixed(1) }} m/s, {{ (acquisitionStore.swimmingSpeed *3.6).toFixed(1)}} km/h </td>
        </tr>
        <tr>
          <td>Duration</td>
          <td>{{trajectoryStore.duration.toFixed(0) }} s
          </td>
        </tr>
        <tr>
          <td>Nb photos</td>
          <td>{{Math.round(trajectoryStore.duration/acquisitionStore.shotTimeInterval) }}
          </td>
        </tr>

        <tr>
          <td><button class="button is-primary" v-on:click="downloadTrajectory()">Download</button></td>
          <td></td>
        </tr>
        </tbody>
      </table>


    </section>
  </div>
</template>

<script setup lang="ts">
import {pathLength} from "@/models/track";
import { useAcquisitionStore } from '@/stores/acquisition';
import { useMappingAreaStore } from '@/stores/mappingArea';
import { useTrajectoryStore } from '@/stores/trajectory';
import { trajectoryExport } from '@/services/trajectory-exporter';

const acquisitionStore = useAcquisitionStore();
const mappingAreaStore = useMappingAreaStore();
const trajectoryStore = useTrajectoryStore();

function downloadTrajectory() {
  const fileContents=trajectoryExport(trajectoryStore.pointPrefix, trajectoryStore.trajectory);
  const fileName= trajectoryStore.routeFilename;

  const pp = document.createElement('a');
  pp.setAttribute('href', 'data:application/CSV;charset=utf-8,' + encodeURIComponent(fileContents));
  pp.setAttribute('download', fileName);
  pp.click();
  pp.remove();
}

</script>
