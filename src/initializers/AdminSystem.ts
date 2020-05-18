import { api, Initializer } from "actionhero";
import { AdminSystem } from "../AdminSystem";

require("sequelize-hierarchy");

// TODO: Timeout 登出
export class AdminSystemInitializer extends Initializer {
  constructor() {
    super();
    this.name = "adminSystemInitializer";
    this.loadPriority = 3000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize(config): Promise<void> {
    api.adminSystem = new AdminSystem(config);
  }

  // async start(): Promise<void> {}

  // async stop(): Promise<void> {}
}
