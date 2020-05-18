import { Action, ActionProcessor, config, api } from "actionhero";
import * as jwt from "jsonwebtoken";

export class GetAdminTokenAction extends Action {
  constructor() {
    super();
    this.name = "getAdminToken";
    this.description = "取得 Admin 對其他服務操作的Token";
    this.outputExample = {
      data: "IamJWToeknToAccessOtherService",
      code: 20000,
      result: "success.",
    };
    this.inputs = {
      service: {
        required: true,
      },
    };
    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params } = data;
    const { service } = params;

    // 若為登入狀態下，給予對內部服務操作的 Token
    try {
      /* {iss:admin-system,exp:(Now+30Sec),
          service:admin-system,
          action:actionName
      } */

      const { adminAccountId } = data.session;
      if (!adminAccountId) throw new Error("adminAccountID not found");

      const payload = {
        service,
        adminAccountId,
      };
      api.log(`${this.name} sign payload: ${JSON.stringify(payload)}`);
      const { JWTokenKEY } = config.adminSystem;
      const accessToken = jwt.sign(payload, JWTokenKEY, {
        issuer: "admin-system",
        expiresIn: 30,
      });

      response.data = accessToken;
      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
