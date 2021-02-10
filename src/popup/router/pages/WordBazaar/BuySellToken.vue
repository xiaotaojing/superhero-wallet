<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="popup">
    <p>sale: {{ sale }}</p>
    <p>Path {{ $route.path }}</p>
    <p>tokenAddress: {{ tokenAddress }}</p>
    <p>loading: {{ loading }}</p>
    <p>updatingValue: {{ updatingValue }}</p>
    <p>progressMessage: {{ progressMessage }}</p>
    <div v-if="$route.path === '/buy-token'">
      <p>Buy</p>
      <span>buyAmount: {{ buyAmount }}</span>
      <p>buyAeAmount: {{ buyAeAmount }}</p>
      <Button @click="buy">
        {{ $t('Buy') }}
      </Button>
    </div>
    <div v-else-if="$route.path === '/sell-token'">
      <p>sellPrice: {{ sellPrice }}</p>
      <span>sellAmount: {{ sellAmount }}</span>
      <p>sellAeAmount: {{ sellAeAmount }}</p>
      <Button @click="sell">
        {{ $t('Sell') }}
      </Button>
    </div>
    <Button @click="openCallbackOrGoHome(false)">
      {{ $t('pages.tipPage.cancel') }}
    </Button>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters, mapState } from 'vuex';
import { fetchJson } from '../../../utils/helper';
import Button from '../../components/Button';
import deeplinkApi from '../../../../mixins/deeplinkApi';

const shiftDecimalPlaces = (amount, decimals) => new BigNumber(amount).shiftedBy(decimals);

export default {
  components: { Button },
  mixins: [deeplinkApi],
  data() {
    return {
      sale: '',
      buyPrice: null,
      sellPrice: null,
      buyAmount: 0,
      sellAmount: 0,
      tokenAddress: null,
      buyAeAmount: null,
      sellAeAmount: null,
      loading: true,
      updatingValue: false,
      progressMessage: '',
    };
  },
  computed: {
    ...mapState(['sdk']),
    ...mapGetters(['activeNetwork']),
  },
  async created() {
    this.sale = this.$route.query.sale;
    this.buyAmount = +this.$route.query.buyAmount;
    this.sellAmount = +this.$route.query.sellAmount;
    const data = await fetchJson(
      `${this.activeNetwork.backendUrl}/tokenCache/wordSale/${this.sale}`,
    );
    this.tokenAddress = data.tokenAddress;
    this.buyPrice = data.buyPrice;
    this.sellPrice = data.sellPrice;
    await this.buyValue();
    await this.sellValue();
    this.loading = false;
  },
  methods: {
    async buyValue() {
      await this.$watchUntilTruly(() => this.sdk);
      this.updatingValue = true;

      const amount = shiftDecimalPlaces(this.buyAmount || 0, 18).toFixed();

      const value = await this.$store.dispatch('wordbazaar/tokenSaleMethod', {
        contractAddress: this.sale,
        method: 'calculate_buy_price',
        args: [amount],
      });

      this.buyAeAmount = value;
      this.updatingValue = false;
      return { amount, value };
    },
    async sellValue() {
      await this.$watchUntilTruly(() => this.sdk);
      this.updatingValue = true;

      const amount = shiftDecimalPlaces(this.sellAmount || 0, 18).toFixed();
      this.sellAeAmount = await this.$store
        .dispatch('wordbazaar/tokenSaleMethod', {
          contractAddress: this.sale,
          method: 'calculate_sell_return',
          args: [amount],
        })
        .catch(() => 0);
      this.updatingValue = false;
    },
    async buy() {
      this.loading = true;
      this.progressMessage = this.$t('components.WordBuySellButtons.Buying');

      try {
        const { amount, value } = await this.buyValue();
        await this.$store.dispatch('wordbazaar/tokenSaleMethod', {
          contractAddress: this.sale,
          method: 'buy',
          args: [amount],
          options: { amount: value },
        });

        await fetchJson(
          `${this.activeNetwork.backendUrl}/cache/invalidate/token/${this.tokenAddress}`,
        );
        await fetchJson(`${this.activeNetwork.backendUrl}/cache/invalidate/wordSale/${this.sale}`);
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
        this.progressMessage = '';
      }
    },
    async sell() {
      this.loading = true;
      this.progressMessage = this.$t('components.WordBuySellButtons.Selling[0]');
      try {
        const amount = shiftDecimalPlaces(this.sellAmount, 18).toFixed();

        await this.$store.dispatch('fungibleTokens/createOrChangeTokenAllowance', {
          contractAddress: this.tokenAddress,
          amount,
          forAccount: this.sale.replace('ct_', 'ak_'),
        });

        this.progressMessage = this.$t('components.WordBuySellButtons.Selling[1]');
        await this.$store
          .dispatch('wordbazaar/tokenSaleMethod', {
            contractAddress: this.sale,
            method: 'sell',
            args: [amount],
          })
          .catch(() => {
            throw new Error('Insufficient Account Balance');
          });

        await fetchJson(
          `${this.activeNetwork.backendUrl}/cache/invalidate/token/${this.tokenAddress}`,
        );
        await fetchJson(`${this.activeNetwork.backendUrl}/cache/invalidate/wordSale/${this.sale}`);
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
        this.progressMessage = '';
      }
    },
  },
};
</script>
