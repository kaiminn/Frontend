import { Action, ActionProcessor } from "actionhero";

export class LogoutAction extends Action {
  constructor() {
    super();
    this.name = "logout";
    this.description = "logout";
    this.outputExample = { code: 20000, result: "success." };
    this.inputs = {};

    this.middleware = ["JWToken"];
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response } = data;
    data.connection.destroy();
    response.code = 20000;
    response.message = "success.";
  }
}
