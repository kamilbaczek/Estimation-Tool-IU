import store from "@/state/store";

export default [
  {
    path: "/",
    name: "default",
    meta: {
      authRequired: true,
    },
    component: () => import("./views/dashboards/default"),
  },
  {
    path: "/valuations",
    name: "valuations",
    meta: {
      authRequired: true,
    },
    component: () =>
      import("./views/valuations/list-valuations/list-valuations"),
  },
  {
    path: "/services",
    name: "services",
    meta: {
      authRequired: true,
    },
    component: () =>
      import("./views/services/services-list/services-list"),
  },
  {
    path: "/add-new-service",
    name: "add-new-service",
    meta: {
      authRequired: true,
    },
    component: () =>
      import("./views/services/new-service/new-service"),
  },
  {
    path: "/valuations/:id",
    name: "details-valuation",
    component: () =>
      import("./views/valuations/details-valuation/details-valuation"),
  },
  {
    path: "/valuations/:id/proposals/:proposalId/approve",
    name: "approved-valuation",
    component: () =>
        import("./views/valuations/proposals/approved/approved"),
    beforeResolve(routeTo, routeFrom, next) {
      // If the user is already logged in
      if (store.getters["auth/loggedIn"]) {
        // Redirect to the home page instead
        next({name: "default"});
      } else {
        // Continue to the login page
        next();
      }
    }
  },
  {
    path: "/users",
    name: "users",
    meta: {
      authRequired: true,
    },
    component: () => import("./views/users/list-users/list-users"),
  },
  {
    path: "/payments/pay/:paymentId",
    name: "payments",
    meta: {
      authRequired: true,
    },
    component: () => import("./views/payments/pay"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/account/login"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("./views/account/register"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("./views/account/forgot-password"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters["auth/loggedIn"]) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          store.dispatch("auth/logOut");
        } else {
          store.dispatch("authfack/logout");
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
        );
      },
    },
  },

  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
];