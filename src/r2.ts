import type { Jurisdiction } from "./endpoint"
import { createEndpoint } from "./endpoint"
import { Bucket } from "./bucket"
import { S3 } from "@aws-sdk/client-s3"

export interface R2Config {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  jurisdiction?: Jurisdiction
  publicUrl?: string
}

export class R2 {
  config: R2Config
  url: string
  jurisdiction: Jurisdiction | null
  s3: S3

  constructor(config: R2Config) {
    this.config = config
    this.jurisdiction = config.jurisdiction ?? null
    this.url = config.publicUrl ?? createEndpoint(config.accountId, this.jurisdiction)
    this.s3 = new S3({
      region: "auto",
      endpoint: this.url,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    })
  }

  /**
   * Returns a Bucket instance.
   *
   * @example
   * ```typescript
   * import { R2 } from "@omfj/r2n2";
   *
   * const r2 = new R2({
   *  ...
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
  bucket(name: string): Bucket {
    return new Bucket(name, this.s3)
  }

  /**
   * Lists all buckets.
   *
   * @example
   * ```typescript
   * import { R2 } from "@omfj/r2n2";
   *
   * const r2 = new R2({
   *  ...
   * });
   *
   * const buckets = await r2.listBuckets();
   * ```
   *
   * @note Needs "Admin Read" permission.
   *
   * @returns A list of buckets.
   */
  async listBuckets() {
    const response = await this.s3.listBuckets()

    if (!response.Buckets) {
      return []
    }

    return response.Buckets.map((bucket) => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate,
    }))
  }

  /**
   * Creates a new bucket.
   *
   * @example
   * ```typescript
   * import { R2 } from "@omfj/r2n2";
   *
   * const r2 = new R2({
   *  ...
   * });
   *
   * await r2.createBucket("testing");
   * ```
   *
   * @note Needs "Admin Write" permission.
   *
   * @param name - The name of the bucket.
   */
  async createBucket(name: string) {
    try {
      await this.s3.createBucket({ Bucket: name })
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, error: error.message }
      }

      return { ok: false, error: "Unknown error" }
    }
  }

  /**
   * Deletes a bucket.
   *
   * @example
   * ```typescript
   * import { R2 } from "@omfj/r2n2";
   *
   * const r2 = new R2({
   *  ...
   * });
   *
   * await r2.deleteBucket("testing");
   * ```
   *
   * @param name - The name of the bucket.
   */
  async deleteBucket(name: string) {
    try {
      await this.s3.deleteBucket({ Bucket: name })
      return { ok: true }
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, error: error.message }
      }

      return { ok: false, error: "Unknown error" }
    }
  }
}
