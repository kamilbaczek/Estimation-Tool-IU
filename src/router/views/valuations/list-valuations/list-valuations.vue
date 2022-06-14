<script>
import axios from "@/helpers/http-comunicator";
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Grid from "@/components/et-grid";
import Status from "../components/status.vue";
import DateFormatter from "@/helpers/dates/date-formatter";
import Priority from "@/router/views/valuations/components/priority";
import Identifier from "@/router/views/valuations/components/identifier";

export default {
  page: {
    title: "Valuations List",
    meta: [
      {
        name: "valuations",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Identifier,
    Priority,
    Layout,
    PageHeader,
    Grid,
    Status,
  },
  data() {
    return {
      tableData: [],
      title: "Valuations",
      items: [
        {
          text: "Dashboard",
          href: "/",
        },
        {
          text: "Valuations",
          active: true,
        },
      ],
      fields: [
        {
          key: "inquiryId",
          sortable: true,
        },
        {
          key: "requestedDate",
          sortable: true,
          formatter: (date) => DateFormatter.format(date)
        },
        {
          key: "status",
          sortable: true,
        },
        {
          key: "priority",
          sortable: true,
        },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
    };
  },
  mounted() {
    this.totalRows = this.items.length;
    this.getValuations();
    function valuationsHub() {
      this.$valuationsHub.$on("valuation-requested-event", () => {
        this.getValuations();
      });
    }
    valuationsHub.call(this);
  },
  methods: {
    goToDetails(id) {
      this.$router.push({ name: "details-valuation", params: { id: id } });
    },
    getValuations()
    {
      axios
          .get("valuations-module/Valuations")
          .then((res) => {
            const data = res.data.valuations;
            this.loadPriorities(data);
          });
    },
    loadPriorities(valuations) {
    axios
      .get("priorities-module/Priorities").then((res) => {
      valuations.forEach((valuation) => {
      let priority = res.data.priorities.find(priority => priority.valuationId === valuation.id);
        valuation.priority = priority?.level ?? "";
    });

    this.tableData = valuations;
  });
},

  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <Grid
      :title="title"
      :fields="fields"
      :tableData="tableData"
      :sort-by="requestedDate"
      :sort-desc="false"
      :totalRows="totalRows"
    >
      <template v-slot:actions="data">
        <b-button
          @click.prevent="goToDetails(data.item.id)"
          variant="info"
          class="mx-auto"
          title="Go to details"
        >
          <i class="bx bx-detail font-size-16 align-middle me-2"></i>
          Details
        </b-button>
      </template>

      <template v-slot:status="data">
        <Status :status="data.item.status"></Status>
      </template>
      <template v-slot:priority="data">
        <Priority :priority="data.item.priority"></Priority>
      </template>
      <template v-slot:inquiryId="data">
        <Identifier :id="data.item.inquiryId"></Identifier>
      </template>
    </Grid>
  </Layout>
</template>
