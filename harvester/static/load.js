var DFP = {};
    DFP.TAGS_DELIMITER = "&",
    DFP.TAGS_PARAM_DELIMITER = "|",
    DFP.MOBILE_TAGS = "mobileTags",
    DFP.EQUALS = "=",
    DFP.csp_nonce = null,
    DFP.version = 3,
    DFP.create_url = function(t, e, n, r, o, a) {
        function i() {
            return Math.floor(2742745743359 * Math.random())
        }
        function s() {
            return c(i())
        }
        function c(t) {
            return (t + 78364164096).toString(36)
        }
        var l = i()
          , u = i()
          , g = 885187064159;
        u = ((u = u - u % 256 + DFP.version) + l) % 2742745743359,
        g = (g + l) % 2742745743359;
        var d = "https://" + t + "/" + (l = s() + c(l)) + e
          , T = [(u = c(g) + c(u)) + "=" + n, s() + s() + "=" + r, s() + s() + "=" + o];
        return void 0 !== a && a.length > 0 && T.push(s() + s() + "=" + a),
        d + "?" + T.join("&")
    }
    ,
    DFP.beacon = function(t, e, n, r, o) {
        var a = "turn:aa.online-metrix.net?transport="
          , i = "1:" + e + ":" + n
          , s = {
            iceServers: [{
                urls: a + "tcp",
                username: i,
                credential: n
            }, {
                urls: a + "udp",
                username: i,
                credential: n
            }]
        };
        try {
            var c = new RTCPeerConnection(s);
            c.createDataChannel(Math.random().toString());
            var l = function() {}
              , u = function(t) {
                c.setLocalDescription(t, l, l)
            };
            "undefined" == typeof Promise || c.createOffer.length > 0 ? c.createOffer(u, l) : c.createOffer().then(u, l)
        } catch (t) {}
    }
    ,
    DFP.load_tags = function(t, e, n, r, o) {
        DFP.beacon(t, e, n, r, o);
        var a = document.getElementsByTagName("head").item(0)
          , i = document.createElement("script");
        i.id = "dfptags_js"
        i.setAttribute("type", "text/javascript");
        var s = DFP.create_url(t, ".js", e, n, r, o);
        i.setAttribute("src", s),
        DFP.set_async(i)
        DFP.set_csp_nonce(i)
        a.appendChild(i)
    }
    ,
    DFP.set_async = function(t) {
        t.async = !0
    }
    DFP.register_csp_nonce = function(t) {
        if (void 0 !== t.currentScript && null !== t.currentScript) {
            var e = t.currentScript.getAttribute("nonce");
            null != e && "" !== e ? DFP.csp_nonce = e : void 0 !== t.currentScript.nonce && null !== t.currentScript.nonce && "" !== t.currentScript.nonce && (DFP.csp_nonce = t.currentScript.nonce)
        }
    }
    DFP.set_csp_nonce = function(t) {
        null !== DFP.csp_nonce && (t.setAttribute("nonce", DFP.csp_nonce),
        t.getAttribute("nonce") !== DFP.csp_nonce && (t.nonce = DFP.csp_nonce))
    }
    DFP.cleanup = function() {
        for (; null !== (hp_frame = document.getElementById("tdz_ifrm")); )
            hp_frame.parentElement.removeChild(hp_frame);
        for (; null !== (tmx_frame = document.getElementById("tmx_tags_iframe")); )
            tmx_frame.parentElement.removeChild(tmx_frame);
        for (; null !== (tmx_script = document.getElementById("dfptags_js")); )
            tmx_script.parentElement.removeChild(tmx_script)
    }
    DFP.pr = function(t, e, n, r, o) {
        DFP.cleanup();
        DFP.register_csp_nonce(document);
        DFP.load_tags(t, e, n, r, o);
    }
    DFP.isNullOrEmpty = function(t) {
        return !t || false || "undefined" === t || 0 === t.length
    }
    DFP.isInValidCharSet = function(t) {
        for (var e = 0; e < t.length; e++) {
            var n = t.charCodeAt(e);
            if (!(n >= 65 && n < 91 || n >= 97 && n < 123 || n >= 48 && n < 58)) {
                var r = t.charAt(e);
                if ("+" != r && "*" != r && "/" != r && "=" != r)
                    return !0
            }
        }
        return !1
    }

const x_01 = (size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))(32)
const x_02 = window.location.hostname === 'localhost' ? 'localhost:8000' : 'tmx.zacharysproducts.com'

DFP.pr(x_02, "usllpic0", x_01, 6, "");
