import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { TransactionCategories, TransactionTypes } from '../constants';

const types: TransactionTypes[] = [
    TransactionTypes.INCOME,
    TransactionTypes.EXPENSE,
];
const categories: TransactionCategories[] = [
    TransactionCategories.SALARY,
    TransactionCategories.FOOD,
    TransactionCategories.TRANSPORT,
    TransactionCategories.ENTERTAINMENT,
    TransactionCategories.BILLS,
];

interface TransactionCreationAttributes {
    amount: number;
    type: TransactionTypes;
    category: TransactionCategories;
    description?: string;
}

@Table({ tableName: 'transactions' })
export class Transaction extends Model<
    Transaction,
    TransactionCreationAttributes
> {
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    amount: number;

    @Column({ type: DataType.ENUM(...types), allowNull: false })
    type: string;

    @Column({ type: DataType.ENUM(...categories), allowNull: false })
    category: string;

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: '' })
    description: string;
}
