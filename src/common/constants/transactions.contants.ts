// enums
export enum TransactionCategories {
    SALARY = 'SALARY',
    FOOD = 'FOOD',
    TRANSPORT = 'TRANSPORT',
    ENTERTAINMENT = 'ENTERTAINMENT',
    BILLS = 'BILLS',
}
export enum TransactionTypes {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

// error handling
export const TRANSACTION_NOT_FOUND = 'Transaction not found';
export const TRANSACTION_NOT_UPDATED = 'Transaction not updated';
export const TRANSACTION_NOT_DELETED = 'Transaction not deleted';

// socket messages
export const TRANSACTION_CREATED = 'Transaction created';
export const TRANSACTION_UPDATED = 'Transaction updated';
export const TRANSACTION_DELETED = 'Transaction deleted';
