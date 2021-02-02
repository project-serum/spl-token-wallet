import { decodeAccount } from '../import';

test('decodeAccount works as expected', () => {
  // these two private keys are for the same account
  const base58Token = '1saKGirgZWmdT4SRQTCTovm8tW6iTdpvsEsCWGwcfen2GoSyummQPWof3WdmZhBy67MsWkkkiqJcMPnL4ZFfqwu';
  const rawArrayToken = '[0,192,128,45,243,200,60,181,169,230,168,65,215,92,19,29,106,141,191,82,82,28,99,88,40,199,160,149,19,226,159,19,50,198,38,252,188,134,166,183,236,56,37,12,52,116,162,234,224,95,173,109,228,126,210,222,129,127,101,216,217,133,203,64]';
  // create the accounts using both the keys
  const account1 = decodeAccount(base58Token);
  const account2 = decodeAccount(rawArrayToken);
  // assert that account1 is fully defined
  expect(account1).toBeDefined();
  expect(account1?.publicKey).toBeDefined();
  expect(account1?.secretKey).toBeDefined();
  // assert that account2 is fully defined
  expect(account2).toBeDefined();
  expect(account2?.publicKey).toBeDefined();
  expect(account2?.secretKey).toBeDefined();
  // assert that account1 and account2 are the same account
  expect(account1?.publicKey).toEqual(account2?.publicKey);
  expect(account1?.secretKey).toEqual(account2?.secretKey);
  // confirm that this is indeed the account that was imported
  const originalSecretKey = account1 ? Array.from(account1.secretKey) : [];
  expect(originalSecretKey).toEqual(JSON.parse(rawArrayToken));
});
