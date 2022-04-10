<template>
  <b-dropdown
      menu-class="dropdown-menu-lg p-0 dropdown-menu-end"
      right
      toggle-class="header-item noti-icon"
      variant="black"
  >
    <template v-slot:button-content>
      <i :class="{ 'bx-tada': areNotificationsToRead }" class="bx bx-bell"></i>
      <span v-if="areNotificationsToRead" class="badge bg-danger rounded-pill">{{ notificationsToRead.length }}</span>
    </template>

    <div v-if="areNotificationsToRead" class="p-3">
      <div class="row align-items-center">
        <div class="col">
          <h6 class="m-0">
            {{ $t("navbar.dropdown.notification.text") }}
          </h6>
        </div>
        <div class="col-auto">
          <a class="small" href="#" @click.prevent="markAllAsRead()">{{
              $t("navbar.dropdown.notification.subtext")
            }}</a>
        </div>
      </div>
    </div>
    <simplebar style="max-height: 230px">
      <a v-for="notification in notificationsToRead"
         :key="notification.id"
         :to="notification.route"
         class="text-reset notification-item"
         @click.prevent="markAsRead(notification)">
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
              {{ notification.title }}
            </h6>
            <div class="font-size-12 text-muted">
              <p class="mb-1">
                {{ notification.text }}
              </p>
              <p class="mb-0">
                <i class="mdi mdi-clock-outline"></i>
                {{ getTimeFromNow(notification) }}
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
import moment from "moment";

export default {
  name: "push-notifications",
  components: {simplebar},
  computed: {
    areNotificationsToRead() {
      return this.notificationsToRead.length > 0
    },
    notifications() {
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
      this.$valuationsHub.$on("valuation-close-to-deadline-remind-event", (event) => {
        this.$etToastDanger(`Close to deadline valuation ${event.valuationId}`);
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
          .patch(`/push-module/notifications/${notification.id}/mark-as-read`)
          .then(() => {
            this.$router.push(notification.route)
            this.loadNotifications();
          });
    },

    markAllAsRead() {
      axios
          .patch(`/push-module/notifications/mark-all-as-read`)
          .then(() => {
            this.loadNotifications();
          });
    },

    getTimeFromNow(item) {
      const diffInSeconds = moment().diff(moment(item.eventDate), 'seconds');
      const diffInMinutes = moment().diff(moment(item.eventDate), 'minutes');
      const diffInHours = moment().diff(moment(item.eventDate), 'hours');
      if (diffInSeconds <= 60) {
        return `${diffInSeconds} seconds ago`;
      }
      if (diffInMinutes <= 60) {
        return `${diffInMinutes} minutes ago`;
      }

      if (diffInHours <= 24) {
        return `${diffInHours} hours ago`;
      }

      return moment(item.eventDate).format('MM/DD/YYYY');
    },
    createValuationRequestedNotificationItem(item) {
      item.title = "Valuation requested";
      item.text = `Valuation requested click to suggest proposal`;
      item.icon = "bx bx-paperclip";
      item.route = {name: "details-valuation", params: {id: item.actionId}};
    },
    createProposalApprovedNotificationItem(item) {
      item.title = "Proposal approved";
      item.text = `Proposal approved for valuation '${item.actionId}'`;
      item.icon = "bx bx-trophy";
      item.route = {name: "details-valuation", params: {id: item.actionId}};
    },
    paymentCompletedNotificationItem(item) {
      item.title = "Payment completed";
      item.text = `Payment '${item.actionId}'`;
      item.icon = "bx bx-dollar";
      item.route = {name: "details-valuation", params: {id: item.actionId}};
    },
    valuationCloseToDeadlineItem(item) {
      item.title = "Valuation close to deadline";
      item.text = `Valuation '${item.actionId}'`;
      item.icon = "bx bxs-timer";
      item.route = {name: "details-valuation", params: {id: item.actionId}};
    },
    loadNotifications() {
      axios
          .get("/push-module/notifications")
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
                case "ValuationCloseToDeadlineRemind":
                  this.valuationCloseToDeadlineItem(item);
                  break
              }
            });
            this.addPushNotification(res.data);
          });
    }
  }
}
</script>