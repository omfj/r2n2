import { S3 } from "@aws-sdk/client-s3";
import { R2Config } from "./r2";
import { Jurisdiction, createEndpoint } from "endpoint";

export type BucketOptions = {
  jurisdiction?: Jurisdiction;
  publicUrl?: string;
};

export class Bucket {
  name: string;
  config: R2Config;
  url: string;
  jurisdiction: Jurisdiction | null;
  s3: S3;

  constructor(config: R2Config, name: string, opts: BucketOptions = {}) {
    this.config = config;
    this.name = name;
    this.jurisdiction = opts.jurisdiction ?? null;
    this.url =
      opts.publicUrl ?? createEndpoint(config.accountId, this.jurisdiction);
    this.s3 = new S3({
      region: "auto",
      endpoint: this.url,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async get(key: string) {
    const response = await this.s3.getObject({
      Bucket: this.name,
      Key: key,
    });

    return {
      body: response.Body,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
      etag: response.ETag,
      expiration: response.Expiration,
    };
  }

  async list(prefix?: string) {
    const response = await this.s3.listObjectsV2({
      Bucket: this.name,
      Prefix: prefix,
    });

    if (!response.Contents) {
      return [];
    }

    const contents: Array<{
      key?: string;
      lastModified?: Date;
      etag?: string;
      size?: number;
    }> = [];

    for (const object of response.Contents) {
      if (!object) {
        continue;
      }

      contents.push({
        key: object.Key,
        lastModified: object.LastModified,
        etag: object.ETag,
        size: object.Size,
      });
    }

    return contents;
  }

  async delete(
    key: string
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
      await this.s3.deleteObject({
        Bucket: this.name,
        Key: key,
      });
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, error: error.message };
      }

      return { ok: false, error: "Unknown error" };
    }

    return { ok: true };
  }

  async put(
    key: string,
    blob: Uint8Array | Blob | Buffer | ReadableStream | string | undefined
  ) {
    try {
      const response = await this.s3.putObject({
        Bucket: this.name,
        Key: key,
        Body: blob,
      });

      return {
        ok: true,
        data: {
          etag: response.ETag,
          expiration: response.Expiration,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, error: error.message };
      }

      return { ok: false, error: "Unknown error" };
    }
  }
}
