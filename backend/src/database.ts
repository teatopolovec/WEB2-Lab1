import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config()

interface Ulaznica {
    id: string;
    last_name: string;
    first_name: string;
    oib: string
    
}

class Database {
    public pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: 'ulaznice_p3l5',
            password: process.env.DB_PASSWORD,
            port: 5432,
            ssl : true
        })
    }

    public async getBrojUlaznica() {
        try {
            const rez = await this.pool.query('SELECT COUNT (*) from ulaznice');
            return rez.rows[0].count
        } catch (err) {
            console.error('Greška prilikom izračuna broja ulaznica.', err);
            throw err;
        }
    }

    public async createTable() {
        try {
            const results = await this.pool.query(`
                CREATE TABLE IF NOT EXISTS ulaznice (
                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    oib VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('Tablica kreirana ili već postoji.');
        } catch (err) {
            console.error('Greška prilikom kreiranja tablice.', err);
            throw err;
        }
    }

    public async createUlaznica(oib : string, fname : string, lname : string, client : PoolClient) {
        try {
            const query = `INSERT INTO ulaznice (oib, first_name, last_name) VALUES ($1, $2, $3) RETURNING id`;
            const executor = client || this.pool;
            return await executor.query(query, [oib, fname, lname]);
        } catch (err) {
            console.error('Greška prilikom kreiranja ulaznice.', err);
            throw err;
        }
    }
    public async infoUlaznica(id : string) {
        try {
            const query = `SELECT oib, first_name, last_name, created_at FROM ulaznice WHERE id = $1`;
            const rez = await this.pool.query(query, [id])
            if (rez.rows.length === 0) {
                throw new Error('Ulaznica nije pronađena.');
            }
            return rez.rows[0];
        } catch (err) {
            console.error('Greška prilikom dohvaćanja ulaznice.', err);
            throw err;
        }
    }
    public async oibBroj(oib : string) {
        try {
            const query = `SELECT COUNT (*) FROM ulaznice WHERE oib = $1`;
            const rez = await this.pool.query(query, [oib]);
            const broj = rez.rows[0].count;
            if (broj >= 3) return false;
            else return true;
        } catch (err) {
            console.error('Greška prilikom izračuna broja ulaznica za oib.', err);
            throw err;
        }
    }
}

const dbInstance = new Database();
export default dbInstance;
