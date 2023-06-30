const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const fs = require("fs");
const vm = require("vm");
const beautify = require("js-beautify");
const { numberToStringVisitor } = require("./transformers/string_decryption/numbers_to_strings");
const { replace_hex_substrings } = require("./transformers/string_decryption/substring_replacement");
const { bracketBasedUndefinedVisitor } = require("./transformers/bracket_based_undefined")

function deobfuscate(source) {
    const ast = parser.parse(source);

    traverse(ast, numberToStringVisitor);
    replace_hex_substrings(ast);
    traverse(ast, bracketBasedUndefinedVisitor);

    let deobfCode = generate(ast, { comments: false }).code;
    deobfCode = beautify(deobfCode, {
        indent_size: 2,
        space_in_empty_paren: true,
    });

    return deobfCode;
}



function writeCodeToFile(code) {
    let outputPath = "data/output/output.js";
    fs.writeFile(outputPath, code, (err) => {
        if (err) {
            console.log("Error writing file", err);
        } else {
            console.log(`Wrote file to ${outputPath}`);
        }
    });
}

const deob_code = deobfuscate(fs.readFileSync("data/input/input-init.js", "utf-8"));
writeCodeToFile(deob_code);