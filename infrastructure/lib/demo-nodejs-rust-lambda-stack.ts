import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import * as path from 'node:path';

export interface DemoProps {
  momentoApiKey: string;
  momentoFlushApiKey: string;
  momentoCacheName: string;
  logLevel: string;
  architecture: cdk.aws_lambda.Architecture;
}

export class DemoNodejsRustLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, demoProps: DemoProps, cdkStackProps: cdk.StackProps) {
    super(scope, id, cdkStackProps);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, 'DemoPureNodejsLambda', {
      functionName: 'DemoPureNodejsLambda',
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      architecture: demoProps.architecture,
      entry: path.join(__dirname, '../../lambdas/nodejs/pure-nodejs-handler.ts'),
      projectRoot: path.join(__dirname, '../../lambdas/nodejs'),
      depsLockFilePath: path.join(__dirname, '../../lambdas/nodejs/package-lock.json'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(300),
      memorySize: 8192,
      environment: {
        MOMENTO_API_KEY: demoProps.momentoApiKey,
        MOMENTO_FLUSH_API_KEY: demoProps.momentoFlushApiKey,
        MOMENTO_CACHE_NAME: demoProps.momentoCacheName,
        LOG_LEVEL: demoProps.logLevel,
      },
      bundling: {
        forceDockerBundling: true,
      },
    });
  }
}
