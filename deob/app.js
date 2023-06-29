const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const fs = require("fs");
const vm = require("vm");
const beautify = require("js-beautify");


function deobfuscate(source) {
    const ast = parser.parse(source);

    let deobfCode = generate(ast, { comments: false }).code;
    deobfCode = beautify(deobfCode, {
        indent_size: 2,
        space_in_empty_paren: true,
    });

    return deobfCode;
}



function writeCodeToFile(code) {
    let outputPath = "output/output.js";
    fs.writeFile(outputPath, code, (err) => {
        if (err) {
            console.log("Error writing file", err);
        } else {
            console.log(`Wrote file to ${outputPath}`);
        }
    });
}

const deob_code = deobfuscate(fs.readFileSync("input/input.js", "utf-8"));
writeCodeToFile(deob_code);