import { api, Action, ActionProcessor } from "actionhero";
import { IResponse } from "./types";
import { AdminSystem } from "../AdminSystem";

/**
 * 建立 Admin 帳戶
 */
export class CreateAdminAccountAction extends Action {
  constructor() {
    super();
    this.name = "createAdminAccount";
    this.description =
      "create a admin account. </br>output code: </br>50000 => 系統錯誤 </br>50001 => 帳號己經有人使用";
    this.outputExample = { code: 20000, result: "success." };
    this.inputs = {
      account: {
        required: true,
      },
      password: {
        required: true,
      },
      name: {
        required: true,
      },
      prefix: {
        required: true,
      },
      roles: {
        required: true,
      },
      isEnabled: {
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

  /**
   * result code 對應
   * 50000 ＝> 系統錯誤
   * 50001 => 帳號己經有人使用
   * @param data
   */
  async run(data: ActionProcessor): Promise<void> {
    const { response, session, params } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const {
      account,
      name,
      prefix,
      password,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList,
    } = params;
    try {
      const result: IResponse = await adminSystem.createAdminAccount({
        adminAccountId: session.adminAccountId,
        account,
        name,
        prefix,
        password,
        roles,
        isEnabled: params.isEnabled === true,
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      });

      if (result) {
        response.code = result.code;
        response.message = result.message;
      }
    } catch (error) {
      response.code = 50000;
      response.message = "internal server error";
    }
  }
}
