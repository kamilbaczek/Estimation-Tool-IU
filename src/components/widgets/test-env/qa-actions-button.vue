
<script>
export default {
    methods: {
    toggleRightSidebar() {
        this.$parent.$parent.toggleRightSidebar();
        },
        isTestModeEnabled()
        {
            return process.env.TEST_MODE;
        }
    }
};
</script>
<template>
<div>
<button 
        v-if="isTestModeEnabled"
        @click="toggleRightSidebar" type="button" class="btn header-item noti-icon right-bar-toggle toggle-right"           
        v-b-tooltip.hover
        title="QA Tools"
        >
        <i class="bx bxs-bug toggle-right"></i></button></div>
</template>

