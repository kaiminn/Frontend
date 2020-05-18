import { Action, api } from "actionhero";
import { AdminSystem } from "../AdminSystem";

export class PermissionListAction extends Action {
  constructor() {
    super();
    this.name = "permissionList";
    this.description = "get permission list";
    this.outputExample = {
      data: {
        roles: {
          "/100permission": [
            "5478c9d5-1078-4607-9624-4a6dbcae92e7",
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "2c90a0bf-19f1-469a-9aab-1072ddc2b78a",
            "cf5fa9ea-bdd4-47d8-bceb-c0a5f9d31d8c",
          ],
          "103adjustRole": [
            "5478c9d5-1078-4607-9624-4a6dbcae92e7",
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "2c90a0bf-19f1-469a-9aab-1072ddc2b78a",
            "cf5fa9ea-bdd4-47d8-bceb-c0a5f9d31d8c",
          ],
          "/adminAccount": [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "cf5fa9ea-bdd4-47d8-bceb-c0a5f9d31d8c",
          ],
          adminaccount: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "cf5fa9ea-bdd4-47d8-bceb-c0a5f9d31d8c",
          ],
          "/gamesetting": [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          giveAway: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          gameRestrictions: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          gameRestrictionsSetting: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          gamePlayer: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          JPSetting: [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          "/200table": [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          "201cashRecord-table": [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
          "202gameRecord-table": [
            "78ca6215-5bb9-48ce-864a-f44a00adfac1",
            "ba8497ed-7046-4a5d-b0e8-86541616b621",
          ],
        },
      },
      code: 20000,
      message: "success.",
    };
    this.inputs = {};

    this.middleware = ["JWToken"];
  }

  async run({ response }): Promise<void> {
    // eslint-disable-next-line prefer-destructuring
    const adminSystem: AdminSystem = api.adminSystem;

    try {
      const roles = await adminSystem.permissionList();
      response.data = {
        roles,
      };
      response.code = 20000;
      response.message = "success.";
    } catch (error) {
      response.code = 50000;
      response.message = error;
    }
  }
}
