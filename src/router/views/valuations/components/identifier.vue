<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  methods: {
    getLastFourChars()
    {
      const idCodeCharsNumber = 4;
      return this.id.slice(0, idCodeCharsNumber)
    }
  },
};
</script>

<template>
  <span class="badge et-id-badge bg-info">{{ getLastFourChars() }}</span>
</template>

<style scoped>
.et-id-badge {
  text-transform: uppercase;
  font-size: 1.0em;
}
</style>
