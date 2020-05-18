import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class RolesListAction extends Action {
  constructor() {
    super();
    this.name = "rolesList";
    this.description = "get roles list";
    this.outputExample = {
      data: {
        roles: [
          {
            id: 6,
            adminAccountId: 2,
            key: "ba8497ed-7046-4a5d-b0e8-86541616b621",
            name: "RD",
            description: "rd role",
          },
          {
            id: 7,
            adminAccountId: 2,
            key: "2c90a0bf-19f1-469a-9aab-1072ddc2b78a",
            name: "cs",
            description: "",
          },
          {
            id: 8,
            adminAccountId: 2,
            key: "cf5fa9ea-bdd4-47d8-bceb-c0a5f9d31d8c",
            name: "pm",
            description: "",
          },
        ],
      },
      code: 20000,
      message: "success.",
    };
    this.inputs = {};

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, session } = data;

    try {
      // eslint-disable-next-line prefer-destructuring
      const adminSystem: AdminSystem = api.adminSystem;
      const roles = await adminSystem.getRolesList(session.adminAccountId);
      response.data = {
        roles,
      };
      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
