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
var express_1 = __importDefault(require("express"));
var database_1 = __importDefault(require("./database"));
var qrcode_1 = __importDefault(require("qrcode"));
var cors_1 = __importDefault(require("cors"));
var express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var authServer = 'https://dev-q01cbhnbnhsork5v.us.auth0.com';
var checkJwt = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: 'ulaznice',
    issuerBaseURL: "".concat(authServer),
});
app.use(checkJwt);
function generirajQR(url) {
    return __awaiter(this, void 0, void 0, function () {
        var qr, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, qrcode_1.default.toDataURL(url)];
                case 1:
                    qr = _a.sent();
                    return [2 /*return*/, qr];
                case 2:
                    err_1 = _a.sent();
                    console.error('Greška pri generiranju QR koda:', err_1);
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
;
app.get('/brojUlaznica', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var broj, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.default.getBrojUlaznica()];
                case 1:
                    broj = _a.sent();
                    res.json({ 'broj': broj });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    res.status(500).json({ error: 'Greška prilikom izračuna broja ulaznica.' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.get('/ulaznica/:id', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, regex, ulaznicaInfo, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                    if (!regex.test(id)) {
                        res.status(400).json({ error: "Greška prilikom dohvaćanja ulaznice." });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.infoUlaznica(id)];
                case 2:
                    ulaznicaInfo = _a.sent();
                    res.json(ulaznicaInfo);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.message === 'Ulaznica nije pronađena.') {
                        res.status(400).json({ error: "Greška prilikom dohvaćanja ulaznice." });
                        return [2 /*return*/];
                    }
                    res.status(500).json({ error: "Greška prilikom dohvaćanja ulaznice." });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
app.post('/generirajUlaznicu', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, vatin, firstName, lastName, nameRegex, dozvoli, err_3, client, rez, uuid, urlSPA, kod, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, vatin = _a.vatin, firstName = _a.firstName, lastName = _a.lastName;
                    if (!vatin || vatin.length !== 11) {
                        res.status(400).json({ error: 'OIB mora imati 11 znamenki.' });
                        return [2 /*return*/];
                    }
                    nameRegex = /^[A-Za-zČčĆćŽžŠšĐđ]+$/;
                    if (!firstName || !nameRegex.test(firstName)) {
                        res.status(400).json({ error: 'Ime mora biti zadano i sadržavati samo slova.' });
                        return [2 /*return*/];
                    }
                    if (!lastName || !nameRegex.test(lastName)) {
                        res.status(400).json({ error: 'Prezime mora biti zadano i sadržavati samo slova.' });
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.oibBroj(vatin)];
                case 2:
                    dozvoli = _b.sent();
                    if (!dozvoli) {
                        res.status(400).json({ error: 'Za ovaj oib su generirane već 3 ulaznice.' });
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _b.sent();
                    res.status(500).json({ error: 'Greška prilikom izračuna broja ulaznica za oib.' });
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, database_1.default.pool.connect()];
                case 5:
                    client = _b.sent();
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 11, 13, 14]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, database_1.default.createUlaznica(vatin, firstName, lastName, client)];
                case 8:
                    rez = _b.sent();
                    uuid = rez === null || rez === void 0 ? void 0 : rez.rows[0].id;
                    urlSPA = process.env.URLSPA ? "".concat(process.env.URLSPA, "/").concat(uuid) : "https://".concat(hostname, ":4072/").concat(uuid);
                    return [4 /*yield*/, generirajQR(urlSPA)];
                case 9:
                    kod = _b.sent();
                    return [4 /*yield*/, client.query('COMMIT')];
                case 10:
                    _b.sent();
                    res.json({ qrcode: kod });
                    return [3 /*break*/, 14];
                case 11:
                    err_4 = _b.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 12:
                    _b.sent();
                    res.status(500).json({ error: 'Greška prilikom kreiranja ulaznice.' });
                    return [3 /*break*/, 14];
                case 13:
                    client.release();
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
});
var hostname = '127.0.0.1';
var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4071;
if (externalUrl) {
    var hostname_1 = '0.0.0.0';
    database_1.default.createTable()
        .then(function () {
        app.listen(port, hostname_1, function () {
            console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/ and from outside on ").concat(externalUrl));
        });
    })
        .catch(function (err) {
        process.exit(1);
    });
}
else {
    database_1.default.createTable()
        .then(function () {
        app.listen(port, hostname, function () {
            console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
        });
    })
        .catch(function (err) {
        process.exit(1);
    });
}
