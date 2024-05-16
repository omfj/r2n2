export type Jurisdiction = "eu" | "fedramp"

export const createEndpoint = (accountId: string, jurisdiction: Jurisdiction | null) => {
  const jurisdictionSuffix = jurisdiction ? `.${jurisdiction}` : ""

  return `https://${accountId}${jurisdictionSuffix}.r2.cloudflarestorage.com`
}
