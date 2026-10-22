<script setup>
import { ref } from 'vue';

const total = ref(0); // [!code highlight]
</script>

<template>
  <button @click="total++">Cliques: {{ total }}</button>
</template>
