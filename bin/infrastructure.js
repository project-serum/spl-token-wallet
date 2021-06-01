#!/usr/bin/env node

const { App } = require('@aws-cdk/core');
const { PipelineStack } = require('../infra/stack/pipeline');
const app = new App();
new PipelineStack(app, 'Wallet-Pipeline', {
  stackName: 'Wallet-Pipeline',
  description: 'Pipeline stack for Sendit wallet.',
  env: {
    region: 'us-east-1',
  },
});

app.synth();
