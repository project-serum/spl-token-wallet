const { Stage, CfnOutput } = require('@aws-cdk/core');
const { WalletStack } = require('../stack/wallet');

class Application extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    const wallet = new WalletStack(this, `wallet-${props.stage}`, {
      stage: props.stage,
    });

    this.cloudfrontDistributionId = new CfnOutput(
      wallet,
      `wallet-distribution-id-${props.stage}`,
      {
        value: wallet.productionDistribution.distributionId,
      },
    );
  }
}

module.exports = {
  Application,
};
