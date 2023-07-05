const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const fs = require("fs");
const vm = require("vm");
const { program, Argument} = require('commander');
const beautify = require("js-beautify");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { numberToStringVisitor } = require("./transformers/string_decryption/numbers_to_strings");
const { replace_hex_substrings } = require("./transformers/string_decryption/substring_replacement");
const { bracketBasedUndefinedVisitor } = require("./transformers/bracket_based_undefined")
const {fake_variable_overwrite_visitor} = require("./transformers/fake_variable_overwrite");
const { foldConstantsVisitor } = require("./transformers/constant_folding");
const { hexStringVisitor } = require("./transformers/hex_string_unpack");

function deobfuscate(source) {
    const ast = parser.parse(source);

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



function writeCodeToFile(code) {
    let outputPath = `data/output/${Date.now().toString()}.js`;
    fs.writeFile(outputPath, code, (err) => {
        if (err) {
            console.log("Error writing file", err);
        } else {
            console.log(`Wrote deobfuscated code to ${outputPath}`);
        }
    });
}

program
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .addArgument(new Argument('<method>', 'Specify method of running.').choices(['server', 'file']))
    // depends on method argument
    .option('-f, --file <file>', 'Specify file to deobfuscate')
    .parse(process.argv)
    .action((method, options) => {
        if (method === 'file') {
            if (options.file) {
                fs.readFile(options.file, "utf8", (err, data) => {
                    if (err) {
                        console.log("Error reading file", err);
                    } else {
                        console.log('Deobfuscating...')
                        let deobfCode = deobfuscate(data);
                        writeCodeToFile(deobfCode);
                    }
                });
            } else {
                console.log('Please specify a file to deobfuscate.')
            }
        } else if (method === 'server') {
            const server = new grpc.Server();

            const packageDefinition = protoLoader.loadSync(
                "../protos/services.proto",
                {keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true
                });
            const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
            const transformation_service = protoDescriptor.TransformationService

            server.addService(transformation_service.service, {
                Transform: function (transformation_message) {
                    const script = transformation_message.request.script;

                    if (script === "null") {
                        return {script: "", error: "No script provided."}
                    }

                    return {script: deobfuscate(script), error: ""}
                },
            });

            server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
                server.start();
            });
        }
    });

program.parse();