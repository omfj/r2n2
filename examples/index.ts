import { R2 } from "../src/r2"

const ACCES_KEY_ID = "your-access-key-id"
const ACCOUNT_ID = "your-account-id"
const SECRET_ACCESS_KEY = "your-secret-access-key"

const main = async () => {
  const r2 = new R2({
    accessKeyId: ACCES_KEY_ID,
    accountId: ACCOUNT_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    jurisdiction: "eu",
  })

  console.log(await r2.listBuckets())

  const bucket = r2.bucket("testing")

  console.log(await bucket.put("file.txt", "Hello, World!"))
  console.log(await bucket.get("file.txt"))
  console.log(await bucket.delete("file.txt"))
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
