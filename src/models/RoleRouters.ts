import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  AllowNull,
  BelongsTo,
} from "sequelize-typescript";
import Roles from "./Roles";

@Table({ tableName: "RoleRouters" })
export default class RoleRouters extends Model<RoleRouters> {
  @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @ForeignKey(() => Roles)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  roleId: number;

  @Column(DataType.STRING)
  path: string;

  @BelongsTo(() => Roles, {
    foreignKey: "roleId",
    targetKey: "id",
  })
  role: Roles;
}
