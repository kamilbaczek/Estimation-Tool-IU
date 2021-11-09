import moment from 'moment'
export default {
    format: function(value) {
      if (value) {
      return moment(String(value)).format('MM/DD/YYYY')
    }
  },
  formatDateTime: function(value) {
      if (value) {
      return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
 }
}
  