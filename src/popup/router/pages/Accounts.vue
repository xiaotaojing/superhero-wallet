<template>
  <div class="accounts">
    <AccountCardSection />
    <div class="card-wrapper" v-for="index in 2" :key="index">
      <AccountCard subaccount />
      <CheckBox v-model="show">
        {{ $t('pages.accounts.showWallet') }}
      </CheckBox>
    </div>
  </div>
</template>

<script>
import AccountCardSection from '../components/AccountCardSection';
import AccountCard from '../components/AccountCard';
import CheckBox from '../components/CheckBox';

export default {
  components: { AccountCard, AccountCardSection, CheckBox },
  data: () => ({
    show: false,
  }),
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.accounts {
  min-height: 600px;
  background-color: $black-1;
  padding-bottom: 16px;

  .card-wrapper {
    .account-card {
      margin: 24px auto 16px auto;
    }

    .checkbox-container {
      padding: 0 0 8px 32px;
    }
  }
}
</style>
