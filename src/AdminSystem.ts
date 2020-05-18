import { api, id, log, redis } from "actionhero";
import { Redis } from "ioredis";
import { Sequelize } from "sequelize-typescript";
import { Op } from "sequelize";
import * as _ from "lodash";
import * as sequelizeHierarchy from "sequelize-hierarchy";
import * as uuid from "uuid/v4";
import { ERROR_TYPE } from "./ErrorDefinition";
import RoleRouters from "./models/RoleRouters";
import AdminAccountModel from "./models/AdminAccount";
import RolesModel from "./models/Roles";
import AdminAccountRolesModel from "./models/AdminAccountRoles";
import { IResponse } from "./actions/types";

interface IRediskey {
  AdminSystemPubChannel: string;
  LockDefaultMs: number;
}

export class AdminSystem {
  rediskey: IRediskey;

  redisclient: Redis;

  name: string;

  constructor(adminSystemConfig) {
    const { PubChannel } = adminSystemConfig.adminSystem;
    this.name = "adminSystem";
    this.rediskey = {
      AdminSystemPubChannel: PubChannel,
      LockDefaultMs: 1000,
    };

    sequelizeHierarchy(Sequelize);
  }

  // 登入驗證
  async validateLogin(param: {
    username: number;
    password: string;
    clientIP: string;
  }): Promise<{ result: IResponse; data: AdminAccountModel }> {
    try {
      let account = await AdminAccountModel.findOne({
        where: { account: param.username },
      });

      const actionResult: IResponse = { code: 20000, message: "sucess" };

      if (account) {
        // 紀錄登錄的IP 及時間
        account.lastLoginIP = param.clientIP;
        account.lastLoginDatetime = new Date();
        account.save();

        // 驗證密碼是否正確
        const checkResult = await account.checkPassword(param.password);
        if (!checkResult) {
          account = null;
          actionResult.code = 50003;
          actionResult.message = "Wrong password.";
          return { result: actionResult, data: null };
        }

        return { result: actionResult, data: account };
      }

      // 帳號不存在
      actionResult.code = 50002;
      actionResult.message = "account is not exists.";
      return { result: actionResult, data: null };
    } catch (error) {
      api.log(
        `${this.name} execute validateLogin() Error: ${error} !!!`,
        "error"
      );

      throw Error(`${this.name} execute validateLogin() Error: ${error} !!!`);
    }
  }

  // 利用 AdminId 取得帳號資料
  async getAdminAccountById(param: {
    id: number;
  }): Promise<{ account: string; roles: RolesModel[] }> {
    try {
      const account = await AdminAccountModel.findOne({
        include: [RolesModel],
        where: { id: param.id },
      });

      return account;
    } catch (error) {
      api.log(
        `${this.name} execute getAdminAccountById() Error: ${error} !!!`,
        "error"
      );

      throw Error(
        `${this.name} execute getAdminAccountById() Error: ${error} !!!`
      );
    }
  }

  // 取得 adminAccountId 其下階所有 AdminAccount 的資料
  async getAdminAccount(
    params: {
      id: number;
      filter: {
        account: string;
        isEnabled: boolean;
        startDate: Date;
        dueDate: Date;
      };
    },
    limit?: number,
    page?: number
  ): Promise<{
    rows: {
      id: number;
      account: string;
      name: string;
      prefix: string;
      isMaintained: boolean;
      roles: RolesModel[];
      lastLoginIP: string;
      lastLoginDatetime: Date;
      isEnabled: boolean;
      createDatetime: Date;
    }[];
    count: number;
  }> {
    try {
      const offset = page ? (_.toNumber(page) - 1) * _.toNumber(limit) : -1;
      const whereCondition = {
        parentId: params.id,
        account: { [Op.like]: `%${_.toString(params.filter.account)}%` },
      };

      if (params.filter.isEnabled !== undefined) {
        // eslint-disable-next-line dot-notation
        whereCondition["isEnabled"] = params.filter.isEnabled;
      }

      if (params.filter && (params.filter.startDate || params.filter.dueDate)) {
        // eslint-disable-next-line dot-notation
        whereCondition["createDatetime"] = {
          [Op.gte]: params.filter.startDate || null,
          [Op.lte]: params.filter.dueDate || null,
        };

        // 過濾 whereCondition value null
        // eslint-disable-next-line dot-notation
        whereCondition["createDatetime"] = _.pickBy(
          // eslint-disable-next-line dot-notation
          whereCondition["createDatetime"],
          _.identity
        );
      }

      const result = await AdminAccountModel.findAndCountAll({
        include: [RolesModel],
        distinct: true,
        where: whereCondition,
        limit,
        offset,
      });

      const rows = result.rows.map((r) => {
        return {
          id: r.id,
          account: r.account,
          name: r.name,
          prefix: r.prefix,
          isMaintained: r.isMaintained,
          roles: r.roles,
          lastLoginIP: r.lastLoginIP,
          lastLoginDatetime: r.lastLoginDatetime,
          isEnabled: r.isEnabled,
          createDatetime: r.createDatetime,
          website: r.website,
          hashKey: r.hashKey,
          APIDomain: r.APIDomain,
          whiteIPList: r.whiteIPList,
        };
      });

      return {
        rows,
        count: result.count,
      };
    } catch (error) {
      api.log(
        `${this.name} execute getAdminccount() Error: ${error} !!!`,
        "error"
      );

      throw Error(`${this.name} execute getAdminccount() Error: ${error} !!!`);
    }
  }

