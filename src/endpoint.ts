export type Jurisdiction = "eu" | "fedramp";

/**
 * Creates an endpoint URL for the bucket.
 *
 * @param accountId - The account ID of your Cloudflare account.
 * @param jurisdiction  - The jurisdiction of the bucket.
 * @returns The endpoint URL.
 */
export const createEndpoint = (accountId: string, jurisdiction: Jurisdiction | null) => {
  const jurisdictionSuffix = jurisdiction ? `.${jurisdiction}` : "";

  return `https://${accountId}${jurisdictionSuffix}.r2.cloudflarestorage.com`;
};
