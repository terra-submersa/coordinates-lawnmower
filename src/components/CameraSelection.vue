<template>
  <section class="section">
    <h1>Camera</h1>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          <!-- label -->
          Model
        </label>
      </div>
      <div class="field-body">
        <div class="field  has-addons">
          <p class="control">
            <!-- input -->
            <select
                :value="acquisitionStore.selectedCamera"
                v-on:change="setCamera"
                class="input is-primary"

            >
              <option v-for="camera in acquisitionStore.cameraLibrary" :value="camera">
                {{ camera.name }}
              </option>
            </select>

          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          <!-- label -->
          View mode
        </label>
      </div>
      <div class="field-body">
        <div class="field  has-addons">
          <p class="control">
            <!-- input -->
            <select
                v-model="acquisitionStore.selectedViewMode"
                class="input is-primary"
            >
              <option v-for="viewMode in acquisitionStore.selectedCamera.viewModes" :value="viewMode">
                {{ viewMode.name }}
              </option>

            </select>
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          <!-- label -->
          Shot time interval
        </label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <p class="control">
            <!-- input -->
            <input
                v-model="acquisitionStore.shotTimeInterval"
                type="number"
                min="1"
                max="10"
                class="input is-primary"
            >
          </p>
          <p class="control">
            <a class="button is-static">
              s
            </a>
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAcquisitionStore } from '@/stores/acquisition';
import { watch } from 'vue';
import { useTrajectoryStore } from '@/stores/mappingTrajectory';

const acquisitionStore = useAcquisitionStore();
const trajectoryStore = useTrajectoryStore();

watch(() => acquisitionStore.selectedViewMode, () => trajectoryStore.updateTrajectory());


function setCamera(e) {
  acquisitionStore.setCamera(e.target.value);
}
</script>
