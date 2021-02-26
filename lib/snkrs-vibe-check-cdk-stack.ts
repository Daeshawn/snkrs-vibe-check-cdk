import * as cdk from '@aws-cdk/core';
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import { Bucket } from '@aws-cdk/aws-s3';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class SnkrsVibeCheckCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const sourceCodeBucket = Bucket.fromBucketArn(this, "source_code", "arn:aws:s3:::src-lambda-packages")
    //Retrieve Bucket with source 

    const handler = new lambda.Function(this, "request_handler_function", {
      runtime: lambda.Runtime.NODEJS_12_X, 
      code: lambda.Code.fromBucket(sourceCodeBucket, "snkrs-vibe-check.zip"),
      handler: "src/handler/index.handler",
      environment: {
        BUCKET: sourceCodeBucket.bucketName
      }
    });

    sourceCodeBucket.grantReadWrite(handler)

    const api = new apigateway.RestApi(this, "snkrs-vibe-check-api", {
      restApiName: "SNKRSVIBECHECK",
      description: "Use image recognition provided from gpc and aws to analyze images and find snkrs that match the vibe of the images"
    });

    const postEndpointLambdaIntegration = new LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    })

    api.root.addMethod("POST", postEndpointLambdaIntegration);
  }
}
