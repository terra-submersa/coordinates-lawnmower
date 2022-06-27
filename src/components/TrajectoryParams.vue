<template>
  <section class="section">
    <h1>
      <SectionNumber i="4"/>
      Navigation
    </h1>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">
          Point leaps
          <span class="tooltip has-tooltip-right"
                data-tooltip="Distance between 2 points on the GPS swimming track">(*)</span>
        </label>
      </div>
      <div class="field-body">
        <div class="field has-addons">
          <p class="control">
            <input
                v-model="trajectoryStore.pointLeap"
                type="number"
                min="0.5"
                max="50"
                class="input is-primary"
            >
          </p>
          <p class="control">
            <a class="button is-static">
              m
            </a>
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useTrajectoryStore } from '@/stores/mappingTrajectory';
import { useAcquisitionStore } from '@/stores/acquisition';
import SectionNumber from '@/components/SectionNumber.vue';

const trajectoryStore = useTrajectoryStore();
const acquisitionStore = useAcquisitionStore();

watch(() => trajectoryStore.pointLeap, () => trajectoryStore.updateTrajectory());


</script>
