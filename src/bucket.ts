import { S3 } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export class Bucket {
  name: string;
  s3: S3;

  constructor(name: string, s3: S3) {
    this.name = name;
    this.s3 = s3;
  }

  /**
   * Retrieves an object from the bucket.
   *
   * @param key - The key of the object.
   * @returns The object data.
   */
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

  /**
   * Lists all objects in the bucket.
   *
   * @param prefix - The prefix of the objects.
   * @returns The list of objects.
   */
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

  /**
   * Deletes an object from the bucket.
   *
   * @param key - The key of the object.
   * @returns The result of the operation.
   */
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

  /**
   * Puts an object into the bucket.
   *
   * @param key - The key of the object.
   * @param blob - The data of the object.
   * @returns The result of the operation.
   */
  async put(key: string, blob: string | Uint8Array | Buffer | Readable) {
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
