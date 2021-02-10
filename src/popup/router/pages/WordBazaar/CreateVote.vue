<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="popup">
    <p>loading: {{ loading }}</p>
    <p>progressMessage: {{ progressMessage }}</p>
    <p>description: {{ description }}</p>
    <p>newVotePayout: {{ newVotePayout }}</p>
    <p>saleContractAddress: {{ saleContractAddress }}</p>
    <Button @click="createVote">Create Vote</Button>
    <Button @click="openCallbackOrGoHome(false)">
      {{ $t('pages.tipPage.cancel') }}
    </Button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fetchJson } from '../../../utils/helper';
import Button from '../../components/Button';
import deeplinkApi from '../../../../mixins/deeplinkApi';

export default {
  components: { Button },
  mixins: [deeplinkApi],
  data() {
    return {
      loading: true,
      progressMessage: '',
      description: '',
      newVotePayout: '',
      saleContractAddress: null,
    };
  },
  created() {
    this.saleContractAddress = this.$route.query.sale;
    this.description = this.$route.query.description;
    this.newVotePayout = this.$route.query.payout;
    this.loading = false;
  },
  computed: mapGetters(['activeNetwork']),
  methods: {
    async createVote() {
      this.loading = true;
      this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[0]');
      try {
        const metadata = {
          subject: { VotePayout: [this.newVotePayout] },
          description: this.description,
          link: 'https://aeternity.com/',
        };

        const height = await this.$store.dispatch('getHeight');
        const closeHeight = height + 20;
        const token = await this.$store.dispatch('wordbazaar/tokenSaleMethod', {
          contractAddress: this.saleContractAddress,
          method: 'get_token',
        });
        const address = await this.$store.dispatch('wordbazaar/deployTokenVotingContract', {
          metadata,
          closeHeight,
          token,
        });

        this.progressMessage = this.$t('views.WordDetail.CreateVote.ProgressMessage[1]');

        await this.$store.dispatch('wordbazaar/tokenSaleMethod', {
          contractAddress: this.saleContractAddress,
          method: 'add_vote',
          args: [address],
        });
        await fetchJson(
          `${this.activeNetwork.backendUrl}/cache/invalidate/wordSaleVotes/${this.saleContractAddress}`,
        );
        this.description = '';
        this.newVotePayout = '';
        this.showInitiate = false;
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
