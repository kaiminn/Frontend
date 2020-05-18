import { api, Action, ActionProcessor } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class GetAdminAccountAction extends Action {
  constructor() {
    super();
    this.name = "getAdminAccount";
    this.description = "依分頁取得 Admin 帳戶資料";
    this.outputExample = {
      data: {
        rows: [
          {
            id: 2,
            account: "admin",
            name: "管理者",
            prefix: "ad",
            isMaintained: false,
            roles: [
              {
                id: 2,
                adminAccountId: 1,
                key: "c17c08e5-0dde-44eb-b103-26792737739a",
                name: "Admin",
                description: "Admin Role",
                AdminAccountRoles: {
                  adminAccountId: 2,
                  roleId: 2,
                },
              },
            ],
            lastLoginIP: null,
            lastLoginDatetime: null,
            isEnabled: true,
            createDatetime: "2020-04-19T08:45:13.000Z",
            website: "",
            hashKey: "",
            APIDomain: "",
            whiteIPList: "",
          },
          {
            id: 3,
            account: "mabu777",
            name: "Mabu",
            prefix: "mabu",
            isMaintained: false,
            roles: [
              {
                id: 2,
                adminAccountId: 1,
                key: "c17c08e5-0dde-44eb-b103-26792737739a",
                name: "Admin",
                description: "Admin Role",
                AdminAccountRoles: {
                  adminAccountId: 3,
                  roleId: 2,
                },
              },
            ],
            lastLoginIP: null,
            lastLoginDatetime: null,
            isEnabled: true,
            createDatetime: "2020-04-19T08:45:13.000Z",
            website: "",
            hashKey: "",
            APIDomain: "",
            whiteIPList: "",
          },
        ],
        total: 2,
      },
      code: 20000,
      result: "success.",
    };
    this.inputs = {
      page: {
        required: false,
        formatter: (param: string): number => {
          return parseInt(param, 10);
        },
      },
      limit: {
        required: false,
        formatter: (param: string): number => {
          return parseInt(param, 10);
        },
      },
      filter: {
        required: false,
        default: {},
        schema: {
          account: {
            required: false,
          },
          isEnabled: {
            required: false,
          },
          startDate: {
            required: false,
          },
          dueDate: {
            required: false,
          },
        },
      },
    };

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, session, params } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      const account = await adminSystem.getAdminAccount(
        {
          id: session.adminAccountId,
          filter: params.filter,
        },
        params.limit,
        params.page
      );

      response.data = {
        rows: account.rows,
        total: account.count,
      };

      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
