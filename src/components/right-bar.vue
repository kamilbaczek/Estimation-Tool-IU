<script>
import { layoutMethods } from "@/state/helpers";
import simplebar from "simplebar-vue";
import axios from "@/helpers/http-comunicator";

/**
 * Right sidebar component
 */
export default {
  components: {
    simplebar,
  },
  data() {
    return {
      config: {
        handler: this.handleRightBarClick,
        middleware: this.middleware,
        events: ["click"],
      },
      services:[],
      valuations:[],
      valuationId:"",
      inquiryId: ""
    };
  },
  methods: {
    ...layoutMethods,
    hide() {
      this.$parent.toggleRightSidebar();
    },
    // eslint-disable-next-line no-unused-vars
    middleware(event, el) {
      if (event.target.classList)
        return !event.target.classList.contains("toggle-right");
    },
    // eslint-disable-next-line no-unused-vars
    handleRightBarClick(e, el) {
      this.$parent.hideRightSidebar();
    },
    suggestFakeValuation()
    {
      axios
        .post("valuations-module/Valuations/valuations/proposals", {
          currency: "usd",
          value: "9999.99",
          description: "test",
          valuationId: this.valuationId,
        })
        .then(() => {
        });
    },
    madeFakeInquiry()
    {
      this.getServices();
    },
    getServices() {
      axios.get("services-module/Services")
      .then((res) => {
        this.services = res.data;
        this.madeInquiry()
     })
    },
    madeInquiry() {
      axios.post("inquries-module/Inquiries", {
        firstName: "test",
        lastName: "test",
        email: "kamilbaczek98@gmail.com",
        phoneNumber: "+48793751966",
        askedServiceDtos:[
        {
          id: this.services[0].id,
          attributes: [
        {
          attributeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          valueId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        }
      ]        }]
      })
      .then((res) => {
        this.hide();
        this.inquiryId = res.data;
        this.getAllValuations();    
        });
      },
      getAllValuations()
      {
      axios.get("valuations-module/Valuations")
       .then((res) => {
        this.valuations = res.data.valuations;
        const recentRequestValuation = this.valuations.find(valuation => valuation.inquiryId === this.inquiryId);
        this.valuationId = recentRequestValuation.valuationId;
        })
      },
    }
};
</script>

<template>
  <div>
    <div v-click-outside="config" class="right-bar">
      <simplebar class="h-100">
        <div class="rightbar-title px-3 py-4">
          <h5 class="m-0">Tests Actions</h5>
          <b-button
          variant="danger"
          class="mx-1 my-2"
          @click.prevent="madeFakeInquiry()"
          >
          <i class="bx bx-list-plus font-size-16 align-middle me-2"></i>
          Fake Inquiry
        </b-button>
        <div>Generated valuation: {{valuationId}}</div>
        <b-button
          v-if="valuationId"
          variant="danger"
          class="mx-1 my-2"
          @click.prevent="suggestFakeValuation()"
          >
          <i class="bx bx-list-plus font-size-16 align-middle me-2"></i>
          Suggest Proposal
        </b-button>
        </div>
      </simplebar>
    </div>

    <!-- Right bar overlay-->
    <div class="rightbar-overlay"></div>
  </div>
</template>
