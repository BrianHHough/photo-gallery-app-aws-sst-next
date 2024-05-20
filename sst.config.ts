import { SSTConfig } from "sst";
import { NextjsSite, Api, Cognito, Bucket} from "sst/constructs";
import { Tags } from "aws-cdk-lib";

// Global variables
const custom = {
  projectName: "testtesting-next-sst-deploy",
  owner: "BHH",
  version: "1_0_0",
  purpose: "Serverless photo gallery API",
}

export default {
  config(_input) {
    return {
      name: "test-next-serverless-deploy-",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(({ stack, app }) => {
      // =================================== //
      //      Create a CDN for the App       //
      // =================================== //
      const site = new NextjsSite(stack, "site");

      // Customize CloudFront settings
      // customDomain: {
      //   domainNames: ["yourdomain.com"];
      //   domainAlias: "www.yourdomain.com"
      // }


      // =================================== //
      //   Configure S3 Bucket for Photos    //
      // =================================== //
      const photoBucket = new Bucket(stack, "PhotoBucket");


      // =================================== //
      //   Create a Cognito Auth Resource    //
      // =================================== //
      const auth = new Cognito(stack, "Auth", {
        login: ["email"],
      });

      // =================================== //
      //   Create an API Gateway REST API    //
      // =================================== //
      const api = new Api(stack, "Api", {
        authorizers: {
          cognitoAuthorizer: {
            type: "user_pool",
            userPool: {
              id: auth.userPoolId,
              clientIds: [auth.userPoolClientId],
            },
          },
        },
        defaults: {
          authorizer: "cognitoAuthorizer",
          authorizationScopes: ["user.email"]
        },
        routes: {
          "GET /photos": "functions/listPhotos.main",
          "POST /admin/upload": {
            authorizer: "cognitoAuthorizer",
            function: "functions/upload.main"
          },
        },
      });



      // =================================== //
      //      Add Tags to all Resources      //
      // =================================== //
      Tags.of(stack).add("Project", custom.projectName);
      Tags.of(stack).add("Environment", app.stage);
      Tags.of(stack).add("Owner", custom.owner);
      Tags.of(stack).add("Version", custom.version);
      Tags.of(stack).add("CostCenter", custom.projectName);
      Tags.of(stack).add("Purpose", custom.purpose);
      
      stack.addOutputs({
        SiteUrl: site.url,
        ApiEndpoint: api.url,
        BucketName: photoBucket.bucketName,
        UserPoolId: auth.userPoolId,
        IdentityPoolId: auth.cognitoIdentityPoolId,
        UserPoolClientId: auth.userPoolClientId,
      });
      // =================================== //
      //        Customize Stack Name         //
      // =================================== //
    }, { stackName: `${custom.projectName}-${app.stage}` }); 
  },
} satisfies SSTConfig;
