<template>
  <RouterLink
    v-if="tokenData"
    class="tokens-list-item"
    :to="{
      name: 'token-details',
      params: { id: tokenData.contract },
    }"
  >
    <Avatar
      :address="tokenData.contract !== 'aeternity' ? tokenData.contract : ''"
      :src="tokenData.image || null"
    />
    <div class="details">
      <div>
        <TruncateMid :str="tokenData.name" />
        <div>
          <label>{{ $t('pages.fungible-tokens.mcap') }}</label>
          {{
            tokenData.market_cap
              ? formatCurrency(tokenData.market_cap)
              : $t('pages.fungible-tokens.not-available')
          }}
        </div>
      </div>
      <div>
        <TokenAmount :amount="+tokenData.convertedBalance || 0" :symbol="tokenData.symbol" />
        <div>
          <label>{{ $t('pages.fungible-tokens.price') }}</label>
          {{
            tokenData.current_price
              ? formatCurrency(tokenData.current_price)
              : $t('pages.fungible-tokens.not-available')
          }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script>
import { mapGetters } from 'vuex';
import Avatar from '../Avatar';
import TruncateMid from '../TruncateMid';
import TokenAmount from '../TokenAmount';

export default {
  components: { Avatar, TruncateMid, TokenAmount },
  props: {
    tokenData: Object,
    name: String,
  },
  computed: mapGetters(['formatCurrency']),
};
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables';

.tokens-list-item {
  background-color: $black-1;
  margin-bottom: 3px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 7px 15px;
  color: unset;
  text-decoration: unset;

  &:first-child {
    margin-top: 3px;
  }

  .details {
    margin-left: 7px;
    flex-grow: 1;

    .truncate-mid {
      max-width: 215px;
    }

    > div {
      display: flex;
      line-height: 17px;
      font-size: 13px;
      color: $gray-1;

      .title {
        font-size: 14px;
      }

      label {
        color: $gray-3;
      }

      :nth-child(1) {
        flex-grow: 1;
      }
    }
  }
}
</style>
