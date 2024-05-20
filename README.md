# SST x Next.js Deploy
- Link: https://didd5wba1hnye.cloudfront.net/

Serverless Components is basically dead after next v9: https://github.com/serverless-nextjs/serverless-next.js/issues/2607

So what are the options?
- sst.dev which use `open-next` to build the app and make it compatible with aws lambda, it also support app router.

This guide walks through "Use Next.js with SST": https://docs.sst.dev/start/nextjs

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
npm i @emotion/react @emotion/styled react-infinite-scroll-component react-beautiful-dnd react-dropzone
```

Install the AWS dependencies:
```bash
npm i amazon-cognito-identity-js
```

Install dev-dependencies:
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


## Step: Deploy to AWS

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




# ❌ Serverless Framework Components - Did not work....

Install serverless components cli:
```bash
npm install -g @serverless/cli
```


- Deploy locally with:
```bash
serverless --aws-profile BHH-AmplifyAdminAccess
```


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
