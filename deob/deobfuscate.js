const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const beautify = require("js-beautify");
const { numberToStringVisitor } = require("./transformers/string_decryption/numbers_to_strings");
const { replace_hex_substrings } = require("./transformers/string_decryption/substring_replacement");
const { bracketBasedUndefinedVisitor } = require("./transformers/bracket_based_undefined")
const {fake_variable_overwrite_visitor} = require("./transformers/fake_variable_overwrite");
const { foldConstantsVisitor } = require("./transformers/constant_folding");
const { hexStringVisitor } = require("./transformers/hex_string_unpack");
const {functionWrapperVisitor} = require("./transformers/wrapped_function_removal");


function deobfuscate(source) {
    const ast = parser.parse(source);

    traverse(ast, functionWrapperVisitor)
    traverse(ast, numberToStringVisitor);
    replace_hex_substrings(ast);
    traverse(ast, bracketBasedUndefinedVisitor);
    traverse(ast, fake_variable_overwrite_visitor)
    traverse(ast, foldConstantsVisitor);
    traverse(ast, hexStringVisitor);


    let deobfCode = generate(ast, { comments: false }).code;
    deobfCode = beautify(deobfCode, {
        indent_size: 2,
        space_in_empty_paren: true,
    });

    return deobfCode;
}

module.exports = {
    deobfuscate
}