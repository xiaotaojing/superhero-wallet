<template>
  <div :class="['account-card', { subaccount }]">
    <AccountInfo />
    <BalanceInfo />
    <div class="arrows">
      <button class="left"><Arrow /></button>
      <button class="right"><Arrow /></button>
    </div>
    <Triangle class="triangle" />
  </div>
</template>

<script>
import AccountInfo from './AccountInfo';
import BalanceInfo from './BalanceInfo';
import Triangle from '../../../icons/account-card/card-bg-triangle.svg?vue-component';
import Arrow from '../../../icons/account-card/account-arrow.svg?vue-component';

export default {
  components: {
    AccountInfo,
    BalanceInfo,
    Triangle,
    Arrow,
  },
  props: { subaccount: Boolean },
  mounted() {
    const color = 'red';
    document
      .getElementsByClassName('triangle')[0]
      .children[0].setAttribute('style', `fill: ${color}`);
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.account-card {
  display: flex;
  flex-direction: column;
  height: 169px;
  width: 312px;
  border-radius: 6px;
  // stylelint-disable-next-line declaration-colon-newline-after
  background: url('../../../icons/account-card/account-bg-pattern.svg'),
    linear-gradient(rgba(45, 136, 255, 0.22), rgba(45, 136, 255, 0.22)),
    linear-gradient(270deg, rgba(28, 87, 194, 0.44) 69.38%, rgba(53, 192, 133, 0.88) 131.89%),
    linear-gradient(#12121b, #12121b);
  background-position: 30px 50px, center, center, center;

  &.subaccount {
    // stylelint-disable-next-line declaration-colon-newline-after
    background: url('../../../icons/account-card/account-bg-pattern.svg'),
      linear-gradient(rgba(30, 149, 200, 0.22), rgba(30, 149, 200, 0.22)),
      linear-gradient(270deg, rgba(17, 115, 158, 0.44) 70.75%, rgba(36, 167, 151, 0.88) 131.89%),
      linear-gradient(#12121b, #12121b);
  }

  .account-info {
    padding: 8px 8px 0 8px;
  }

  .balance-info {
    background-image: none;
    border: none;
  }

  .triangle {
    border-radius: 0 0 5px 0;
    align-self: flex-end;
    margin-top: -14px;
  }

  .arrows {
    margin-top: -35px;
    width: 100%;

    button {
      padding: 0;
      opacity: 0.33;
      color: #fff;
      cursor: pointer;

      &.right {
        float: right;
        transform: rotate(180deg);
      }

      &.left {
        float: left;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
