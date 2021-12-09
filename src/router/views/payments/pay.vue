<script>
import axios from "@/helpers/http-comunicator";
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import "v-credit-card/dist/VCreditCard.css";

import appConfig from "@/app.config";
import VCreditCard from "v-credit-card";

export default {
  page: {
    title: "Payment",
    meta: [
      {
        name: "payment",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    VCreditCard,
  },
  data() {
    return {
      name: "",
      cardNumber: "",
      expiration: "",
      security: "",
      paymentId: null,
    };
  },
  mounted() {
    this.paymentId = this.$route.params.paymentId;
  },
  methods: {
    creditInfoChanged(values) {
      for (const key in values) {
        this[key] = values[key];
      }
    },
    submit() {
      axios
        .post("payments-module/payments/", {
          paymentId: this.paymentId,
          name: this.name,
          card:{
            cardNumber: this.cardNumber,
            expMonth: parseInt(this.expiration.split("/")[0]),
            expYear: parseInt(this.expiration.split("/")[1]),
            cvc: this.security,
          }
        })
        .then(() => {
           this.$etToast("Payment successful !!!");
        })
        .catch((err) =>
        {
           this.$etToastDanger(err.message);
        });
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <VCreditCard @change="creditInfoChanged" />

    <b-button
      variant="info"
      class="my-2 mx-auto"
      v-b-tooltip.hover
      title="Pay"
      @click="submit"
    >
      Pay
    </b-button>
  </Layout>
</template>
