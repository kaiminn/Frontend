import {
  Model,
  Table,
  AllowNull,
  ForeignKey,
  Column,
  DataType,
} from "sequelize-typescript";
import Roles from "./Roles";
import AdminAccount from "./AdminAccount";

@Table({ tableName: "AdminAccountRoles" })
export default class AdminAccountRoles extends Model<AdminAccountRoles> {
  @ForeignKey(() => AdminAccount)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  adminAccountId: number;

  @ForeignKey(() => Roles)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  roleId: number;
}
