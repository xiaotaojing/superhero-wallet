<!-- eslint-disable vue-i18n/no-raw-text -->
<template>
  <div class="popup">
    <p>tokenAddress: {{ tokenAddress }}</p>
    <p>voteAddress: {{ voteAddress }}</p>
    <p>stakeAmount: {{ stakeAmount }}</p>
    <p>contractAddress: {{ contractAddress }}</p>
    <p>voteId: {{ voteId }}</p>
    <p>loading: {{ loading }}</p>
    <p>progressMessage: {{ progressMessage }}</p>
    <Button v-if="$route.path === '/vote'" @click="vote(voteAddress, true, stakeAmount)">
      Vote
    </Button>
    <Button v-if="$route.path === '/revoke-vote'" @click="revokeVote(voteAddress)">Revoke</Button>
    <Button v-if="$route.path === '/claim-back'" @click="withdraw(voteAddress)">Claim back</Button>
    <Button v-if="$route.path === '/payout-tokens'" @click="applyPayout(voteId)">Payout</Button>
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
      loading: true,
      progressMessage: '',
      voteAddress: '',
      tokenAddress: '',
      stakeAmount: '',
      contractAddress: '',
      voteId: '',
    };
  },
  created() {
    this.voteAddress = this.$route.query.voteAddress;
    this.tokenAddress = this.$route.query.tokenAddress;
    this.stakeAmount = this.$route.query.stakeAmount;
    this.contractAddress = this.$route.query.contractAddress;
    this.voteId = +this.$route.query.voteId;
    this.loading = false;
  },
  computed: {
    ...mapGetters(['activeNetwork']),
    ...mapState('fungibleTokens', ['availableTokens']),
  },
  methods: {
    async invalidateCache(address) {
      await fetchJson(
        `${this.activeNetwork.backendUrl}/cache/invalidate/wordSaleVoteState/${address}`,
      );
    },
    async vote(address, option, amount) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.VoteOption[0]');
      try {
        const shiftedAmount = shiftDecimalPlaces(
          amount,
          this.availableTokens[this.tokenAddress].decimals,
        ).toFixed();

        await this.$store.dispatch('fungibleTokens/createOrChangeTokenAllowance', {
          contractAddress: this.tokenAddress,
          amount: shiftedAmount,
          forAccount: address.replace('ct_', 'ak_'),
        });

        this.progressMessage = this.$t('components.VoteCard.VoteOption[1]');
        await this.$store.dispatch('wordbazaar/tokenVotingMethod', {
          contractAddress: address,
          method: 'vote',
          args: [option, shiftedAmount],
        });

        await this.invalidateCache(address);
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
        this.progressMessage = '';
      }
    },
    async revokeVote(address) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.RevokeVote');
      try {
        await this.$store.dispatch('wordbazaar/tokenVotingMethod', {
          contractAddress: address,
          method: 'revoke_vote',
        });
        await this.invalidateCache(address);
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
        this.progressMessage = '';
      }
    },
    async withdraw(address) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.Withdraw');
      try {
        await this.$store.dispatch('wordbazaar/tokenVotingMethod', {
          contractAddress: address,
          method: 'withdraw',
        });
        await this.invalidateCache(address);
        this.openCallbackOrGoHome(true);
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
        this.progressMessage = '';
      }
    },
    async applyPayout(id) {
      this.loading = true;
      this.progressMessage = this.$t('components.VoteCard.Payout');
      try {
        await this.$store.dispatch('wordbazaar/tokenSaleMethod', {
          contractAddress: this.contractAddress,
          method: 'apply_vote_subject',
          args: [id],
        });
        await this.invalidateCache(this.contractAddress);
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
