import { Process, specHelper, Connection, Api } from "actionhero";
import * as jwt from "jsonwebtoken";

const actionhero = new Process();
let api: Api;

beforeAll(async () => {
  const configChanges = {
    adminSystem: {
      JWTokenDisable: true,
    },
  };
  api = (await actionhero.start({ configChanges })) as Api;
});

// 測試結束關閉actionhero
afterAll(async () => {
  await actionhero.stop();
});

describe("Get Admin Token", () => {
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip("Not Login", async () => {
    const result = await specHelper.runAction("getAdminToken", {
      service: "account-system",
    });
    expect(result.code).toBe(50008);
    expect(result.message).toMatch(/JWToken error/);
  });

  test("getAdminToken", async () => {
    const connection1: Connection = await specHelper.buildConnection();

    connection1.params = {
      username: "admin",
      password: "123456",
    };

    {
      const result = await specHelper.runAction("login", connection1);

      api.log(JSON.stringify(result));
      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
      // connection1.rawConnection.req.headers["x-access-token"] =
      //   result.data.accessToken;
    }

    connection1.params = {
      service: "account-system",
    };

    {
      const result = await specHelper.runAction("getAdminToken", connection1);

      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
      const { data } = result;
      const payload = jwt.decode(data);
      expect(payload).toMatchObject({
        service: "account-system",
        iss: "admin-system",
      });
      // 30 秒內過期
      // eslint-disable-next-line dot-notation
      expect(payload["exp"]).toBeLessThanOrEqual(
        new Date().getTime() / 1000 + 30
      );
    }
  });
});
