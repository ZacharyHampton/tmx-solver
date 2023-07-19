const {default: generate} = require("@babel/generator");

let main_url_found = false;
let lsa_payload_found = false;

function main_tagging(ideal_part) {
    const checks = [
        check_for_main_url_payload,
        check_for_lsa_payload,
        check_for_jwk_payload,
        check_for_online_metrix_iframe,
        check_for_keystrokes_and_mouse_movement,
        check_for_medh_payload,
        check_for_rev_payload
    ]

    for (const check of checks) {
        const result = check(ideal_part);

        if (result !== undefined) {
            switch (result) {
                case "main_url_payload":
                    if (main_url_found) {
                        return null;
                    }

                    main_url_found = true;
                    break;
                case "lsa_payload":
                    if (lsa_payload_found) {
                        return null;
                    }

                    lsa_payload_found = true;
                    break;
            }

            return result;
        }
    }
}

function check_for_main_url_payload(ideal_part) {
    const previous_sibling = ideal_part.getPrevSibling();
    const code = generate(previous_sibling.node).code;

    if (code.includes("navigator.userAgent")) {
        return "main_url_payload"
    }
}

function check_for_lsa_payload(ideal_part) {
    const parent = ideal_part.parent;
    const code = generate(parent).code;

    if (code.includes("ed73f20edbf2b73")) {
        return "lsa_payload"
    }
}

function check_for_jwk_payload(ideal_part) {
    const previous_sibling = ideal_part.getPrevSibling();
    const code = generate(previous_sibling.node).code;

    if (code.includes("sifr")) {
        return "jwk_payload"
    }
}

function check_for_online_metrix_iframe(ideal_part) {
    // get number of siblings
    const siblings = ideal_part.getAllPrevSiblings();
    const code = generate(ideal_part.node).code;
    // siblings.length === 0 &&
    if (code.includes('load_iframe')) {
        return "online_metrix_iframe"
    }
}

function check_for_keystrokes_and_mouse_movement(ideal_part) {
    const previous_sibling = ideal_part.getPrevSibling();
    const previous_code = generate(previous_sibling.node).code;
    const ideal_code = generate(ideal_part.node).code;

    if (previous_code.includes("&je=") && ideal_code.includes("sendBeacon")) {
        return "keystrokes_and_mouse_movement_beacon"
    }
}

function check_for_medh_payload(ideal_part) {
    const next_sibling = ideal_part.getNextSibling();
    const next_code = generate(next_sibling.node).code;
    const ideal_code = generate(ideal_part.node).code;

    if (ideal_code.includes("&jac=1&je=") && next_code.includes("document")) {
        return "medh_payload"
    }
}

function check_for_rev_payload(ideal_part) {
    const two_children_back = ideal_part.getPrevSibling().getPrevSibling();
    const code = generate(two_children_back.node).code;

    if (code.includes("&rev=")) {
        return "rev_payload"
    }
}

module.exports = {
    main_tagging
}