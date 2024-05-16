# r2n2

Simple Cloudflare R2 client for Node.js built on top of `@aws-sdk/client-s3`.

## Why?

I needed a simple way to connect to R2 buckets and get files. The R2 client provided by the Wrangler in a Cloudflare Worker environment is not available in a Node.js environment. And I wanted a Node.js client that was similar to the Wrangler client.

## Installation

```bash
# npm
npm install @omfj/r2n2

# yarn
yarn add @omfj/r2n2

# pnpm
pnpm add @omfj/r2n2
```

## Usage

Connect to the R2 bucket and get a file.

```typescript
import { R2 } from "@omfj/r2n2";

const r2 = new R2({
  accessKeyId: process.env.ACCES_KEY_ID,
  accountId: proccess.env.ACCOUNT_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const bucket = r2.bucket("my-bucket");

const file = await bucket.get("my-file.txt");
```

## License

MIT
