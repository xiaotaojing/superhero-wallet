<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="popup">
    <p>name: {{ name }}</p>
    <p>description: {{ description }}</p>
    <p>abbreviation: {{ abbreviation }}</p>
    <p>loadingState: {{ loadingState }}</p>
    <p>step: {{ step }}</p>
    <p>success: {{ success }}</p>
    <Button @click="createWordSale">Create Token</Button>
    <Button @click="openCallbackOrGoHome(false)">
      {{ $t('pages.tipPage.cancel') }}
    </Button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchJson, postJson } from '../../../utils/helper';
import Button from '../../components/Button';
import deeplinkApi from '../../../../mixins/deeplinkApi';

export default {
  components: { Button },
  mixins: [deeplinkApi],
  data() {
    return {
      name: '',
      description: '',
      abbreviation: '',
      loadingState: false,
      step: 0,
      success: false,
    };
  },
  created() {
    this.name = this.$route.query.name;
    this.description = this.$route.query.description;
    this.abbreviation = this.$route.query.abbreviation;
  },
  computed: mapGetters(['activeNetwork']),
  methods: {
    async invalidateCache() {
      await fetchJson(`${this.activeNetwork.backendUrl}/cache/invalidate/wordRegistry`);
    },
    async addToken(address) {
      await postJson(`${this.activeNetwork.backendUrl}/tokenCache/addToken`, { body: address });
    },
    async createWordSale() {
      try {
        this.loadingState = true;
        const decimals = 18;
        const bondingCurveAddress = 'ct_2e1ZjvVXVi5f2ZiTqiFgs29oN1r1dhhdv2irvnnkvkoGZBgMPf';
        const timeout = 20;

        this.step = 1;

        const tokenSaleAddress = await this.$store.dispatch('wordbazaar/deployTokenSaleContract', {
          decimals,
          timeout,
          bondingCurveAddress,
          description: this.description,
        });

        this.step = 2;
        const fungibleTokenAddress = await this.$store.dispatch(
          'wordbazaar/deployFungibleTokenContract',
          {
            name: this.name,
            decimals,
            symbol: this.abbreviation,
            tokenSaleAddress,
          },
        );

        this.step = 3;

        await this.addToken(fungibleTokenAddress);
        await this.invalidateCache();

        this.step = 4;

        this.success = true;
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.name = '';
        this.description = '';
        this.abbreviation = '';
        this.loadingState = false;
        this.step = 0;
        this.success = false;
      }
    },
  },
};
</script>
