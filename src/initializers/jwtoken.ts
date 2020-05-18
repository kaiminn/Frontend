import { Initializer, api, config, action, ActionProcessor } from "actionhero";
import * as jwt from "jsonwebtoken";

export class JWTokenInitializer extends Initializer {
  constructor() {
    super();
    this.name = "jwtoken";
    this.loadPriority = 1000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize(): Promise<void> {
    const jwtoken = {
      tokens: new Map(),
      // 建立 JWToken
      create: (data: ActionProcessor, adminAccountId: number): string => {
        // 產生 payload, adminAccountId,connection.id
        const connectionId = data.connection.id;
        const uid = connectionId + data.connection.remoteIP.replace(/[.]/g, "");
        const payload = {
          adminAccountId,
          uid,
        };
        const { JWTokenKEY } = config.adminSystem;
        const token = jwt.sign(payload, JWTokenKEY, {
          expiresIn: "1d",
        });

        // 存到 tokens
        jwtoken.tokens.set(uid, token);
        // data.connection.setHeader("x-access-token", token);

        return token;
      },

      destroy: (data: ActionProcessor): void => {
        const connectionId = data.connection.id;
        jwtoken.tokens.delete(connectionId);
      },

      middleware: {
        JWToken: {
          name: "JWToken",
          global: false,
          priority: 1000,
          preProcessor: async (data: ActionProcessor): Promise<void> => {
            const { JWTokenDisable } = api.config.adminSystem;
            if (JWTokenDisable === true) {
              api.log("JWToken Disabled", "warning");
              // for test
              if (!data.session.adminAccount) {
                // eslint-disable-next-line no-param-reassign
                data.session = {
                  adminAccountId: 1,
                };
              }
              return;
            }

            try {
              // const actionTemplate = data.actionTemplate as Action;
              // const { authenticated } = actionTemplate;
              // if (authenticated === false) return;

              // 驗證 token，並把 adminAccountId 的資料放在 session 中
              // 提供給 Action 取用

              // 先檢查，Request header 有無 x-access-token
              // 沒有則拋錯誤
              const clientToken =
                data.connection.rawConnection.req.headers["x-access-token"];
              if (!clientToken) {
                throw new Error("action require JWToken!!");
              }

              const { JWTokenKEY } = config.adminSystem;
              jwt.verify(clientToken, JWTokenKEY, (err, decoded) => {
                if (err) {
                  api.log(err);
                } else {
                  // decoded successful
                  const { uid } = decoded;
                  if (jwtoken.tokens.get(uid) !== clientToken) {
                    throw new Error(`Wrong JWToken ${err}!!`);
                  }

                  if (!data.session.adminAccount) {
                    // eslint-disable-next-line no-param-reassign
                    data.session = {
                      adminAccountId: decoded.adminAccountId,
                    };
                  }
                }
              });
            } catch (err) {
              // token 錯誤或過期
              // eslint-disable-next-line no-param-reassign
              data.response.code = 50008;
              // eslint-disable-next-line no-param-reassign
              data.response.message = `JWToken error ${err}!!`;
              // eslint-disable-next-line no-param-reassign
              data.toProcess = false;
            }
          },
        },
      },
    };

    // add Middleware
    action.addMiddleware(jwtoken.middleware.JWToken);
    // api.params.globalSafeParams.push("csrfToken");
    api.jwtoken = jwtoken;
  }

  // async start() {}

  // async stop() {}
}
