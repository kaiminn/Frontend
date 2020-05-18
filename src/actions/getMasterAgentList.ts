import { Action, ActionProcessor, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class GetMasterAgentList extends Action {
  constructor() {
    super();
    this.name = "getMasterAgentList";
    this.description = "get master agent list";
    this.outputExample = {
      code: 20000,
      message: "success.",
      data: [
        {
          account: "mabu777",
          name: "Mabu",
          prefix: "mabu",
          isMaintained: false,
          isEnabled: true,
          website: "website.com",
          hashKey: "key",
          APIDomain: "api.website.com",
          whiteIPList: "127.0.0.1",
        },
        {
          account: "snow",
          name: "snow",
          prefix: "snow",
          isMaintained: false,
          isEnabled: false,
          website: "snow.com",
          hashKey: "myhashkey",
          APIDomain: "api.snow.com",
          whiteIPList: "10.20.103.22",
        },
      ],
    };
    this.inputs = {
      website: {
        required: false,
      },
    };
  }

  async run(data: ActionProcessor): Promise<void> {
    const { response, params } = data;
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;
    const { website } = params;

    try {
      const result = await adminSystem.getMasterAgent(website);

      response.code = 20000;
      response.message = "success.";
      response.data = result;
    } catch (error) {
      const errInfo = JSON.parse(error);

      response.code = errInfo.code;
      response.message = errInfo.message;
    }
  }
}
