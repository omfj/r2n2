import { Bucket, BucketOptions } from "./bucket";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export class R2 {
  config: R2Config;

  constructor(config: R2Config) {
    this.config = config;
  }

  /**
   * Returns a Bucket instance.
   *
   * @example
   * ```typescript
   * import { R2 } from "@omfj/r2n2";
   *
   * const r2 = new R2({
   *  accessKeyId: "your-access-key-id",
   *  accountId: "your-account-id",
   *  secretAccessKey: "your-secret-access-key",
   * });
   *
   * const bucket = r2.bucket("testing");
   *
   * console.log(await bucket.get("key"));
   * ```
   *
   * @param name - The name of the bucket.
   * @param opts - Optional parameters.
   * @returns
   */
  bucket(name: string, opts?: Partial<BucketOptions>): Bucket {
    return new Bucket(this.config, name, opts);
  }
}
