import { Pool, PoolClient } from 'pg';
declare class Database {
    pool: Pool;
    constructor();
    getBrojUlaznica(): Promise<any>;
    createTable(): Promise<void>;
    createUlaznica(oib: string, fname: string, lname: string, client: PoolClient): Promise<import("pg").QueryResult<any>>;
    infoUlaznica(id: string): Promise<any>;
    oibBroj(oib: string): Promise<boolean>;
}
declare const dbInstance: Database;
export default dbInstance;
