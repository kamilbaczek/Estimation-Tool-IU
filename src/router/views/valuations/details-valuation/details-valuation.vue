<script>
import axios from "@/helpers/http-comunicator";
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import SuggestProposalModal from "./suggest-proposal-modal/suggest-proposal-modal";
import ListServices from "./list-services/list-services";
import History from "./history/history.vue";
import Status from "../components/status";

import appConfig from "@/app.config";

export default {
  page: {
    title: "Valuations Details",
    meta: [
      {
        name: "valuations",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    ListServices,
    SuggestProposalModal,
    Status,
    History,
  },
  data() {
    return {
      valuationId: "",
      inquiryDetails: {
        information: {
          fullname: ""
        }
      },
      valuationInformation: {},
      servicesIds: [],
      title: "Valuations",
      items: [
        {
          text: "Valuations",
          href: "/valuations/",
        },
        {
          text: "Details",
          active: true,
        },
      ],
    };
  },
  mounted() {
    this.valuationId = this.$route.params.id;
    this.loadData();
  },
  methods: {
      openSuggestModal() {
      this.$refs.suggestProposalModal.show();
    },
    complete() {
        axios
        .patch('valuations-module/Valuations/complete',  {
          valuationId: this.valuationId,
        })
        .then(() => {
          this.loadData();
        });
    },
    loadData() {
    const context = this;
    axios
    .get(`valuations-module/valuations/${this.valuationId}`)
    .then((res) => {
        this.valuationInformation = res.data.valuationInformation;
        context.loadInquiries();
     });
    },
    loadInquiries() {
      axios
        .get(`inquries-module/Inquiries/${this.valuationInformation.inquiryId}`)
        .then((res) => {
          this.inquiryDetails = res.data.inquiryDetails;
          this.servicesIds = res.data.inquiryDetails.services.map(
            (service) => service.serviceId
          );
        });
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row" v-if="valuationInformation">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="invoice-title">
              <h4 class="float-end mx-2 font-size-16">
                <Status :status="valuationInformation.status"></Status>
              </h4>
              <h4 class="float-end font-size-16">
                Identifier: <b>{{ valuationInformation.valuationId }}</b>
              </h4>
              <div class="mb-4">
                <img
                  src="@/assets/images/logo-small.png"
                  alt="logo"
                  height="30"
                />
              </div>
            </div>
            <hr />
            <div class="row">
              <div class="col-6">
                <strong>From:</strong>
                <br />
                {{ inquiryDetails.information.fullName }} <br />{{
                  inquiryDetails.information.email
                }}
              </div>
              <div class="col-6 text-sm-end">
                <address>
                  <strong>Requested Date:</strong>
                  <br />{{ valuationInformation.requestedDate | date }}
                </address>
              </div>
            </div>
            <ListServices
              v-if="servicesIds.length > 0"
              :servicesIds="servicesIds"
              :clientFullName="inquiryDetails.information.fullName"
            ></ListServices>
            <History v-if="valuationId" :valuationId="valuationId"></History>
            <div class="d-print-none">
              <div class="float-end">
                <a
                  href="javascript:window.print()"
                  class="btn btn-success waves-effect waves-light me-1"
                  ><i class="fa fa-print"></i
                ></a>
                <button
                  @click.prevent="openSuggestModal()"
                  v-if="valuationInformation.status === 'WaitForProposal'"
                  class="btn btn-danger w-lg waves-effect waves-light"
                >
                  <i class="fa fa-comments-dollar"></i> Suggest
                </button>
                <button
                  @click.prevent="complete()"
                  v-if="valuationInformation.status === 'Approved' || valuationInformation.status === 'Rejected'"
                  class="btn btn-success w-lg waves-effect waves-light"
                >
                  <i class="fas fa-clipboard-check"></i> Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuggestProposalModal
      ref="suggestProposalModal"
      :valuationId="valuationId"
      @onProposalSuggested="loadData()"
    ></SuggestProposalModal>
  </Layout>
</template>


