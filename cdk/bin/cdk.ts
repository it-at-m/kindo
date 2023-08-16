#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import "source-map-support/register";
import { CdkPipelineStack } from "../lib/cdk-pipeline-stack";

const app = new cdk.App();
const pipelineProps = {
  codeConnection: "41ccc13d-9b17-422c-a7fc-09a6da730ed2",
  repositoryOrganization: "DigitalProductschool",
  repositoryName: "batch19--lhm",
  branchName: app.node.tryGetContext("branch"),
  stackName:
    app.node.tryGetContext("app-name") + app.node.tryGetContext("branch"),
  description: "Spring Boot Backend Application",
};

app.node.setContext("stage", pipelineProps.stackName);

const main_stack = new CdkPipelineStack(app, "CdkPipelineStackMain", {
  ...pipelineProps,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
Aspects.of(app).add(new AwsSolutionsChecks());
NagSuppressions.addStackSuppressions(main_stack, [
  {
    id: "AwsSolutions-S1",
    reason:
      "CDK construct does not provide a way to enable logging for S3 Bucket managed by Code Pipeline: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines.CodePipeline.html",
  },
  {
    id: "AwsSolutions-IAM5",
    reason:
      "1/Default policies for code pipeline and these are resourced to s3 bucket, account and CDK limits to customize the default policies: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines.CodePipeline.html, 2/ecr:GetAuthorizationToken does not allow to scope to resource",
  },
  {
    id: "AwsSolutions-KMS5",
    reason:
      "CDK construct does not provide a way to enable KMS rotation: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines.CodePipeline.html",
  },
]);
