<template>
  <div>
    <CameraSelection/>
    <section class="section">
      <h1>
        <SectionNumber i="3"/>
        Acquistion
      </h1>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            <!-- label -->
            Min dist to ground
            <span class="tooltip has-tooltip-right"
                  data-tooltip="The closer ground fixes the overall capture speed"
            >
            (*)
          </span>

          </label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <p class="control">
              <!-- input -->
              <input
                  v-model="acquisitionStore.distanceToGround"
                  type="number"
                  min="0.2"
                  max="10"
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

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            <!-- label -->
            Front overlap
            <span class="tooltip has-tooltip-right"
                  data-tooltip="How much the photos shall recover going front">(*)</span>
          </label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <p class="control">
              <!-- input -->
              <input
                  v-model="acquisitionStore.frontOverlapPercent"
                  type="number"
                  min="10"
                  max="1000"
                  class="input is-primary"
              >
            </p>
            <p class="control">
              <a class="button is-static">
                %
              </a>
            </p>

          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">
            <!-- label -->
            Side overlap
            <span class="tooltip has-tooltip-right"
                  data-tooltip="How much the photos shall recover side by side"
            >
            (*)
          </span>
          </label>
        </div>
        <div class="field-body">
          <div class="field has-addons">
            <p class="control">
              <!-- input -->
              <input
                  v-model="acquisitionStore.sideOverlapPercent"
                  type="number"
                  min="10"
                  max="100"
                  class="input is-primary"
              >
            </p>
            <p class="control">
              <a class="button is-static">
                %
              </a>
            </p>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useAcquisitionStore } from '@/stores/acquisition';
import { useTrajectoryStore } from '@/stores/trajectory';
import CameraSelection from '@/components/CameraSelection.vue';
import SectionNumber from '@/components/SectionNumber.vue';
const acquisitionStore = useAcquisitionStore();
const trajectoryStore = useTrajectoryStore();

watch(() => acquisitionStore.distanceToGround, () => trajectoryStore.updateTrajectory());
watch(() => acquisitionStore.sideOverlapPercent, () => trajectoryStore.updateTrajectory());


</script>
