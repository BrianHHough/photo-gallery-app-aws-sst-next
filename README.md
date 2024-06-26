# Photo Gallery App (SST x Next.js) 
A serverlessly deployed photo gallery app with Next.js and SST deployed to AWS.

| ![Demo1](./assets/Demo1.png) | ![Demo2](./assets/Demo2.png) |
|:----------------------------:|:----------------------------:|

* 🔒 Authentication: Amazon Cognito
* 🏗️ IaC Pipeline: SST
* 💾 Database: Amazon DynamoDB
* 🪣 Bucket: Amazon S3
* 🔊 Serverless Functions: AWS Lambda
* 🖥️ Hosting: Amazon S3 + Amazon CloudFront

Link: https://didd5wba1hnye.cloudfront.net/



## Step 1: Initialize SST in the root of the new Next.js project:
```bash
npx create-sst@latest
```

- ? You are in a Next.js project so SST will be setup in drop-in mode. Continue? `Yes`

Install the sst npm package in your project's root:
```bash
npm i sst --save-exact
```

Install the front-end dependencies:
```bash
npm i @emotion/react @emotion/styled react-infinite-scroll-component @hello-pangea/dnd react-dropzone
```

Install the AWS dependencies:
```bash
npm i amazon-cognito-identity-js @aws-sdk/client-s3 @aws-sdk/s3-request-presigner @aws-sdk/client-dynamodb uuid
```

Install the AWS dev dependencies:
```bash
npm i --save-dev @types/aws-lambda @types/uuid
```

Install front-end dev-dependencies:
```bash
npm i --save  @types/react-beautiful-dnd
```


## Step 2: Start the SST dev server

**Using the `dev` stage for local development:**
- It is recommended that you use a different stage for development. 
- Read more from SST here: https://docs.sst.dev/live-lambda-development

```bash
npx sst dev --stage dev 
```

This might take awhile if happening for the first time. Keep it running if this prints out:
```bash
⠼ Deploying bootstrap stack, this only needs to happen once
```

Wait for it to ultimately print:
```bash
Start Next.js: npm run dev
```

## Step 3: Start the local dev server

In another tab in your terminal, run:
```bash
Start Next.js: npm run dev
```


## Step 4: Deploy to AWS

```bash
npx sst deploy --stage prod --profile BHH-AmplifyAdminAccess
```


## Debugging:

### Did you install SST for the project repo?
If you get this error, it means that SST isn't installed with the project
```
sh: sst: command not found
```

### `npm run dev` can't execute because of the `aws-sdk`?

See a print out like the below? Be sure to delete `node_modules`, ensure the `package.json` file only inludes dependencies specifically scoped for the project, and then run `npm i`.

Or you can do this:
```bash
rm -rf node_modules
npm cache verify
npm install
```

Also make sure that the latest version of `sst` is installed:
```bash
npm install -g sst@latest
```

Error message:
```bash
> app@0.1.0 dev
> sst bind next dev

node:internal/modules/cjs/loader:1077
  const err = new Error(message);
              ^

Error: Cannot find module 'aws-sdk/lib/maintenance_mode_message'
Require stack: 
...
```

## AWS IAM Policy Permissions List:

This is an exhaustive list:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "acm:DescribeCertificate",
                "acm:ListCertificates",
                "acm:RequestCertificate",
                "cloudformation:CreateChangeSet",
                "cloudformation:CreateStack",
                "cloudformation:DescribeChangeSet",
                "cloudformation:DeleteChangeSet",
                "cloudformation:DeleteStack",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DescribeStackResource",
                "cloudformation:DescribeStackResources",
                "cloudformation:DescribeStacks",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:GetTemplate",
                "cloudformation:ListStackResources",
                "cloudformation:UpdateStack",
                "cloudformation:ValidateTemplate",
                "cloudfront:CreateCloudFrontOriginAccessIdentity",
                "cloudfront:CreateDistribution",
                "cloudfront:CreateInvalidation",
                "cloudfront:GetDistribution",
                "cloudfront:GetDistributionConfig",
                "cloudfront:ListCloudFrontOriginAccessIdentities",
                "cloudfront:ListDistributions",
                "cloudfront:ListDistributionsByLambdaFunction",
                "cloudfront:ListDistributionsByWebACLId",
                "cloudfront:ListFieldLevelEncryptionConfigs",
                "cloudfront:ListFieldLevelEncryptionProfiles",
                "cloudfront:ListInvalidations",
                "cloudfront:ListPublicKeys",
                "cloudfront:ListStreamingDistributions",
                "cloudfront:UpdateDistribution",
                "cloudfront:TagResource",
                "cloudfront:UntagResource",
                "cloudfront:ListTagsForResource",
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:ListTables",
                "dynamodb:UpdateTable",
                "iam:AttachRolePolicy",
                "iam:CreateRole",
                "iam:CreateServiceLinkedRole",
                "iam:DeleteRole",
                "iam:DeleteRolePolicy",
                "iam:GetRole",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iam:UpdateAssumeRolePolicy",
                "lambda:AddPermission",
                "lambda:CreateFunction",
                "lambda:DeleteFunction",
                "lambda:GetFunction",
                "lambda:GetFunctionConfiguration",
                "lambda:ListEventSourceMappings",
                "lambda:ListFunctions",
                "lambda:ListTags",
                "lambda:PublishVersion",
                "lambda:RemovePermission",
                "lambda:TagResource",
                "lambda:UntagResource",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "route53:ChangeResourceRecordSets",
                "route53:ListHostedZonesByName",
                "route53:ListResourceRecordSets",
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:GetAccelerateConfiguration",
                "s3:GetBucketLocation",
                "s3:GetBucketPolicy",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:PutAccelerateConfiguration",
                "s3:PutBucketPolicy",
                "s3:PutBucketTagging",
                "s3:PutObject",
                "ssm:GetParameter",
                "sqs:CreateQueue",
                "sqs:DeleteQueue",
                "sqs:GetQueueAttributes",
                "sqs:SetQueueAttributes"
            ],
            "Resource": "*"
        }
    ]
}
```


# ❌ Serverless Framework Components - Did not work....
Serverless Components is basically dead after next v9: https://github.com/serverless-nextjs/serverless-next.js/issues/2607

So what are the options?
- sst.dev which use `open-next` to build the app and make it compatible with aws lambda, it also support app router.

This guide walks through "Use Next.js with SST": https://docs.sst.dev/start/nextjs

Tried to install serverless components cli but it did not upload: https://github.com/serverless-nextjs/serverless-next.js/issues/2320

```bash
npm install -g @serverless/cli
```

- Deploy locally with:
```bash
components-v1 --aws-profile XXXXXX
```

## Also, issue with Lambda zip size
https://stackoverflow.com/questions/59931761/unzipped-size-must-be-smaller-than-262144000-bytes-aws-lambda-error



# ❌ Using `@hello-pangea/dnd` instead of `react-beautiful-dnd`
`react-beautiful-dnd` has issues with React 18, especially when React's strict mode is enabled, which is the default in Next.js. The library hasn't been maintained to support the new features and strict mode of React 18.

The fork `@hello-pangea/dnd` is a maintained alternative that fixes these issues and is compatible with React 18. It should be a drop-in replacement for `react-beautiful-dnd`. Here’s how you can use `@hello-pangea/dnd` in a project:

```bash
npm install @hello-pangea/dnd --save
```

Source: https://www.reddit.com/r/nextjs/comments/17vq0rm/reactbeautifuldnd/


# Issue with route handler methods:

https://github.com/vercel/next.js/discussions/47072



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
