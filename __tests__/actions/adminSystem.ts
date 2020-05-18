import { Process, specHelper, utils, Api } from "actionhero";
import { AdminSystem } from "../../src/AdminSystem";

const actionhero = new Process();
let api: Api;
const account = `testCreated_${parseInt(
  (Math.random() * 100000).toString(),
  10
).toString()}`;
let accountId;

beforeAll(async () => {
  api = (await actionhero.start()) as Api;
});

// 測試結束關閉actionhero
afterAll(async () => {
  await actionhero.stop();
});

describe("change admin account password api test", () => {
  test("變更密碼", async () => {
    const result = await specHelper.runAction("changeAdminAccountPassword", {
      account,
      password: "123123",
    });
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
  });
});

describe("getAdminAccount api test", () => {
  test("取得所有 Admin 帳戶資料或依分頁取得資料", async () => {
    const result = await specHelper.runAction("getAdminAccount", {
      page: 1,
      limit: 10,
      filter: {
        account,
      },
    });
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
    accountId = result.data.rows[0].id;
  });
});

describe("getAgentList api test", () => {
  test("取得 agent 清單", async () => {
    const result = await specHelper.runAction("getAgentList", {});
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
  });
});

describe("getUserInfo api test", () => {
  test("get user information", async () => {
    const result = await specHelper.runAction("getUserInfo", {});
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
  });
});

describe("login api test", () => {
  test("登入尚未註冊的帳號", async () => {
    const result = await specHelper.runAction("login", {
      username: "NAK",
      password: "123456",
    });
    expect(result.code).toBe(50002);
    expect(result.message).toMatch("account is not exists.");
  });

  test("登入成功", async () => {
    const result = await specHelper.runAction("login", {
      username: account,
      password: "123123",
    });
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
  });

  test("密碼錯誤", async () => {
    const result = await specHelper.runAction("login", {
      username: account,
      password: "654321",
    });
    expect(result.code).toBe(50003);
    expect(result.message).toMatch("Wrong password.");
  });

  describe("logout api test", () => {
    test("logout", async () => {
      const result = await specHelper.runAction("logout", {});
      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
    });
  });

  describe("permissionList api test", () => {
    test("get permission list", async () => {
      const result = await specHelper.runAction("permissionList", {});
      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
    });
  });

  describe("rolesList api test", () => {
    test("get roles list", async () => {
      const result = await specHelper.runAction("rolesList", {});
      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
    });
  });

  describe("updateAdminAccount api test", () => {
    test("更新帳號狀態為禁用", async () => {
      const disabledData = {
        id: accountId,
        account,
        name: "modifyByTest",
        prefix: `rd_${parseInt((Math.random() * 100000).toString(), 10)}`,
        isMaintained: false,
        isEnabled: false,
        roles: [],
      };

      // eslint-disable-next-line prefer-destructuring
      const adminSystem: AdminSystem = api.adminSystem;
      const pubChannel = adminSystem.rediskey.AdminSystemPubChannel;
      let receivedData;

      api.redis.subscriptionHandlers[pubChannel] = (message): void => {
        api.log(`subscription message = ${JSON.stringify(message)}`);
        receivedData = message.agentInfo;
      };

      const result = await specHelper.runAction(
        "updateAdminAccount",
        disabledData
      );
      expect(result.code).toBe(20000);
      expect(result.message).toMatch("success.");
      await utils.sleep(100);

      console.log("receivedData===>", receivedData);
      /**
       * 要收到 消息發佈
       */
      expect(receivedData).toHaveProperty("account");
      expect(receivedData).toHaveProperty("isEnabled");
      expect(receivedData.account).toMatch(disabledData.account);
      expect(receivedData.isEnabled).toBeFalsy();
    });

    test("登入禁用帳號", async () => {
      const result = await specHelper.runAction("login", {
        username: account,
        password: "123123",
      });
      expect(result.code).toBe(50001);
      expect(result.message).toMatch("account is disabled!");
    });
  });
});
