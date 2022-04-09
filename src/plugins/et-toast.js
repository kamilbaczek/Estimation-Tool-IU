import Vue from "vue";

export default {
    // eslint-disable-next-line no-unused-vars
    install(vue, opts){   
        Vue.prototype.$etToast =  (title, timer = 10000, position="top-end") => {
            Vue.prototype.$swal.fire({
                position: position,
                timer: timer,
                title: title,
                icon: "success",
                toast: true,
                showConfirmButton: false,
                timerProgressBar: true,
              });
        },
        Vue.prototype.$etToastDanger =  (title, timer = 50500, position="top-end") => {
            Vue.prototype.$swal.fire({
                position: position,
                timer: timer,
                title: title,
                icon: "error",
                toast: true,
                showConfirmButton: true,
                timerProgressBar: true,
              });
        }
    }
    
}
