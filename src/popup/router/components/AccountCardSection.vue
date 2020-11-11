<template>
  <div class="account-card-section">
    <div v-if="!backedUpSeed && !tourRunning" class="noti" data-cy="seed-notif">
      <span>
        {{ $t('pages.account.youNeedTo') }}
        <RouterLink :to="{ name: 'settings-security' }">{{
          $t('pages.account.backup')
        }}</RouterLink>
        {{ $t('pages.account.yourSeedPhrase') }}
      </span>
    </div>
    <AccountCard
      :class="[{ 'noti-above': !backedUpSeed && !tourRunning }, { 'menu-under': menu }]"
    />
    <ul>
      <li @click="step = 1" :class="step === 1 ? 'current' : ''"><a></a></li>
      <li @click="step = 2" :class="step === 2 ? 'current' : ''"><a></a></li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AccountCard from './AccountCard';

export default {
  components: { AccountCard },
  data: () => ({
    step: 1,
    menu: true,
  }),
  computed: mapState(['tourRunning', 'backedUpSeed']),
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.account-card-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 233px;
  border-radius: 0 0 10px 10px;
  background-image: url('../../../icons/account-card/card-bg.svg');

  .noti {
    margin-top: 10px;
    margin-bottom: 0;
    line-height: 16px;
  }

  .account-card {
    margin: 32px 24px;

    &.noti-above {
      margin-top: 18px;
    }

    &.menu-under {
      margin-bottom: 8px;
    }
  }

  ul {
    display: inline-block;
    margin: 0 0 8px 0;
    padding: 0;

    li {
      position: relative;
      display: block;
      float: left;
      margin: 0 16px;
      width: 16px;
      height: 16px;

      a {
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        background-color: $text-color;
        transition: background 0.3s;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          height: 0;
          left: 0;
          width: 100%;
          // background-color: #fff;
          box-shadow: 0 0 1px rgb(172, 172, 172);
          transition: height 0.3s;
        }
      }

      &.current a {
        background-color: #32de9b;
        box-shadow: 0 0 12px #36f4bb;
      }
    }
  }
}
</style>
