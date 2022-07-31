<template>
  <div>

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
                v-model="cornerNWLat"
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
                v-model="cornerNWLong"
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
                v-model="cornerSELat"
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
                v-model="cornerSELong"
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

const cornerNWLat = ref(undefined as number|undefined);
const cornerNWLong = ref(undefined as number|undefined);
const cornerSELat = ref(undefined as number|undefined);
const cornerSELong = ref(undefined as number|undefined);

const mappingAreaStore = useMappingAreaStore();

watch(() => mappingAreaStore.perimeter, updatedPerimeter);

function updatedPerimeter() {
  const cornerNW = mappingAreaStore.cornerNW;
  cornerNWLat.value = cornerNW[1] ;
  cornerNWLong.value = cornerNW[0];
  const cornerSE = mappingAreaStore.cornerSE;
  cornerSELat.value = cornerSE[1];
  cornerSELong.value = cornerSE[0];
}

function is4corners() {
  return cornerNWLat.value && cornerNWLong.value && cornerSELat.value && cornerSELong.value;
}

function updateCorners() {
  if (!is4corners()) {
    return;
  }
  const maxLong = Math.max(cornerNWLong.value as number, cornerSELong.value as number);
  const minLong = Math.min(cornerNWLong.value as number, cornerSELong.value as number);
  const maxLat = Math.max(cornerNWLat.value as number, cornerSELat.value as number);
  const minLat = Math.min(cornerNWLat.value as number, cornerSELat.value as number);
  mappingAreaStore.perimeter = new MappingPerimeter(
      [
        [minLong, minLat],
        [maxLong, minLat],
        [maxLong, maxLat],
        [minLong, maxLat],
      ]
  );
}
</script>

