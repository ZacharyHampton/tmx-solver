const { deobfuscate } = require("../deobfuscate");


function grpc_deobfuscate (transformation_message, callback) {
    const script = transformation_message.request.script;
    const transformation_type = transformation_message.request.transformation_type;

    if (script === "null") {
        return {script: "", error: "No script provided."}
    }

    callback(null, {script: deobfuscate(script, transformation_type), error: ""})
}

module.exports = {
    grpc_deobfuscate
}