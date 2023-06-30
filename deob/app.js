const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const fs = require("fs");
const vm = require("vm");
const { program } = require('commander');
const beautify = require("js-beautify");
const { numberToStringVisitor } = require("./transformers/string_decryption/numbers_to_strings");
const { replace_hex_substrings } = require("./transformers/string_decryption/substring_replacement");
const { bracketBasedUndefinedVisitor } = require("./transformers/bracket_based_undefined")
const {fake_variable_overwrite_visitor} = require("./transformers/fake_variable_overwrite");
const { foldConstantsVisitor } = require("./transformers/constant_folding");


function deobfuscate(source) {
    const ast = parser.parse(source);

    traverse(ast, numberToStringVisitor);
    replace_hex_substrings(ast);
    traverse(ast, bracketBasedUndefinedVisitor);
    traverse(ast, fake_variable_overwrite_visitor)
    traverse(ast, foldConstantsVisitor);


    let deobfCode = generate(ast, { comments: false }).code;
    deobfCode = beautify(deobfCode, {
        indent_size: 2,
        space_in_empty_paren: true,
    });

    return deobfCode;
}



function writeCodeToFile(code) {
    let outputPath = `data/output/${Date.now().toString()}.js`;
    fs.writeFile(outputPath, code, (err) => {
        if (err) {
            console.log("Error writing file", err);
        } else {
            console.log(`Wrote file to ${outputPath}`);
        }
    });
}

program
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .argument('<file>', 'File to deobfuscate')
    .parse(process.argv)
    .action((file, options) => {
        console.log('Deobfuscating file...');
        const deob_code = deobfuscate(fs.readFileSync(file, "utf-8"));
        console.log('Deobfuscated file.')

        writeCodeToFile(deob_code);
    });

program.parse();