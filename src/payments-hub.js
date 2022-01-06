import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
export default {
  install(Vue) {
    const connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:5001/hubs/payments`)
      .configureLogging(LogLevel.Information)
      .build();

    const paymentsHub = new Vue();
    Vue.prototype.$paymentsHub = paymentsHub;

    connection.on("PaymentCompleted", (event) => {
      paymentsHub.$emit("payment-completed-event", event);
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