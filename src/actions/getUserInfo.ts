import { api, Action, ActionProcessor } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class GetUserInfoAction extends Action {
  constructor() {
    super();
    this.name = "getUserInfo";
    this.description = "get user information";
    this.outputExample = {
      data: {
        user: {
          username: "admin",
          name: "admin",
          avatar:
            "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
          roles: ["78ca6215-5bb9-48ce-864a-f44a00adfac1"],
        },
      },
      code: 20000,
      message: "success.",
    };
    this.inputs = {};

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, session } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      const account = await adminSystem.getAdminAccountById({
        id: session.adminAccountId,
      });
      response.data = {};
      response.data.user = {
        username: account.account,
        name: account.account,
        avatar:
          "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        roles: account.roles.map((role) => role.key),
      };
      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
