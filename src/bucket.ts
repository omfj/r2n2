import { S3 } from "@aws-sdk/client-s3";

export class Bucket {
  name: string;
  s3: S3;

  constructor(name: string, s3: S3) {
    this.name = name;
    this.s3 = s3;
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

    return response.Contents.map((object) => ({
      key: object.Key,
      lastModified: object.LastModified,
      etag: object.ETag,
      size: object.Size,
    }));
  }

  async delete(key: string): Promise<{ ok: true } | { ok: false; error: string }> {
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

  async put(key: string, blob: Uint8Array | Blob | Buffer | ReadableStream | string | undefined) {
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
