const fs = require("fs");
const { program, Argument} = require('commander');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { deobfuscate } = require('./deobfuscate');
const { grpc_deobfuscate } = require('./js_solving/grpc_deobfuscate');
const { create_profiling_url } = require('./js_solving/create_profiling_url');




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
                "protos/services.proto",
                {keepCase: true,
                    longs: String,
                    enums: String,
                    defaults: true,
                    oneofs: true
                });
            const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
            const transformation_service = protoDescriptor.TransformationService

            server.addService(transformation_service.service, {
                Transform: grpc_deobfuscate,
                CreateURLVM: create_profiling_url
            });

            server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
                server.start();
            });
        }
    });

program.parse();