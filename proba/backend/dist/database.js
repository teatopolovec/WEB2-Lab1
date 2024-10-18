"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var Database = /** @class */ (function () {
    function Database() {
        this.pool = new pg_1.Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: 'ulaznice_p3l5',
            password: process.env.DB_PASSWORD,
            port: 5432,
            ssl: true
        });
    }
    Database.prototype.getBrojUlaznica = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rez, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query('SELECT COUNT (*) from ulaznice')];
                    case 1:
                        rez = _a.sent();
                        return [2 /*return*/, rez.rows[0].count];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Greška prilikom izračuna broja ulaznica.', err_1);
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.createTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.pool.query("\n                CREATE TABLE IF NOT EXISTS ulaznice (\n                    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n                    first_name VARCHAR(255) NOT NULL,\n                    last_name VARCHAR(255) NOT NULL,\n                    oib VARCHAR(255) NOT NULL,\n                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + '2hours'::interval\n                );\n            ")];
                    case 1:
                        results = _a.sent();
                        console.log('Tablica kreirana ili već postoji.');
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error('Greška prilikom kreiranja tablice.', err_2);
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.createUlaznica = function (oib, fname, lname, client) {
        return __awaiter(this, void 0, void 0, function () {
            var query, executor, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "INSERT INTO ulaznice (oib, first_name, last_name) VALUES ($1, $2, $3) RETURNING id";
                        executor = client || this.pool;
                        return [4 /*yield*/, executor.query(query, [oib, fname, lname])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        err_3 = _a.sent();
                        console.error('Greška prilikom kreiranja ulaznice.', err_3);
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.infoUlaznica = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rez, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT oib, first_name, last_name, created_at FROM ulaznice WHERE id = $1";
                        return [4 /*yield*/, this.pool.query(query, [id])];
                    case 1:
                        rez = _a.sent();
                        if (rez.rows.length === 0) {
                            throw new Error('Ulaznica nije pronađena.');
                        }
                        return [2 /*return*/, rez.rows[0]];
                    case 2:
                        err_4 = _a.sent();
                        console.error('Greška prilikom dohvaćanja ulaznice.', err_4);
                        throw err_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.oibBroj = function (oib) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rez, broj, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT COUNT (*) FROM ulaznice WHERE oib = $1";
                        return [4 /*yield*/, this.pool.query(query, [oib])];
                    case 1:
                        rez = _a.sent();
                        broj = rez.rows[0].count;
                        if (broj >= 3)
                            return [2 /*return*/, false];
                        else
                            return [2 /*return*/, true];
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.error('Greška prilikom izračuna broja ulaznica za oib.', err_5);
                        throw err_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Database;
}());
var dbInstance = new Database();
exports.default = dbInstance;
