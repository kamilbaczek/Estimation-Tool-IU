<template>
  <b-dropdown
      right
      menu-class="dropdown-menu-lg p-0 dropdown-menu-end"
      toggle-class="header-item noti-icon"
      variant="black"
  >
    <template v-slot:button-content>
      <i class="bx bx-bell" :class="{ 'bx-tada': areNotificationsToRead }"></i>
      <span v-if="areNotificationsToRead" class="badge bg-danger rounded-pill">{{notificationsToRead.length}}</span>
    </template>

    <div class="p-3" v-if="areNotificationsToRead">
      <div class="row align-items-center">
        <div class="col">
          <h6 class="m-0">
            {{ $t("navbar.dropdown.notification.text") }}
          </h6>
        </div>
        <div class="col-auto">
          <a href="#" class="small">{{
              $t("navbar.dropdown.notification.subtext")
            }}</a>
        </div>
      </div>
    </div>
    <simplebar style="max-height: 230px" >
      <a v-for="notification in notificationsToRead"
         :key="notification.id"
         :to="notification.route"
         @click.prevent="markAsRead(notification)"
         class="text-reset notification-item">
        <div class="media">
          <div class="avatar-xs me-3">
                  <span
                      class="avatar-title bg-primary rounded-circle font-size-16"
                  >
                    <i :class="notification.icon"></i>
                  </span>
          </div>
          <div class="media-body">
            <h6 class="mt-0 mb-1">
              {{notification.title}}
            </h6>
            <div class="font-size-12 text-muted">
              <p class="mb-1">
                {{notification.text}}
              </p>
              <p class="mb-0">
                <i class="mdi mdi-clock-outline"></i>
                {{ $t("navbar.dropdown.notification.order.time") }}
              </p>
            </div>
          </div>
        </div>
      </a>
    </simplebar>
    <div v-if="areNotificationsToRead" class="p-2 border-top d-grid">
      <a
          class="btn btn-sm btn-link font-size-14 text-center"
          href="javascript:void(0)"
      >
        <i class="mdi mdi-arrow-right-circle me-1"></i>
        {{ $t("navbar.dropdown.notification.button") }}
      </a>
    </div>
  </b-dropdown>
</template>
<script>
import axios from "@/helpers/http-comunicator";
import {pushNotificationsMethods} from "@/state/helpers";
import simplebar from "simplebar-vue";

export default {
  name: "push-notifications",
  components: { simplebar },
  computed: {
    areNotificationsToRead()
    {
      return this.notificationsToRead.length > 0
    },
    notifications()
    {
      return this.$store ? this.$store.state.pushNotifications.pushNotifications : [];
    },
    notificationsToRead() {
      return this.notifications.filter(notification => notification.markedAsRead === false);
    },
  },
  mounted() {
    this.loadNotifications();
    function valuationsHub() {
      this.$valuationsHub.$on("valuation-requested-event", (event) => {
        this.$etToast(`Valuation requested ${event.valuationId}`);
        this.loadNotifications();
      });
      this.$valuationsHub.$on("proposal-approved-event", (event) => {
        this.$etToast(`Proposal approved ${event.valuationId}`);
        this.loadNotifications();
      });
    }
    valuationsHub.call(this);

    function paymentsHub() {
      this.$paymentsHub.$on("payment-completed-event", (event) => {
        this.$etToast(`Payment Completed ${event.paymentId}`);
        this.loadNotifications();
      });
    }
    paymentsHub.call(this);
  },
  methods: {
    ...pushNotificationsMethods,
    markAsRead(notification) {
      axios
          .patch(`/notifications-module/Notifications/${notification.id}/markAsRead`)
          .then(() => {
            this.$router.push(notification.route)
            this.loadNotifications();
          });
    },
    createValuationRequestedNotificationItem(item) {
      item.title = "Valuation requested";
      item.text = `Valuation requested click to suggest proposal`;
      item.icon = "bx bx-paperclip";
      item.route = {name: "details-valuation", params: {id: item.valuationId}};
    },
    createProposalApprovedNotificationItem(item) {
      item.title = "Proposal approved";
      item.text = `Proposal approved for valuation '${item.valuationId}`;
      item.icon = "bx bx-trophy";
      item.route = {name: "details-valuation", params: {id: item.valuationId}};
    },
    paymentCompletedNotificationItem(item) {
      item.title = "Payment completed";
      item.text = `Payment '${item.paymentId}`;
      item.icon = "bx bxs-badge-dollar";
      item.route = {name: "details-valuation", params: {id: item.valuationId}};
    },
    loadNotifications() {
      axios
          .get("/notifications-module/Notifications")
          .then((res) => {
            res.data.forEach((item) => {
              switch (item.type) {
                case "ProposalApproved":
                  this.createProposalApprovedNotificationItem(item);
                  break;
                case "ValuationRequested":
                  this.createValuationRequestedNotificationItem(item);
                  break;
                case "PaymentCompleted":
                  this.paymentCompletedNotificationItem(item);
                  break
              }
            });
            this.addPushNotification(res.data);
          });
    }
  }
}
</script>