<template>
  <div class="header" v-if="showNavigation && !aeppPopup">
    <div class="content">
      <div class="left">
        <Logo class="logo-small" />
        <button v-if="title && !tourRunning" @click="back" class="btn-icon back">
          <Back data-cy="back-arrow" />
        </button>
      </div>

      <div class="title">
        {{ pageTitle || (title && $t(`pages.titles.${title}`)) || $t('pages.titles.home') }}
      </div>

      <div class="right">
        <button
          v-if="$route.path === '/notifications'"
          @click="$router.push('/notifications/settings')"
          class="btn-icon settings"
        >
          <Settings />
        </button>
        <span
          v-else-if="$route.path !== '/notifications/settings'"
          @click="toNotifications"
          class="notifications"
          data-cy="noti"
        >
          <button class="btn-icon">
            <Bell />
          </button>
          <span v-if="notificationsCount" class="count" data-cy="noti-count">
            {{ notificationsCount }}
          </span>
        </span>
        <button @click="$emit('toggle-sidebar')" class="btn-icon">
          <Menu data-cy="hamburger" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Logo from '../../../icons/logo-small.svg?vue-component';
import Back from '../../../icons/back.svg?vue-component';
import Bell from '../../../icons/bell.svg?vue-component';
import Settings from '../../../icons/notif-settings.svg?vue-component';
import Menu from '../../../icons/menu.svg?vue-component';

export default {
  components: { Logo, Back, Bell, Settings, Menu },
  data: () => ({
    aeppPopup: window.RUNNING_IN_POPUP,
  }),
  subscriptions() {
    return {
      superheroNotifications: this.$store.state.observables.notifications,
    };
  },
  computed: {
    ...mapState(['tourRunning', 'notifications', 'pageTitle']),
    title() {
      return this.$route.meta.title;
    },
    showNavigation() {
      return this.$route.meta.navigation !== undefined ? this.$route.meta.navigation : true;
    },
    notificationsCount() {
      return [...this.notifications, ...this.superheroNotifications].filter(
        (n) => n.status === 'CREATED',
      ).length;
    },
  },
  methods: {
    ...mapMutations(['setNotificationsStatus']),
    back() {
      this.$router.push(
        this.$route.fullPath.substr(0, this.$route.fullPath.lastIndexOf('/')) || '/account',
      );
    },
    async toNotifications() {
      this.notifications.forEach((n) =>
        this.setNotificationsStatus({ createdAt: n.createdAt, status: 'PEEKED' }),
      );
      await this.$store.dispatch('modifyNotifications', [
        this.superheroNotifications.filter((n) => n.status === 'CREATED').map((n) => n.id),
        'PEEKED',
      ]);
      if (this.$store.state.route.fullPath !== '/notifications') {
        this.$router.push('/notifications');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';
@import '../../../styles/typography';

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 8;
  height: calc(50px + env(safe-area-inset-top));
  background-color: $color-black;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    flex: 1;
    position: relative;
    height: 50px;
    max-width: 357px;
    padding: 0 10px;
    padding-top: env(safe-area-inset-top);
    color: $color-white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    > :not(.title) {
      z-index: 1;
    }

    .left,
    .right {
      display: flex;
      align-items: center;
    }

    .logo-small {
      width: 36px;
      height: 26px;
    }

    .title {
      position: absolute;
      left: 0;
      right: 0;

      @extend %face-sans-16-medium;

      text-align: center;
    }

    .btn-icon {
      cursor: pointer;
      width: 32px;
      height: 32px;
      padding: 0;
      opacity: 0.7;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover {
        opacity: 1;
        border-radius: 50%;
        background-color: $color-hover;
      }
    }

    .notifications {
      position: relative;
      cursor: pointer;

      .count {
        position: absolute;
        left: -2px;
        top: 20%;
        z-index: 1;
        width: 14px;
        height: 14px;
        background: $color-blue;
        border-radius: 50%;
        text-align: center;
        font-size: 12px;
        line-height: 14px;
      }
    }

    .back {
      margin-left: 10px;
    }

    .settings,
    .notifications {
      margin-right: 10px;
    }
  }
}
</style>
