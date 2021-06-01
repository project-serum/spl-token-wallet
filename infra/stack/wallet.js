const { join } = require('path');
const { Stack, Duration } = require('@aws-cdk/core');
const {
  PublicHostedZone,
  RecordTarget,
  ARecord,
} = require('@aws-cdk/aws-route53');
const { CloudFrontTarget } = require('@aws-cdk/aws-route53-targets');
const {
  PriceClass,
  CloudFrontWebDistribution,
  OriginProtocolPolicy,
} = require('@aws-cdk/aws-cloudfront');
const { Bucket, BucketAccessControl } = require('@aws-cdk/aws-s3');
const {
  BucketDeployment,
  Source,
  CacheControl,
} = require('@aws-cdk/aws-s3-deployment');

class WalletStack extends Stack {
  constructor(app, id, props) {
    super(app, id, props);

    const stage = props.stage;
    const { hostName } = this.node.tryGetContext(props.stage);

    const certificateArn = this.node.tryGetContext('certificateArn');
    const { hostedZoneId, zoneName } = this.node.tryGetContext('zone');

    const zone = PublicHostedZone.fromHostedZoneAttributes(
      this,
      `${id}-${stage}-route-53`,
      {
        hostedZoneId,
        zoneName,
      },
    );

    const walletAssets = new Bucket(this, `${id}-${stage}-wallet-assets`, {
      accessControl: BucketAccessControl.PUBLIC_READ,
      bucketName: `sendit-wallet-static-assets-${stage}`,
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    new BucketDeployment(this, 'DeployWallet', {
      actionName: 'Wallet Deployment',
      sources: [Source.asset(join(__dirname, '..', '..', 'build'))],
      destinationBucket: walletAssets,
      cacheControl: [
        CacheControl.setPublic(),
        CacheControl.maxAge(Duration.minutes(5)),
      ],
      prune: false,
    });

    this.productionDistribution = new CloudFrontWebDistribution(
      this,
      `${id}-${stage}-wallet-distribution`,
      {
        originConfigs: [
          {
            customOriginSource: {
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
              domainName: walletAssets.bucketWebsiteDomainName,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
              },
            ],
          },
        ],
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [hostName],
        },
        priceClass: PriceClass.PRICE_CLASS_100,
      },
    );

    new ARecord(this, `${id}-${stage}-alias-record`, {
      zone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(this.productionDistribution),
      ),
      recordName: hostName,
    });
  }
}

module.exports = { WalletStack };
