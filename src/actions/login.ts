import { api, Action, ActionProcessor } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class LoginAction extends Action {
  constructor() {
    super();
    this.name = "login";
    this.description = "login";
    this.outputExample = {
      data: {
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbkFjY291bnRJZCI6MiwidWlkIjoiOTgzYzU0ZWVkM2FkN2MzMmFiYWY4Y2MxMzlhYjNiODBmMjhlMDU0Mi00Y2EzOTQzMS00ZmNhLTQwMjgtOWFlMC1kNTAyNGU2NzBmOTQxMjcwMDEiLCJpYXQiOjE1ODI4ODE1MjcsImV4cCI6MTU4Mjk2NzkyN30.4n6O5fjTXGaHBzuNq8c-r0-KVpBfZgMm-w0hQMKAFwI",
        sessionId: "983c54eed3ad7c32abaf8cc139ab3b80f28e0542",
        userData: {
          id: 2,
        },
      },
      code: 20000,
      message: "success.",
    };
    this.inputs = {
      username: {
        required: true,
      },
      password: {
        required: true,
      },
    };
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params, connection } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const validateResult = await adminSystem.validateLogin({
      username: params.username,
      password: params.password,
      clientIP: connection.remoteIP,
    });

    if (validateResult && validateResult.data) {
      if (validateResult.data.isEnabled) {
        const token: { [key: string]: string } = api.jwtoken.create(
          data,
          validateResult.data.id
        );

        // if (!config.jwtoken.disableHeader) {
        // connection.setHeader("set-cookie", `token=${token}`);
        // }

        response.data = {};
        response.data.accessToken = token;
        response.data.sessionId = data.connection.fingerprint;
        response.data.userData = {
          id: validateResult.data.id,
          // 頭像... 等等
        };
        response.code = 20000;
        response.message = "success.";
      } else {
        // 帳號被停用
        response.code = 50001;
        response.message = "account is disabled!";
      }
    } else {
      // 50003 => Wrong password.
      // 50002 => account is not exists.
      response.code = validateResult.result.code;
      response.message = validateResult.result.message;
    }
  }
}
