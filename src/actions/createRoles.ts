import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class CreateRolesAction extends Action {
  constructor() {
    super();
    this.name = "createRoles";
    this.description = "create roles";
    this.outputExample = { code: 20000, result: "success." };
    this.inputs = {
      role: {
        required: true,
      },
      rolePath: {
        required: true,
      },
    };

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params, session } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const { role, rolePath } = params;
    const { name, description } = role;
    try {
      const roleKey = await adminSystem.createRole(
        session.adminAccountId,
        name,
        description,
        rolePath
      );
      response.code = 20000;
      response.message = "success.";
      response.data = { key: roleKey };
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
