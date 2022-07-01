<template>
  <div>
        <span class="icon">
          <i :class="'fas fa-'+props.i"></i>
        </span>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  i: {
    type: String,
    required: true
  }
});
</script>
<style scoped>
div {
  float: left;
  height: 2.3rem;
  width: 2.3rem;
  text-align: center;
  font-size: 1.5rem;
  color: grey;
  border-color: grey;
  border-width: 2px;
  border-style: solid;
  border-radius: 50%;
  margin-right: .5rem;
}

</style>
