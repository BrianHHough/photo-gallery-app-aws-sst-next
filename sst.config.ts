import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
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
      const site = new NextjsSite(stack, "site");

      // =================================== //
      //    Customize CloudFront settings    //
      // =================================== //
      // customDomain: {
      //   domainNames: ["yourdomain.com"];
      //   domainAlias: "www.yourdomain.com"
      // }

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
      });
      // =================================== //
      //        Customize Stack Name         //
      // =================================== //
    }, { stackName: `${custom.projectName}-${app.stage}` }); 
  },
} satisfies SSTConfig;
