import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface TokenCreationAttributes {
    userId: string;
    refreshToken: string;
    userAgent: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAttributes> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    userId: number;

    @Column({ type: DataType.STRING, allowNull: false })
    refreshToken: string;

    @Column({ type: DataType.STRING, allowNull: false })
    userAgent: string;
}
