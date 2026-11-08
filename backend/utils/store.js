
const fs = require("fs");
const path = require("path");

const file = (name) => path.join(__dirname, "..", "data", `${name}.json`);

function read(name) {
  try { return JSON.parse(fs.readFileSync(file(name), "utf8")); }
  catch { return []; }
}
const write = (name, rows) => fs.writeFileSync(file(name), JSON.stringify(rows, null, 2));

module.exports = { read, write };
