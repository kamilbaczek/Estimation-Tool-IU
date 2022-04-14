import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
export default {
  install(Vue) {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) return;
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.VUE_APP_SIGNALR_BASE_URL}/valuations`,
    {
      accessTokenFactory: () => user.token,
      })
      .configureLogging(LogLevel.Information)
      .build();

    const valuationsHub = new Vue();
    Vue.prototype.$valuationsHub = valuationsHub;

    connection.on("ProposalApproved", (event) => {
      valuationsHub.$emit("proposal-approved-event", event);
    });

    connection.on("ValuationCloseToDeadlineRemind", (event) => {
      valuationsHub.$emit("valuation-close-to-deadline-remind-event", event);
    });

    connection.on("ValuationRequested", (event) => {
      valuationsHub.$emit("valuation-requested-event", event);
    });

    let startedPromise = null;
    function start() {
      startedPromise = connection.start().catch(() => {
        return new Promise((resolve, reject) =>
          setTimeout(
            () =>
              start()
                .then(resolve)
                .catch(reject),
            5000
          )
        );
      });
      return startedPromise;
    }

    connection.onclose(() => start());

    start();
  }
};