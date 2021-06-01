const { Artifact } = require('@aws-cdk/aws-codepipeline');
const {
  CdkPipeline,
  SimpleSynthAction,
  ShellScriptAction,
} = require('@aws-cdk/pipelines');
const { Stack } = require('@aws-cdk/core');
const {
  CodeStarConnectionsSourceAction,
} = require('@aws-cdk/aws-codepipeline-actions');
const { Effect, PolicyStatement } = require('@aws-cdk/aws-iam');
const { Application } = require('../stage/application');
const { LinuxBuildImage } = require('@aws-cdk/aws-codebuild');
const { Repository } = require('@aws-cdk/aws-ecr');

class PipelineStack extends Stack {
  constructor(app, id, props) {
    super(app, id, props);

    const sourceArtifact = new Artifact('src');
    const cloudAssemblyArtifact = new Artifact('asmb');
    const { owner, name, githubConnectionArn, branch } =
      this.node.tryGetContext('repo');

    const cloudFrontPolicyStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['cloudfront:GetInvalidation', 'cloudfront:CreateInvalidation'],
      resources: ['*'],
    });

    const pipeline = new CdkPipeline(this, 'wallet', {
      pipelineName: 'Wallet',
      cloudAssemblyArtifact,

      sourceAction: new CodeStarConnectionsSourceAction({
        actionName: 'GitHub',
        owner,
        repo: name,
        connectionArn: githubConnectionArn,
        output: sourceArtifact,
        branch: branch || 'master',
      }),

      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build',
        environment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,
        },
      }),
    });

    const applicationTesting = new Application(this, 'Testing', {
      stageName: 'Testing',
      description: 'Wallet testing stack running in us-east-1.',
      stage: 'testing',
      env: {
        region: 'us-east-1',
      },
    });

    const stageTesting = pipeline.addApplicationStage(applicationTesting);

    const actionTesting = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`,
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationTesting.cloudfrontDistributionId,
        ),
      },
    });

    stageTesting.addActions(actionTesting);

    actionTesting.project.addToRolePolicy(cloudFrontPolicyStatement);

    // Staging
    const applicationStaging = new Application(this, 'Staging', {
      stageName: 'Staging',
      description: 'Wallet staging stack running in us-east-1.',
      stage: 'staging',
      env: {
        region: 'us-east-1',
      },
    });

    const stageStaging = pipeline.addApplicationStage(applicationStaging);

    const actionStaging = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`,
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationStaging.cloudfrontDistributionId,
        ),
      },
    });

    stageStaging.addActions(actionStaging);

    actionStaging.project.addToRolePolicy(cloudFrontPolicyStatement);

    // Production
    const applicationProduction = new Application(this, 'Production', {
      stageName: 'Production',
      description: 'Wallet application stack running in us-east-1.',
      stage: 'production',
      env: {
        region: 'us-east-1',
      },
    });

    const stageProduction = pipeline.addApplicationStage(
      applicationProduction,
      {
        manualApprovals: true,
      },
    );

    const actionProduction = new ShellScriptAction({
      actionName: 'Clear-Cloudfront',
      commands: [
        `aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"`,
      ],
      useOutputs: {
        DISTRIBUTION_ID: pipeline.stackOutput(
          applicationProduction.cloudfrontDistributionId,
        ),
      },
    });

    stageProduction.addActions(actionProduction);

    actionProduction.project.addToRolePolicy(cloudFrontPolicyStatement);
  }
}

module.exports = { PipelineStack };
