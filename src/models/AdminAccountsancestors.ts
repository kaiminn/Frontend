import {
  Model,
  Table,
  AllowNull,
  Column,
  DataType,
  ForeignKey,
} from "sequelize-typescript";

import AdminAccount from "./AdminAccount";

@Table({ tableName: "AdminAccountsancestors" })
export default class AdminAccountsancestors extends Model<
  AdminAccountsancestors
> {
  @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @ForeignKey(() => AdminAccount)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  adminAccountId: number;

  @ForeignKey(() => AdminAccount)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  ancestorId: number;
}
