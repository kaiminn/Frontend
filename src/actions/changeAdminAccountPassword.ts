import { api, Action, ActionProcessor } from "actionhero";
import { IResponse } from "./types";
import { AdminSystem } from "../AdminSystem";

/**
 * 建立 Admin 帳戶
 */
export class ChangeAdminAccountPasswordAction extends Action {
  constructor() {
    super();
    this.name = "changeAdminAccountPassword";
    this.description = "change admin account's password";
    this.outputExample = { code: 20000, result: "success." };
    this.inputs = {
      account: {
        required: true,
      },
      password: {
        required: true,
      },
    };

    this.middleware = ["JWToken"];
  }

  /**
   * result code 對應
   * 50000 ＝> 系統錯誤
   * @param data
   */
  async run(data: ActionProcessor): Promise<void> {
    const { response, session, params } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      const result: IResponse = await adminSystem.changeAdminAccountPassword({
        adminAccountId: session.adminAccountId,
        account: params.account,
        password: params.password,
      });

      const { code, message } = result;
      response.code = code;
      response.message = message;
    } catch (error) {
      response.code = 50000;
      response.message = "internal server error";
    }
  }
}