  // 取得 master agent(有設定 website 的 agent)
  async getMasterAgent(website?: string) {
    let result: AdminAccountModel[] = [];

    try {
      if (website) {
        const masterAgent = await AdminAccountModel.findOne({
          where: { website },
        });

        result.push(masterAgent);
      } else {
        const masterAgents = await AdminAccountModel.findAll({
          where: { website: { [Op.ne]: "" } },
        });

        result = masterAgents;
      }

      const rtValue = result.map((agent) => {
        return {
          account: agent.account,
          name: agent.name,
          prefix: agent.prefix,
          isMaintained: agent.isMaintained,
          isEnabled: agent.isEnabled,
          website: agent.website,
          hashKey: agent.hashKey,
          APIDomain: agent.APIDomain,
          whiteIPList: agent.whiteIPList,
        };
      });

      return rtValue;
    } catch (error) {
      api.log(
        `${this.name} execute getMasterAgent() Error: ${error} !!!`,
        "error"
      );

      throw JSON.stringify(ERROR_TYPE.GET_MASTER_AGENT_INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 新增 Admin 帳號
   * @param params
   */
  async createAdminAccount(params: {
    adminAccountId: number;
    account: string;
    name: string;
    prefix: string;
    password: string;
    roles: string[];
    isEnabled: boolean;
    website?: string;
    hashKey?: string;
    APIDomain?: string;
    whiteIPList?: string;
  }): Promise<IResponse> {
    let result: IResponse = { code: 20000, message: "success." };
    const { sequelize } = api;
    const t = await sequelize.transaction();
    const {
      adminAccountId,
      account,
      name,
      prefix,
      password,
      roles,
      isEnabled,
      website,
      hashKey,
      APIDomain,
      whiteIPList,
    } = params;
    try {
      // 檢查帳戶是否可以使用
      const adminAccountExist = await AdminAccountModel.findOne({
        where: { account },
      });

      // 帳號己存在
      if (adminAccountExist) {
        result = {
          code: 50001,
          message: "account already exists.",
        };

        t.rollback();
        return result;
      }

      const newAdminAccount = new AdminAccountModel({
        parentId: adminAccountId,
        account,
        name,
        prefix,
        isMaintained: false,
        isEnabled,
        createDatetime: new Date(),
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      });

      await newAdminAccount.updatePassword(password);
      await newAdminAccount.save();

      // 建立帳號和角色關聯
      const insertData = [];
      roles.forEach((role) => {
        insertData.push({
          adminAccountId: newAdminAccount.id,
          roleId: role,
        });
      });

      await AdminAccountRolesModel.bulkCreate(insertData, { transaction: t });
      await t.commit();

      const pubData = {
        parentId: newAdminAccount.parentId,
        account,
        name,
        prefix,
        isMaintained: false,
        lastLoginIP: "",
        isEnabled,
        lastLoginDatetime: null,
        createDatetime: newAdminAccount.createDatetime,
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      };
      await this.notifyUpdateAdminAccount(pubData);

      result = {
        code: 20000,
        message: "success.",
      };

      return result;
    } catch (error) {
      await t.rollback();
      api.log(
        `${this.name} execute createAdminccount() Error: ${error} !!!`,
        "error"
      );

      throw Error(
        `${this.name} execute createAdminccount() Error: ${error} !!!`
      );
    }
  }

  async changeAdminAccountPassword(params: {
    adminAccountId: number;
    account: string;
    password: string;
  }): Promise<IResponse> {
    try {
      const { account, password } = params;
      const accountModel = await AdminAccountModel.findOne({
        where: { parentId: params.adminAccountId, account },
      });

      if (accountModel) {
        accountModel.updatePassword(password);
        accountModel.save();

        return {
          code: 20000,
          message: "success.",
        };
      }

      return {
        code: 50001,
        message: "Can not find the account",
      };
    } catch (error) {
      api.log(
        `${this.name} execute changeAdminAccountPassword() Error: ${error} !!!`,
        "error"
      );
      throw Error(
        `${this.name} execute changeAdminAccountPassword() Error: ${error} !!!`
      );
    }
  }

  // 更新 AdminAccount 資料
  async updateAdminAccount(params: {
    id: number;
    account: string;
    name: string;
    prefix: string;
    isMaintained: boolean;
    isEnabled: boolean;
    roles: string[];
    website: string;
    hashKey: string;
    APIDomain: string;
    whiteIPList: string;
  }): Promise<void> {
    const { sequelize } = api;
    const t = await sequelize.transaction();
    const {
      account,
      name,
      prefix,
      isMaintained,
      isEnabled,
      roles,
      website,
      hashKey,
      APIDomain,
      whiteIPList,
    } = params;

    try {
      const accountModel = await AdminAccountModel.findOne({
        where: { id: params.id, account },
        transaction: t,
      });

      accountModel.update(
        {
          name,
          prefix,
          isMaintained,
          isEnabled,
          website,
          hashKey,
          APIDomain,
          whiteIPList,
        },
        {
          where: {
            id: params.id,
            account: params.account,
          },
        }
      );

      // 刪除舊有的帳號角色關聯表
      await AdminAccountRolesModel.destroy({
        where: {
          adminAccountId: params.id,
        },
        transaction: t,
      });

      // 建立新的帳號角色關聯
      const createParam = [];
      for (let rolesIndex = 0; rolesIndex < roles.length; rolesIndex += 1) {
        const roleId = roles[rolesIndex];
        createParam.push({
          adminAccountId: params.id,
          roleId,
        });
      }

      await AdminAccountRolesModel.bulkCreate(createParam, { transaction: t });
      await t.commit();

      // publish update admin account event
      const pubData = {
        parentId: accountModel.parentId,
        account,
        name,
        prefix,
        isMaintained,
        lastLoginIP: accountModel.lastLoginIP,
        isEnabled,
        lastLoginDatetime: accountModel.lastLoginDatetime,
        createDatetime: accountModel.createDatetime,
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      };
      await this.notifyUpdateAdminAccount(pubData);
    } catch (error) {
      await t.rollback();
      api.log(
        `${this.name} execute updateAdminAccount() Error: ${error} !!!`,
        "error"
      );
      throw Error(
        `${this.name} execute updateAdminAccount() Error: ${error} !!!`
      );
    }
  }

  async notifyUpdateAdminAccount(pubData: {
    parentId: number;
    account: string;
    name: string;
    prefix: string;
    isMaintained: boolean;
    lastLoginIP: string;
    isEnabled: boolean;
    lastLoginDatetime: Date;
    createDatetime: Date;
    website: string;
    hashKey: string;
    APIDomain: string;
    whiteIPList: string;
  }): Promise<void> {
    try {
      const {
        parentId,
        account,
        name,
        prefix,
        isMaintained,
        lastLoginIP,
        isEnabled,
        lastLoginDatetime,
        createDatetime,
        website,
        hashKey,
        APIDomain,
        whiteIPList,
      } = pubData;
      const message = {
        messageType: this.rediskey.AdminSystemPubChannel,
        serverId: id,
        serverToken: api.config.general.serverToken,
        agentInfo: {
          parentId,
          account,
          name,
          prefix,
          isMaintained,
          lastLoginIP,
          isEnabled,
          lastLoginDatetime,
          createDatetime,
          website,
          hashKey,
          APIDomain,
          whiteIPList,
        },
      };
      await redis.publish(message);
    } catch (error) {
      log(`${this.name} notifyGameRecord() error=${error} Fail!!`, "error");
    }
  }

  // 利用 role key 取得其 id 的值
  async getRoleIdByKey(key: string): Promise<number> {
    const role = await RolesModel.findOne({ where: { key } });
    return role.id;
  }

  // 取得權限資料
  async permissionList(): Promise<{}> {
    const rolesList = {};
    let rolesDbData;
    try {
      rolesDbData = await RoleRouters.findAll({
        include: [RolesModel],
      });

      // eslint-disable-next-line func-names
      _.map(rolesDbData, function(value) {
        const { path, role } = value.dataValues;

        if (!rolesList[path]) {
          rolesList[path] = [];
        }

        rolesList[path].push(role.key);
      });

      return rolesList;
    } catch (error) {
      api.log(
        `${this.name} execute permissionList() Error: ${error} !!!`,
        "error"
      );

      throw new Error(
        `${this.name} execute permissionList() Error: ${error} !!!`
      );
    }
    // const fakeData = {
    //   1: {
    //     "/100permission": ["admin"],
    //     "404": ["admin", "mabu"],
    //     "401": ["editor"]
    //   },
    //   2: {
    //     "/100permission": ["admin"],
    //     "/icon": ["admin"],
    //     "/components": ["admin"],
    //     "/charts": ["admin"],
    //     "/nested": ["admin"],
    //     "/example": ["admin"],
    //     "/tab": ["admin"],
    //     "/error": ["admin"],
    //     "/error-log": ["admin"],
    //     "/excel": ["admin"],
    //     "/zip": ["admin"],
    //     "/pdf": ["admin"],
    //     "/pdf-download-example": ["admin"],
    //     "/clipboard": ["admin"],
    //     "/i18n": ["admin"],
    //     "external-link": ["admin"],
    //     "*": ["admin"],
    //     "/guide": ["admin"],
    //     "/theme": ["admin"],
    //     "dynamic-table": ["admin"],
    //     "draggable-table": ["admin"],
    //     "inline-edit-table": ["admin"],
    //     "complex-table": ["admin"],
    //     "201cashRecord-table": ["admin", "editor"],
    //     "202gameRecord-table": ["admin", "editor"]
    //   }
    // };
    // const fake = Math.floor(Math.random() * 2) + 1;
    // return fakeData[2];
  }

  async getRolesList(
    adminAccountId: number
  ): Promise<
    {
      key: string;
      name: string;
      description: string;
    }[]
  > {
    let rolesDbData;
    try {
      rolesDbData = await RolesModel.findAll({
        where: { adminAccountId },
      });

      return rolesDbData;
    } catch (error) {
      api.log(
        `${this.name} execute getRolesList() Error: ${error} !!!`,
        "error"
      );

      throw new Error(
        `${this.name} execute getRolesList() Error: ${error} !!!`
      );
    }
  }

  async deleteRole(param: {
    key: string;
    adminAccountId: number;
  }): Promise<boolean> {
    const { sequelize } = api;
    const t = await sequelize.transaction();
    try {
      const role = await RolesModel.findOne({
        where: { key: param.key, adminAccountId: param.adminAccountId },
      });

      let roleId;
      if (role) {
        roleId = role.id;
        await AdminAccountRolesModel.destroy({
          where: { roleId },
          transaction: t,
        });
        await RoleRouters.destroy({ where: { roleId }, transaction: t });
        await RolesModel.destroy({ where: { id: roleId }, transaction: t });
        await t.commit();
        return true;
      }

      api.log(
        `${this.name} Warming execute deleteRole(): Admin account id:${param.adminAccountId} want to delete row ${param.key}`,
        "warning"
      );
      return false;
    } catch (error) {
      await t.rollback();
      api.log(`${this.name} execute deleteRole() Error: ${error} !!!`, "error");
      throw Error(`${this.name} execute deleteRole() Error: ${error} !!!`);
    }
  }

  async createRole(
    adminAccountId: number,
    name: string,
    description: string,
    router: []
  ): Promise<string> {
    const { sequelize } = api;
    const t = await sequelize.transaction();
    let newRole: RolesModel;
    try {
      newRole = await RolesModel.create(
        { adminAccountId, key: uuid(), name, description },
        { transaction: t }
      );

      // 處理要加入到 RoleRouters 的資料
      const insertData = [];
      _.map(router, (value) => {
        insertData.push({ path: value, roleId: newRole.id });
      });

      await RoleRouters.bulkCreate(insertData, { transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      api.log(`${this.name} execute createRole() Error: ${error} !!!`, "error");
      throw Error(`${this.name} execute createRole() Error: ${error} !!!`);
    }
    return newRole.key;
  }

  async updateRole(key: string, router: []): Promise<string> {
    const insertData = [];
    _.map(router, (value) => {
      insertData.push({ path: value, roleId: key });
    });
    const { sequelize } = api;
    const t = await sequelize.transaction();
    try {
      await RoleRouters.destroy({ where: { roleId: key }, transaction: t });
      await RoleRouters.bulkCreate(insertData, { transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      api.log(`${this.name} execute createRole() Error: ${error} !!!`, "error");
      throw Error(`${this.name} execute createRole() Error: ${error} !!!`);
    }
    return key;
  }

  async getAgentList(): Promise<
    {
      account: string;
      isEnabled: boolean;
    }[]
  > {
    try {
      const agents = AdminAccountModel.findAll({
        where: { account: { [Op.ne]: "super" } },
      });

      const result = agents.map((agent) => {
        return {
          parentId: agent.parentId,
          account: agent.account,
          name: agent.name,
          prefix: agent.prefix,
          isMaintained: agent.isMaintained,
          lastLoginIP: agent.lastLoginIP,
          isEnabled: agent.isEnabled,
          lastLoginDatetime: agent.lastLoginDatetime,
          createDatetime: agent.createDatetime,
          website: agent.website,
          hashKey: agent.hashKey,
          APIDomain: agent.APIDomain,
          whiteIPList: agent.whiteIPList,
        };
      });

      return result;
    } catch (error) {
      api.log(
        `${this.name} execute getAgentList() Error: ${error} !!!`,
        "error"
      );
      throw Error(`${this.name} execute getAgentList() Error: ${error} !!!`);
    }
  }
}
