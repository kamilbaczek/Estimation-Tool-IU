<script>
import Auth from "../../../../layouts/auth.vue";
import axios from "@/helpers/http-comunicator";

export default {
  page: {
    title: "Valuations - Approved",
  },
  components: {
    Auth,
  },
  data() {
    return {
      valuationId: "",
      proposalId: "",
      approved: false
    };
  },
  mounted() {
    this.valuationId = this.$route.params.id;
    this.proposalId = this.$route.params.proposalId;

    this.approve();
  },
  methods: {
    approve() {
      axios
          .patch('valuations-module/Valuations/proposals/approve',  {
            valuationId: this.valuationId,
            proposalId: this.proposalId,
          })
          .then(() => {
            this.approved = true;
          });
    },
  },
};
</script>

<template>
  <Auth>
    <h1 v-if="approved" class="text-center">Proposal Approved</h1>
  </Auth>
</template>
