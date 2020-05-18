import { Process, specHelper, utils, Api } from "actionhero";
import AdminAccount from "../../src/models/AdminAccount";
import Roles from "../../src/models/Roles";
import AdminAccountRoles from "../../src/models/AdminAccountRoles";
import RoleRouters from "../../src/models/RoleRouters";
import AdminAccountsancestors from "../../src/models/AdminAccountsancestors";

const actionhero = new Process();
let api: Api;

let createRoleResult;
beforeAll(async () => {
  api = (await actionhero.start()) as Api;
});

// 測試結束關閉actionhero
afterAll(async () => {
  api.sequelize.drop();
  await actionhero.stop();
});

describe("create account and role api test", () => {
  afterEach(async () => {});

  afterAll(async () => {
    await api.cache.clear();
  });

  test("建立帳號", async () => {
    const createAdminAccountResult = await specHelper.runAction(
      "createAdminAccount",
      {
        account: "snow",
        password: "123456",
        name: "snow",
        prefix: `snow`,
        isEnabled: true,
        roles: [],
      }
    );
    expect(createAdminAccountResult.code).toBe(20000);
    expect(createAdminAccountResult.message).toMatch("success.");
  });

  test("建立角色", async () => {
    const result = await specHelper.runAction("createRoles", {
      role: {
        name: `test_role`,
        describe: "created by test",
      },
      rolePath: ["testadminaccount"],
    });
    expect(result.code).toBe(20000);
    expect(result.message).toMatch("success.");
  });

  test("建立角色2", async () => {
    createRoleResult = await specHelper.runAction("createRoles", {
      role: {
        name: `test_role2`,
        describe: "created by test",
      },
      rolePath: ["adminaccount"],
    });
    expect(createRoleResult.code).toBe(20000);
    expect(createRoleResult.message).toMatch("success.");
  });

  test("更新角色", async () => {
    const updateResult = await specHelper.runAction("updateRoles", {
      key: createRoleResult.data.key,
      rolePath: ["adminaccount"],
    });
    expect(updateResult.code).toBe(20000);
    expect(updateResult.message).toMatch("success.");
  });

  test("刪除角色", async () => {
    const delResult = await specHelper.runAction("deleteRole", {
      key: createRoleResult.data.key,
    });
    expect(delResult.code).toBe(20000);
    expect(delResult.message).toMatch("success.");
  });

  test("建立己存在的帳號", async () => {
    const result = await specHelper.runAction("createAdminAccount", {
      account: "snow",
      password: "123456",
      name: "test",
      prefix: `snow2`,
      roles: [1],
      isEnabled: true,
    });
    expect(result.code).toBe(50001);
    expect(result.message).toMatch("account already exists.");
  });

  test("建立 master agent 的帳號", async () => {
    const createResult = await specHelper.runAction("createAdminAccount", {
      account: "masteragent",
      password: "123456",
      name: "test",
      prefix: `snow2`,
      roles: [1],
      isEnabled: true,
      website: "http://snow.com",
      hashKey: "wlef23dfsaAD",
      APIDomain: "http://api.snow.com",
      whiteIPList: "127.0.0.1",
    });
    expect(createResult.code).toBe(20000);
    expect(createResult.message).toMatch("success.");

    const result = await specHelper.runAction("getAdminAccount", {
      filter: {
        account: "masteragent",
      },
    });

    console.log("result---->", result);
  });
});
