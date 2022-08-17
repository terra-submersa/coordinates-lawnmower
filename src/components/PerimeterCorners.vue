<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          Coords system
        </label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
                type="radio"
                v-model="coordsSystem"
                :value="COORDS_UTM"
                v-on:click="updateCoordSystem"
            >UTM
            <input
                type="radio"
                v-model="coordsSystem"
                :value="COORDS_LON_LAT"
                v-on:click="updateCoordSystem"
            >long/lat (deg)
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          long
        </label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
                v-model="cornerNWX"
                class="input is-primary"
                type="number"
            >
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          lat
        </label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
                v-model="cornerNWY"
                class="input is-primary"
                type="number"
            >
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          long
        </label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
                v-model="cornerSEX"
                class="input is-primary"
                type="number"
            >
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          lat
        </label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input
                v-model="cornerSEY"
                class="input is-primary"
                type="number"
            >
          </p>
        </div>
      </div>
    </div>
  </div>
  <button class="button is-primary"
          v-on:click="updateCorners"
          :disabled="!is4corners()"
  >
    update
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMappingAreaStore } from '@/stores/mappingArea';
import MappingPerimeter from '@/models/mappingPerimeter';
import { toLonLatCoords, toUTMCoords } from '@/models/track';
import type { Coordinate } from 'openlayers';

const cornerNWX = ref<number>();
const cornerNWY = ref<number>();
const cornerSEX = ref<number>();
const cornerSEY = ref<number>();

const mappingAreaStore = useMappingAreaStore();

const COORDS_UTM = 'UTM';
const COORDS_LON_LAT = 'COORDS_LON_LAT';
const coordsSystem = ref(COORDS_LON_LAT);

watch(() => mappingAreaStore.perimeter, updatedPerimeter);

function updatedPerimeter() {
  const cornerNW = mappingAreaStore.cornerNW;
  const cornerSE = mappingAreaStore.cornerSE;
  if (coordsSystem.value === COORDS_LON_LAT) {
    cornerNWX.value = cornerNW[0];
    cornerNWY.value = cornerNW[1];
    cornerSEX.value = cornerSE[0];
    cornerSEY.value = cornerSE[1];
  } else {
    const utmNW = toUTMCoords(cornerNW as Coordinate);
    const utmSE = toUTMCoords(cornerSE as Coordinate);
    console.log('updated perimeter UTM', utmNW.zone, utmSE.zone);
    cornerNWX.value = utmNW.coords[0];
    cornerNWY.value = utmNW.coords[1];
    cornerSEX.value = utmSE.coords[0];
    cornerSEY.value = utmSE.coords[1];
  }
}

function is4corners() {
  console.log(cornerNWY.value, cornerNWX.value, cornerSEY.value, cornerSEX.value);
  return (cornerNWY.value !== undefined) &&
      (cornerNWX.value !== undefined) &&
      (cornerSEY.value !== undefined) &&
      (cornerSEX.value !== undefined);
}

function updateCoordSystem() {
  if (!is4corners()) {
    cornerNWX.value = undefined;
    cornerNWY.value = undefined;
    cornerSEX.value = undefined;
    cornerSEY.value = undefined;
    return;
  }
  console.log('switching', coordsSystem.value);
  if (coordsSystem.value === COORDS_UTM) {
    const nw = toLonLatCoords([cornerNWX.value, cornerNWY.value] as Coordinate, 'UTM:34N');
    const se = toLonLatCoords([cornerSEX.value, cornerSEY.value] as Coordinate, 'UTM:34N');
    console.log(cornerNWX.value, cornerNWY.value, nw);
    console.log(cornerSEX.value, cornerSEY.value, se);
    cornerNWX.value = nw[0];
    cornerNWY.value = nw[1];
    cornerSEX.value = se[0];
    cornerSEY.value = se[1];
  } else {
    const nw = toUTMCoords([cornerNWX.value, cornerNWY.value] as Coordinate);
    const se = toUTMCoords([cornerSEX.value, cornerSEY.value] as Coordinate);
    console.log(cornerNWX.value, cornerNWY.value, nw);
    console.log(cornerSEX.value, cornerSEY.value, se);
    cornerNWX.value = nw.coords[0];
    cornerNWY.value = nw.coords[1];
    cornerSEX.value = se.coords[0];
    cornerSEY.value = se.coords[1];
  }
}

function updateCorners() {
  if (!is4corners()) {
    console.log('corners NOT all defined');
    return;
  }
  console.log('corners all defined');

  const maxX = Math.max(cornerNWX.value as number, cornerSEX.value as number);
  const minX = Math.min(cornerNWX.value as number, cornerSEX.value as number);
  const maxY = Math.max(cornerNWY.value as number, cornerSEY.value as number);
  const minY = Math.min(cornerNWY.value as number, cornerSEY.value as number);
  if (coordsSystem.value === COORDS_LON_LAT) {
    mappingAreaStore.perimeter = new MappingPerimeter(
        [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
        ]
    );
  } else {
    const llMax = toLonLatCoords([maxX, maxY] as Coordinate, 'UTM:34N');
    const llMin = toLonLatCoords([minX, minY] as Coordinate, 'UTM:34N');
    console.log('UTM perimeter', llMax, llMin);
    mappingAreaStore.perimeter = new MappingPerimeter(
        [
          [llMin[0], llMin[1]],
          [llMax[0], llMin[1]],
          [llMax[0], llMax[1]],
          [llMin[0], llMax[1]],
        ]
    );
  }
}
</script>

