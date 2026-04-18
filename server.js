const http = require("http");
const fs = require("fs");
const path = require("path");

const host = "0.0.0.0";
const port = Number(process.env.PORT) || 8080;
const root = __dirname;

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8"
};

function sendFile(response, filePath)
{
    fs.readFile(filePath, (error, content) => {
        if (error)
        {
            response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Not found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        const contentType = contentTypes[extension] || "application/octet-stream";

        response.writeHead(200, { "Content-Type": contentType });
        response.end(content);
    });
}

const server = http.createServer((request, response) => {
    const requestPath = request.url === "/" ? "/index.html" : request.url;
    const safePath = path.normalize(requestPath).replace(/^([.][.][/\\])+/, "");
    const filePath = path.join(root, safePath);

    if (request.url === "/health" || request.url === "/healthz")
    {
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("ok");
        return;
    }

    sendFile(response, filePath);
});

server.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
});