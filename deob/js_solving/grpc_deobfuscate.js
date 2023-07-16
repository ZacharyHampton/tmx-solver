const { deobfuscate } = require("../deobfuscate");


function grpc_deobfuscate (transformation_message, callback) {
    const script = transformation_message.request.script;
    const fast = transformation_message.request.fast;

    if (script === "null") {
        return {script: "", error: "No script provided."}
    }

    callback(null, {script: deobfuscate(script, fast), error: ""})
}

module.exports = {
    grpc_deobfuscate
}