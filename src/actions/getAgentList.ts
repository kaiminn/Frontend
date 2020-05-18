import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class GetAgentList extends Action {
  constructor() {
    super();
    this.name = "getAgentList";
    this.description = "get agent list";
    this.outputExample = {
      code: 20000,
      message: "success.",
      data: [
        {
          account: "admin",
          isEnabled: true,
          prefix: "ad",
        },
        {
          account: "rd",
          isEnabled: true,
          prefix: "rd",
        },
        {
          account: "cs",
          isEnabled: true,
          prefix: "cs",
        },
      ],
    };
    this.inputs = {};
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      const result = await adminSystem.getAgentList();
      response.code = 20000;
      response.message = "success.";
      response.data = result;
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
