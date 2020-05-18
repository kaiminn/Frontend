import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
  ForeignKey,
  AllowNull,
  Unique,
  BelongsTo,
  BeforeCreate,
  HasMany,
} from "sequelize-typescript";
import * as uuid from "uuid/v4";
import AdminAccount from "./AdminAccount";
import AdminAccountRoles from "./AdminAccountRoles";
import RoleRouters from "./RoleRouters";

@Table({ tableName: "Roles" })
export default class Roles extends Model<Roles> {
  @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  id: number;

  // @ForeignKey(() => Roles)
  // @Column(DataType.INTEGER)
  // parentId: number | null;

  // @Column(DataType.INTEGER)
  // hierarchyLevel: number;

  @ForeignKey(() => AdminAccount)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  adminAccountId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  key: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  description: string;

  @BelongsToMany(() => AdminAccount, () => AdminAccountRoles)
  adminAccounts: AdminAccount[];

  @BelongsTo(() => AdminAccount, {
    foreignKey: "adminAccountId",
    targetKey: "id",
  })
  creator: AdminAccount;

  @BelongsToMany(() => Roles, () => AdminAccountRoles, "roleId")
  roleRouters: RoleRouters[];

  // @BelongsTo(() => Roles, {
  //   foreignKey: "parentId",
  //   targetKey: "id"
  // })
  // parent: Roles;

  // @HasMany(() => Roles, "parentId")
  // children: Roles;

  // @BelongsToMany(
  //   () => Roles,
  //   () => RolesAncestor,
  //   "ancestorId"
  // )
  // descendents: RolesAncestor;

  // @BelongsToMany(
  //   () => Roles,
  //   () => RolesAncestor,
  //   "roleId"
  // )
  // ancestors: RolesAncestor;

  @BeforeCreate
  static generateKey(instance: Roles): void {
    if (!instance.key) {
      // eslint-disable-next-line no-param-reassign
      instance.key = uuid();
    }
  }
}
