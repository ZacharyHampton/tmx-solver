const {default: generate} = require("@babel/generator");

function iframe_tagging(ideal_part) {
    const checks = [
        check_for_jwk_payload,
        check_for_lsa_payload
    ]

    for (const check of checks) {
        const result = check(ideal_part);

        if (result !== undefined) {
            return result;
        }
    }
}

function check_for_jwk_payload(ideal_part) {
    const previous_sibling = ideal_part.getPrevSibling();
    const code = generate(previous_sibling.node).code;

    if (code.includes("sifr")) {
        return "jwk_payload"
    }
}

function check_for_lsa_payload(ideal_part) {
    const parent = ideal_part.parent;
    const code = generate(parent).code;

    if (code.includes("ed73f20edbf2b73")) {
        return "lsa_payload"
    }
}

module.exports = {
    iframe_tagging
}