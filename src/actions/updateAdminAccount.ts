import { api, Action } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class UpdateAdminAccountAction extends Action {
  constructor() {
    super();
    this.name = "updateAdminAccount";
    this.description = "update admin account";
    this.outputExample = { code: 20000, message: "success." };
    this.inputs = {
      id: {
        required: true,
      },
      account: {
        required: true,
      },
      name: {
        required: true,
      },
      prefix: {
        required: true,
      },
      isMaintained: {
        required: true,
      },
      isEnabled: {
        required: true,
      },
      roles: {
        required: true,
      },
      website: {
        required: false,
      },
      hashKey: {
        required: false,
      },
      APIDomain: {
        required: false,
      },
      whiteIPList: {
        required: false,
      },
    };

    this.middleware = ["JWToken"];
  }

  async run({ params, response }): Promise<void> {
    const {
      id,
      account,
      name,
      prefix,
      isMaintained,
      isEnabled,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList,
    } = params;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      await adminSystem.updateAdminAccount({
        id,
        account,
        name,
        prefix,
        isMaintained,
        isEnabled,
        roles,
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      });

      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
