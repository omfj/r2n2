import { R2 } from "../src/r2";

const ACCES_KEY_ID = "your-access-key-id";
const ACCOUNT_ID = "your-account-id";
const SECRET_ACCESS_KEY = "your-secret-access-key";

const main = async () => {
  const r2 = new R2({
    accessKeyId: ACCES_KEY_ID,
    accountId: ACCOUNT_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  const bucket = r2.bucket("testing", {
    jurisdiction: "eu",
  });

  const key = "hello.txt";
  const data = "Hello, world!";
  await bucket.put(key, data);

  console.log(await bucket.list());

  console.log(await bucket.get("some-file.pdf"));
};

main().catch(console.error);
