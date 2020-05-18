import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class DeleteRoleAction extends Action {
  constructor() {
    super();
    this.name = "deleteRole";
    this.description = "an actionhero deleteRole";
    this.outputExample = { code: 20000, result: "success." };
    this.inputs = {
      key: {
        required: false,
      },
    };

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params, session } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const { key } = params;
    try {
      const status = await adminSystem.deleteRole({
        key,
        adminAccountId: session.adminAccountId,
      });

      response.data = {
        status,
      };

      if (status) {
        response.code = 20000;
        response.message = "success.";
      } else {
        response.code = 50001;
        response.message =
          "maybe you don't have permission to delete the role.";
      }
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
