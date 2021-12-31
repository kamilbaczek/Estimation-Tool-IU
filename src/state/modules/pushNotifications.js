export const state = {
    pushNotifications: [],
};

export const getters = {
    allPushNotifications: state => state.pushNotifications,
};

export const mutations = {
ADD_PUSH(state, newValue) {
        state.pushNotifications = newValue; 
    },
};

export const actions = {
    addPushNotification({ commit }, newValue ) {
      commit('ADD_PUSH', newValue);
    },
  }
