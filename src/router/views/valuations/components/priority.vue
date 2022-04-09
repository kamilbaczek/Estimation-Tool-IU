<script>
export default {
  props: {
    priority: {
      type: String,
      default: "",
    },
  },
  methods: {
    getClassByStatus() {
      switch (this.priority) {
        case "Low":
          return "bg-success";
        case "Medium":
          return "bg-info";
        case "High":
          return "bg-warning";
        case "Critical":
          return "bg-danger";
      }
    },
  },
};
</script>

<template>
  <span class="badge et-badge" :class="getClassByStatus()"> {{ priority }}</span>
</template>

<style scoped>
.et-badge {
  font-size: 0.9em;
}
</style>
