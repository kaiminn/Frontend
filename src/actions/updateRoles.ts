import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class UpdateRolesAction extends Action {
  constructor() {
    super();
    this.name = "updateRoles";
    this.description = "update roles";
    this.outputExample = {
      code: 20000,
      message: "success.",
      data: {
        key: "7",
      },
    };
    this.inputs = {
      key: {
        required: true,
      },
      rolePath: {
        required: true,
      },
    };

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const { key, rolePath } = params;

    try {
      const roleId = await adminSystem.getRoleIdByKey(key);

      const status = await adminSystem.updateRole(roleId.toString(), rolePath);
      response.code = 20000;
      response.message = "success.";
      response.data = { key: status };
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
