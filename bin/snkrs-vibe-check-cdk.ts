#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SnkrsVibeCheckCdkStack } from '../lib/snkrs-vibe-check-cdk-stack';

const app = new cdk.App();
new SnkrsVibeCheckCdkStack(app, 'SnkrsVibeCheckCdkStack');
