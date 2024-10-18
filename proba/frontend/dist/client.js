"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(express_1.default.static('public'));
app.set("views", path_1.default.join(__dirname, "views"));
app.set('view engine', 'pug');
var hostname = '127.0.0.1';
app.get("/auth_config.json", function (req, res) {
    res.json({
        "domain": "dev-q01cbhnbnhsork5v.us.auth0.com",
        "clientId": process.env.CLIENT_ID,
        "audience": 'ulaznice'
    });
});
app.get("/m2m.json", function (req, res) {
    res.json({
        "client_secret": process.env.CLIENT_SECRET,
        "client_id": process.env.CLIENT_IDM2M,
        "audience": 'ulaznice',
        "grant": "client_credentials"
    });
});
app.get("/render", function (req, res) {
    res.json({
        "render": process.env.RENDER_SERVER,
    });
});
app.get('/', function (req, res) {
    res.render('index-spa');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/:id', function (req, res) {
    var uuid = req.params.id;
    res.render('ulaznica', { uuid: uuid });
});
var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4072;
if (externalUrl) {
    var hostname_1 = '0.0.0.0';
    app.listen(port, hostname_1, function () {
        console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/ and from outside on ").concat(externalUrl));
    });
}
else {
    https_1.default.createServer({
        key: fs_1.default.readFileSync('server.key'),
        cert: fs_1.default.readFileSync('server.cert')
    }, app)
        .listen(port, function () {
        console.log("SPA hosted at https://".concat(hostname, ":").concat(port, "/"));
    });
}
