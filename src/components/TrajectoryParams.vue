<template>
  <div>
    <div class="field is-grouped">
      <div class="control">
        <label class="label">Band width
        </label>
        <input
            :value="acquisitionStore.sideShotDistance.toFixed(2)"
            type="number"
            min="0.5"
            max="50"
            class="input is-primary"
            disabled="true"
        >

        <label class="label">Swimming point leap</label>
        <input
            v-model="trajectoryStore.pointLeap"
            type="number"
            min="0.5"
            max="50"
            class="input is-primary"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useTrajectoryStore } from '@/stores/mappingTrajectory';
import { useAcquisitionStore } from '@/stores/acquisition';

const trajectoryStore = useTrajectoryStore();
const acquisitionStore = useAcquisitionStore();

watch(() => trajectoryStore.pointLeap, () => trajectoryStore.updateTrajectory());


</script>
