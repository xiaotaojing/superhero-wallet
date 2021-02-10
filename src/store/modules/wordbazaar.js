import WordBazaar from 'wordbazaar-module';

const wordbazaar = new WordBazaar('ct_2NgBcsGbseSKNoLtEZFH6gDsfhBiBhG57HcxwQf8jyzEQu8YDX', 'sdk');

const state = {
  ...wordbazaar.state,
};

const actions = {
  ...wordbazaar.actions,
};

const mutations = {
  ...wordbazaar.mutations,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
