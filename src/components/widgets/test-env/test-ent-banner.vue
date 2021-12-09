
<script>
export default {
   methods: {
        isTestModeEnabled()
        {
            return process.env.TEST_MODE;
        }
    }
};
</script>

<template>
    <div 
      v-if="isTestModeEnabled"
        class="d-flex align-items-center">
        <div class="bg-warning w-100 text-center bg-gradient font-weight-bold text-light white"><i class='bx bxs-error'></i>You are in a TEST environment. You can run into a lot of bugs !!!</div>
    </div>
</template>
