<template>
  <div :class="['account-info', { edit }]">
    <div class="account-buttons">
      <button @click="remove"><Remove /></button>
      <RouterLink to="/accounts"><Options /></RouterLink>
      <button><Add /></button>
      <button data-cy="copy" @click="copy" v-clipboard:copy="account.publicKey"><Copy /></button>
    </div>
    <div class="title">
      <Avatar :address="account.publicKey" :name="account.name" />
      <div class="account-name" data-cy="account-name">
        <a v-if="activeAccountName.includes('.chain')" class="text-ellipsis">
          {{ activeAccountName }}
        </a>
        <router-link v-else class="claim-chainname" to="/names">
          {{ $t('pages.account.claim-name') }}
        </router-link>
        <div class="account-type-name">
          <template v-if="!edit">
            <span class="text-ellipsis">
              {{ customAccountName !== 'Sub-account #1' ? customAccountName : accountTypeName }}
            </span>
            <button v-if="editable" @click="edit = true"><Edit /></button>
          </template>
          <template v-else>
            <input v-model="customAccountName" maxlength="22" type="text" />
            <button class="save" @click="edit = false"><Save /></button>
          </template>
        </div>
        <!-- eslint-disable-next-line vue-i18n/no-raw-text-->
        <label v-if="edit">{{ customAccountName.length }}/22</label>
      </div>
    </div>
    <a class="ae-address">{{ account.publicKey }}</a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Avatar from './Avatar';
import Add from '../../../icons/account-card/btn-add-subaccount.svg?vue-component';
import Copy from '../../../icons/account-card/btn-copy-address.svg?vue-component';
import Options from '../../../icons/account-card/btn-options.svg?vue-component';
import Remove from '../../../icons/account-card/btn-remove.svg?vue-component';
import Edit from '../../../icons/account-card/btn-edit.svg?vue-component';
import Save from '../../../icons/account-card/btn-save.svg?vue-component';

export default {
  components: { Avatar, Add, Copy, Options, Remove, Edit, Save },
  props: {
    accountTypeName: { type: String, default: 'Primary account' },
    editable: { type: Boolean },
  },
  data: () => ({
    copied: false,
    edit: false,
    customAccountName: 'Sub-account #1',
  }),
  computed: mapGetters(['account', 'activeAccountName']),
  methods: {
    copy() {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    },
    async remove() {
      await this.$store.dispatch('modals/open', {
        name: 'confirm',
        title: this.$t('modals.removeSubaccount.title'),
        msg: this.$t('modals.removeSubaccount.msg'),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../../styles/variables';

.account-info {
  padding: 20px 20px 0 20px;
  text-align: left;
  margin-bottom: 12px;

  &.edit {
    margin-bottom: 2px;

    .title {
      margin-bottom: 0;

      .account-name .account-type-name {
        border-bottom: 1px solid #2d88ff;
      }
    }
  }

  .account-buttons {
    height: 8px;

    a,
    button {
      opacity: 0.44;
      float: right;
      padding: 0;
      margin-left: 8px;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    line-height: 21px;

    .avatar {
      align-self: flex-start;
      margin-right: 8px;
      overflow: visible;
    }

    .account-name {
      font-size: 17px;
      font-weight: 500;
      color: #fff;
      line-height: 20px;
      margin-right: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;

      a {
        color: #fff;
        text-decoration: none;
        max-width: 130px;

        &:hover {
          text-decoration: underline;
        }
      }

      .claim-chainname {
        font-size: 14px;
        color: $white-1;
      }

      .account-type-name {
        display: flex;
        line-height: 16px;
        font-size: 14px;
        border-bottom: 1px solid transparent;

        span {
          margin-top: 6px;
          white-space: nowrap;
          opacity: 0.5;
          max-width: 150px;
        }

        input {
          line-height: 16px;
          font-size: 14px;
          font-weight: 500;
          padding: 0;
          color: #fff;
          height: initial;

          &:focus {
            outline: 0;
            border: 0;
          }
        }

        button {
          height: 24px;
          margin-left: 8px;
          opacity: 0.44;
          padding: 0;
          cursor: pointer;

          &:hover {
            opacity: 1;
          }
        }
      }

      label {
        font-size: 10px;
        line-height: 12px;
        opacity: 0.5;
        align-self: flex-end;
      }
    }

    button {
      padding: 0;
    }
  }

  .ae-address {
    text-decoration: none;
    color: $gray-1;
    font-size: 10px;
    letter-spacing: -0.2px;
    line-height: 12px;

    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }
}
</style>
