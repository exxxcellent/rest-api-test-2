import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface UserCreationAttributes {
    email: string;
    password: string;
    name: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.INTEGER, defaultValue: 0 })
    balance: number;
}
