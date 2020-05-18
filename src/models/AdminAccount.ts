import * as bcrypt from "bcryptjs";
import {
  Model,
  Table,
  AllowNull,
  Column,
  DataType,
  BelongsToMany,
  ForeignKey,
  Unique,
} from "sequelize-typescript";
import Roles from "./Roles";
import AdminAccountRoles from "./AdminAccountRoles";

@Table({ tableName: "AdminAccount" })
export default class AdminAccount extends Model<AdminAccount> {
  saltRounds = 10;

  @Column({ primaryKey: true, type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @ForeignKey(() => AdminAccount)
  @Column(DataType.INTEGER)
  parentId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  account: string;

  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  prefix: string;

  @Column(DataType.BOOLEAN)
  isMaintained: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  passwordHash: string;

  @Column(DataType.STRING)
  lastLoginIP: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isEnabled: boolean;

  @Column(DataType.DATE)
  lastLoginDatetime: Date;

  @Column(DataType.DATE)
  createDatetime: Date;

  @Column(DataType.STRING)
  website: string;

  @Column(DataType.STRING)
  hashKey: string;

  @Column(DataType.STRING)
  APIDomain: string;

  @Column(DataType.STRING)
  whiteIPList: string;

  @BelongsToMany(() => Roles, () => AdminAccountRoles)
  roles: Roles[];

  async updatePassword(password: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(password, this.saltRounds);
    await this.save();
  }

  async checkPassword(password: string): Promise<boolean> {
    if (!this.passwordHash) {
      throw new Error("password not set for this team member");
    }

    const match = await bcrypt.compare(password, this.passwordHash);
    return match;
  }
}
