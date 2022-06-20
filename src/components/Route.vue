<template>
  <div>
    <section class="section">
      <h1>Planned route</h1>
      <table class="table is-striped">
        <tbody>
        <tr>
          <td>Band width</td>
          <td>{{ acquisitionStore.sideShotDistance.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Swimming Speed</td>
          <td>{{ acquisitionStore.swimmingSpeed.toFixed(1) }} m/s</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>


    </section>
  </div>
</template>

<script setup lang="ts">
import { useAcquisitionStore } from '@/stores/acquisition';

const acquisitionStore = useAcquisitionStore();


</script>
