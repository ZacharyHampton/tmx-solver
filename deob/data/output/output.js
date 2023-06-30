(function() {
  var td_0P = td_0P || {};
  td_0P.td_1S = function(td_m, td_n) {
    try {
      var td_c = [""];
      var td_x = 0;
      for (var td_R = 0; td_R < td_n.length; ++td_R) {
        td_c.push(String.fromCharCode(td_m.charCodeAt(td_x) ^ td_n.charCodeAt(td_R)));
        td_x++;
        if (td_x >= td_m.length) {
          td_x = 0;
        }
      }
      return td_c.join("");
    } catch (td_b) {
      return null;
    }
  };
  td_0P.td_5l = function(td_k) {
    if (!String || !String.fromCharCode || !parseInt) {
      return null;
    }
    try {
      this.td_c = td_k;
      this.td_d = "";
      this.td_f = function(td_Q, td_G) {
        if (0 === this.td_d.length) {
          var td_Z = this.td_c.substr(0, 32);
          var td_U = "";
          for (var td_O = 32; td_O < td_k.length; td_O += 2) {
            td_U += String.fromCharCode(parseInt(td_k.substr(td_O, 2), 16));
          }
          this.td_d = td_0P.td_1S(td_Z, td_U);
        }
        if (this.td_d.substr) {
          return this.td_d.substr(td_Q, td_G);
        }
      };
    } catch (td_S) {}
    return null;
  };
  td_0P.td_5o = function(td_e) {
    if (td_e === null || td_e.length === null || !String || !String.fromCharCode) {
      return null;
    }
    var td_R = null;
    try {
      var td_A = "";
      var td_y = [];
      var td_g = String.fromCharCode(48) + String.fromCharCode(48) + String.fromCharCode(48);
      var td_C = 0;
      for (var td_B = 0; td_B < td_e.length; ++td_B) {
        if (65 + td_C >= 126) {
          td_C = 0;
        }
        var td_Z = (td_g + td_e.charCodeAt(td_C++)).slice(-3);
        td_y.push(td_Z);
      }
      var td_N = td_y.join("");
      td_C = 0;
      for (var td_B = 0; td_B < td_N.length; ++td_B) {
        if (65 + td_C >= 126) {
          td_C = 0;
        }
        var td_D = String.fromCharCode(65 + td_C++);
        if (td_D !== "undefined") {
          td_A += td_D;
        }
      }
      td_R = td_0P.td_1S(td_A, td_N);
    } catch (td_M) {
      return null;
    }
    return td_R;
  };
  td_0P.td_1M = function(td_y) {
    if (td_y === null || td_y.length === null) {
      return null;
    }
    var td_v = "";
    try {
      var td_o = "";
      var td_x = 0;
      for (var td_g = 0; td_g < td_y.length; ++td_g) {
        if (65 + td_x >= 126) {
          td_x = 0;
        }
        var td_E = String.fromCharCode(65 + td_x++);
        if (td_E !== "undefined") {
          td_o += td_E;
        }
      }
      var td_J = td_0P.td_1S(td_o, td_y);
      var td_F = td_J.match(/.{1,3}/g);
      for (var td_g = 0; td_g < td_F.length; ++td_g) {
        td_v += String.fromCharCode(parseInt(td_F[td_g], 10));
      }
    } catch (td_T) {
      return null;
    }
    return td_v;
  };
  td_0P.td_2G = function(td_Nw) {
    var td_Fb = td_Nw.createElement("p");
    td_Nw.body.appendChild(td_Fb);
    td_0P.td_5B(td_Fb, "url(" + td_0P.td_4V + ")");
    var td_PS = td_Nw.createElement("img");
    td_0P.td_3c(td_PS, td_0P.td_3M);
    td_PS.setAttribute("alt", "empty");
    td_PS.style.visibility = "hidden";
    td_Nw.body.appendChild(td_PS);
    if (td_0P.td_0M) {
      var td_wE = function td_4c() {};
      var td_pg = null;
      if (typeof td_wE.name === "undefined") {
        td_pg = td_wE.toString().match(/^function\s*([^\s(]+)/)[1];
      } else {
        td_pg = td_wE.name;
      }
      var td_g2 = td_Nw.createElement("script");
      td_g2.type = "text/javascript";
      td_g2.text = "var " + td_pg + " = \\\"" + encodeURIComponent(document.referrer.substring(0, 255)) + "\\\";";
      td_0P.td_4w(td_g2);
      td_Nw.body.appendChild(td_g2);
    }
    if (typeof td_2g !== "undefined") {
      td_2g();
    }
    if (typeof td_1L !== "undefined") {
      td_1L();
    }
  };
  window.window.tmx_profiling_started = false;
  if (typeof td_0P.td_1E === "undefined") {
    td_0P.td_1E = [];
  }
  td_0P.td_1E.push(function() {
    if (typeof td_3r !== "undefined") {
      td_3r.td_3x();
    }
  });
  td_0P.td_0b = null;
  td_0P.td_4I = null;
  td_0P.td_1n = null;
  td_0P.td_3H = null;
  td_0P.td_4V = null;
  td_0P.td_3M = null;
  td_0P.td_0M = true;
  td_0P.td_5c = null;
  td_0P.td_3S = false;
  td_0P.injected = false;
  td_0P.td_0R = false;
  td_0P.td_0j = "";
  td_0P.td_3B = null;
  td_0P.td_2V = function() {
    if (td_0P.injected) {
      return;
    }
    td_0P.injected = true;
    if (typeof tmx_tags_iframe_marker !== "undefined") {
      var td_Mf = document.createElement("script");
      td_0P.td_3c(td_Mf, td_0P.td_0b + "&fcjs=1");
      td_0P.td_4w(td_Mf);
      document.body.appendChild(td_Mf);
      return;
    }
    var td_qW,
      td_vo,
      td_Ek,
      td_NH = document.createElement("iframe");
    td_0P.td_3c(td_NH, "about:blank");
    td_0P.td_4w(td_NH);
    td_NH.id = "tmx_tags_iframe";
    td_NH.title = "empty";
    if (typeof td_NH.tabIndex !== "undefined") {
      td_NH.tabIndex = "-1";
    }
    td_NH.setAttribute("aria-disabled", "true");
    td_NH.setAttribute("aria-hidden", "true");
    td_NH.setAttribute("data-time", td_n());
    (td_NH.frameElement || td_NH).style.cssText = "width: 0px; height: 0px; border: 0; position: absolute; top: -5000px;";
    if (td_0P.td_5c !== null) {
      td_NH.setAttribute("sandbox", td_0P.td_5c);
    }
    td_Ek = document.getElementById("thm_iframe_loc");
    if (!td_Ek) {
      document.body.appendChild(td_NH);
    } else {
      td_Ek.parentNode.insertBefore(td_NH, td_Ek);
    }
    try {
      td_vo = td_NH.contentWindow.document;
    } catch (td_Gc) {
      td_qW = document.domain;
      td_0P.td_3c(td_NH, "javascript:var d=document.open();d.domain=\\'" + td_qW + "\\';void(0);");
      try {
        td_vo = td_NH.contentWindow.document;
      } catch (td_Gc) {
        td_0P.td_3c(td_NH, td_0P.td_4I);
        return;
      }
    }
    td_0P.td_1F(td_vo)._l = function() {
      if (typeof this.readyState === "undefined" || typeof this.readyState === "unknown") {
        this.readyState = "complete";
      }
      if (td_qW) {
        this.domain = td_qW;
      }
      if (typeof td_0P.td_2G === "function") {
        td_0P.td_2G(this);
      }
      if (typeof td_0P.add_lang_attr_html_tag === "function") {
        td_0P.add_lang_attr_html_tag(this);
      }
      var td_HB = this.createElement("script");
      var td_WO = td_0P.td_0b;
      var td_ZR = "";
      if (typeof td_3r !== "undefined") {
        var td_yD = "";
        if (td_3r.td_1x !== "unknown") {
          td_yD += "&jsou=" + encodeURIComponent(td_3r.td_1x);
        }
        if (td_3r.td_0q !== "unknown") {
          td_yD += "&jso=" + encodeURIComponent(td_3r.td_0q);
        }
        if (td_3r.td_4Q !== "unknown") {
          td_yD += "&jsbu=" + encodeURIComponent(td_3r.td_4Q);
        }
        if (td_3r.td_3J === true) {
          td_yD += "&jsmu=true";
        }
        if (td_3r.td_4E !== "unknown" && td_3r.td_1p !== "unknown") {
          td_yD += "&jsb=" + encodeURIComponent(td_3r.td_1p + " " + td_3r.td_4E);
        }
        if (td_yD.length !== 0) {
          td_ZR = "&jb=" + td_0P.td_3K(td_yD, td_0P.td_3B);
          td_WO += td_ZR;
        }
      }
      td_0P.td_3c(td_HB, td_WO);
      td_0P.td_4w(td_HB);
      this.body.appendChild(td_HB);
      var td_X6 = this.createElement("script");
      td_X6.type = "text/javascript";
      td_X6.text = "var tmx_tags_iframe_marker=true;";
      td_0P.td_4w(td_X6);
      this.body.appendChild(td_X6);
    };
    if (td_NH.addEventListener) {
      td_NH.addEventListener("load", function() {
        if (typeof td_vo._l !== "undefined") {
          td_vo._l();
        }
      }, false);
    } else {
      if (td_NH.attachEvent) {
        td_NH.attachEvent("onload", function() {
          if (typeof td_vo._l !== "undefined") {
            td_vo._l();
          }
        });
      } else {
        td_vo.write("<html lang=\\\"en\\\"><body onload=\\\"document._l();\\\"></body></html>");
      }
    }
    td_vo.close();
  };
  td_0P.td_3Z = function() {
    if (!td_0P.td_3S && window.window.tmx_profiling_started) {
      return;
    }
    window.window.tmx_profiling_started = true;
    td_0P.injected = false;
    td_0P.td_3L();
    td_0P.td_5q(document);
    td_p();
    var td_PJ = ("WebkitAppearance" in document.documentElement.style);
    var td_O0 = "1";
    if (document.body && (document.readyState === "complete" || !td_PJ) || typeof td_0P.td_0x !== "undefined" && td_0P.td_0x !== null && td_0P.td_0x === td_O0) {
      td_0P.td_2V();
      return;
    }
    var td_ju;
    if (typeof window !== "undefined" && typeof window !== "unknown" && window !== null) {
      td_ju = window;
    } else {
      td_ju = document.body;
    }
    if (td_ju.addEventListener) {
      td_ju.addEventListener("load", function() {
        td_0P.td_2V();
      }, false);
    } else {
      if (td_ju.attachEvent) {
        td_ju.attachEvent("onload", function() {
          td_0P.td_2V();
        });
      } else {
        var td_dr = td_ju.onload;
        td_ju.onload = new function() {
          var td_JZ = true;
          if (td_dr !== null && typeof td_dr === "function") {
            td_JZ = td_dr();
          }
          var td_Pt = 200;
          setTimeout(function() {
            td_0P.td_2V();
          }, td_Pt);
          td_ju.onload = td_dr;
          return td_JZ;
        }();
      }
    }
  };
  td_0P.td_2C = function(td_kO) {
    var td_sp = window.frames["tmx_tags_iframe"];
    if (td_sp === null || typeof td_sp === "undefined") {
      td_sp = document.getElementById("tmx_tags_iframe");
      if (td_sp === null || typeof td_sp === "undefined") {
        if (typeof td_kO !== "undefined") {
          td_kO("UNDEFINED");
        }
        return null;
      }
    }
    var td_tC = td_sp.contentWindow || td_sp.window;
    if (td_tC === null || typeof td_tC === "undefined") {
      if (typeof td_kO !== "undefined") {
        td_kO("UNDEFINED");
      }
      return null;
    }
    return td_tC;
  };
  td_0P.td_1E.push(function() {
    td_0P.td_3S = true;
    td_0P.td_4V = "https://drfdisvc.walmart.com/fO7FdFw1yeUi3bv8?adc484a6da33f0b0=tvExpprHFyREz60jfEdZz-sNOyVMY0NpK4pjTY1ry3ZIrA_1-I6Si1ntPjUIEtTo0mljg2oRtayN96-V27zKELfgWtELabu4Z3o_5K8xlEQtOnK4OLo3_-YJSRaO6StIqsrnzdDzbxEtu9rCCGESpQBf-c2kFQ8EkmKnlI8";
    td_0P.td_4I = "https://drfdisvc.walmart.com/VhxYmlBG2IQ1reG_?8ee18e8904741a7e=UV29if8yOm1eVBvLc_UpVKFh0WBuWDdrKWXRM2dwyBrTZxsZeLA9TjsMArU5DQFfXbC1uknEsNLMvxd2O5CSFSb-9KxkveTdFC1ssy2W7VfOvOShYF2yQ5D6Fl4JX2HGv3eiFfdmnQ9Uv1mLdeLULEw8goA";
    td_0P.td_0x = "0";
    td_0P.td_3M = "https://drfdisvc.walmart.com/GTOg3OPEk2SEGPiY?965c03bc8cf56c17=hKwobfG2yPaYqoZS4DvyTrIi1zPc3TSOcwKPxTxNArMi4aGRzCNEUfzzPMZruM4601FJn9soOF6FmyT_8BylBy9lRwtxu7rr_JcIhxjQlDNo-EOpV-XVu4OsZtL3FiZFxY1hoxyz4EIojuxaacQtUPW92OsGC7t00eJ8FR4";
    td_0P.td_0b = "https://drfdisvc.walmart.com/WJEhJFGDpa43fdJd?4f34ff334fada598=1V9pK5k3o7jn6CyYJxW7ChtnN_NgYZXlGHA0wwCL1sM655Xv2tp12nyh8BRa8hStCsI_UzkNLk_aMSw--uXzi-7HNcLsrG0UgpklGUJ_WIxZJZZKVc7EDSbI0HZwRcXYLfHckR_-l6Lajodxh5cm62IJGbTKP8QSdPEu-sXLN5Lnj5AenYfxctnkNrpaYis4tvtE68i4KkHzV6p9";
    td_0P.td_3B = "gtfwkiienlxe_dexqu9xlcrmwgbkkgtqy4ah";
    td_0P.td_5r = "https://drfdisvc.walmart.com/wIQ3UAmXnPFfSiCq?4f78921ace63a262=RPqcnBDCWuEx9nE_qDUv1172iPl4PVxKydQf2ZdGW4IiBKDSl38DJtEB-OOnp0scJgfClGeVRpmKA1CtbjLTOXtYki-KiobkLhYtqt4t4ql4kGiulybyJ1q8pWW59b56tCYOrm0LkthBOZJwg_0HprCj15g";
  });
  var td_a = 0;
  var td_m = 1;
  var td_h = 2;
  var td_C = 3;
  var td_l = 4;
  td_0P.td_5v = td_a;
  var td_3r = {
    td_3x: function() {
      if (typeof navigator !== "undefined") {
        this.td_j(navigator.userAgent, navigator.vendor, navigator.platform, navigator.appVersion, window.opera);
      }
    },
    td_j: function(td_V, td_J, td_N, td_R, td_x) {
      this.td_Y = [{
        string: td_V,
        subString: " OPR/",
        versionSearch: " OPR",
        identity: "Opera"
      }, {
        string: td_V,
        subString: "Opera Mini",
        versionSearch: "Opera Mini",
        identity: "Opera Mini"
      }, {
        string: td_V,
        subString: "Edge/",
        versionSearch: "Edge",
        identity: "Edge"
      }, {
        string: td_V,
        subString: "Edg/",
        versionSearch: "Edg",
        identity: "Edge"
      }, {
        string: td_V,
        subString: "EdgA/",
        versionSearch: "EdgA",
        identity: "Edge"
      }, {
        string: td_V,
        subString: "EdgiOS/",
        versionSearch: "EdgiOS",
        identity: "Edge"
      }, {
        string: td_V,
        subString: "YaBrowser",
        versionSearch: "YaBrowser",
        identity: "Yandex"
      }, {
        string: td_V,
        subString: "SamsungBrowser",
        identity: "SamsungBrowser"
      }, {
        string: td_V,
        subString: "UCBrowser",
        identity: "UCBrowser"
      }, {
        string: td_V,
        subString: "Puffin",
        identity: "Puffin"
      }, {
        string: td_V,
        subString: "Chrome",
        identity: "Chrome"
      }, {
        string: td_V,
        subString: "OmniWeb",
        versionSearch: "OmniWeb/",
        identity: "OmniWeb"
      }, {
        string: td_V,
        subString: "FxiOS",
        identity: "Firefox",
        versionSearch: "FxiOS"
      }, {
        string: td_V,
        subString: "CriOS",
        identity: "Chrome",
        versionSearch: "CriOS"
      }, {
        string: td_V,
        subString: "XiaoMi/MiuiBrowser",
        identity: "XiaoMi/MiuiBrowser",
        versionSearch: "XiaoMi/MiuiBrowser"
      }, {
        string: td_J,
        subString: "Apple",
        identity: "Safari",
        versionSearch: "Version"
      }, {
        prop: td_x,
        identity: "Opera",
        versionSearch: "Version"
      }, {
        string: td_J,
        subString: "iCab",
        identity: "iCab"
      }, {
        string: td_J,
        subString: "KDE",
        identity: "Konqueror"
      }, {
        string: td_V,
        subString: "Firefox",
        identity: "Firefox"
      }, {
        string: td_J,
        subString: "Camino",
        identity: "Camino"
      }, {
        string: td_V,
        subString: "Netscape",
        identity: "Netscape"
      }, {
        string: td_V,
        subString: "MSIE",
        identity: "Explorer",
        versionSearch: "MSIE"
      }, {
        string: td_V,
        subString: "IEMobile",
        identity: "IEMobile",
        versionSearch: "IEMobile"
      }, {
        string: td_V,
        subString: "Trident",
        identity: "Explorer",
        versionSearch: "rv"
      }, {
        string: td_V,
        subString: "Gecko",
        identity: "Mozilla",
        versionSearch: "rv"
      }, {
        string: td_V,
        subString: "Mozilla",
        identity: "Netscape",
        versionSearch: "Mozilla"
      }];
      this.td_u = [{
        string: td_N,
        subString: "Win",
        identity: "Windows"
      }, {
        string: td_N,
        subString: "Mac",
        identity: "Mac"
      }, {
        string: td_V,
        subString: "Windows Phone",
        identity: "Windows Phone"
      }, {
        string: td_V,
        subString: "Android",
        identity: "Android"
      }, {
        string: td_V,
        subString: "OpenBSD",
        identity: "OpenBSD"
      }, {
        string: td_V,
        subString: "SunOS",
        identity: "SunOS"
      }, {
        string: td_N,
        subString: "Linux arm",
        identity: "Android"
      }, {
        string: td_N,
        subString: "Linux",
        identity: "Linux"
      }, {
        string: td_N,
        subString: "BlackBerry",
        identity: "BlackBerry"
      }, {
        string: td_N,
        subString: "iPhone",
        identity: "iPhone/iPod"
      }, {
        string: td_N,
        subString: "iPad",
        identity: "iPad"
      }];
      this.td_g = [{
        string: td_N,
        subString: "Win",
        identity: "Windows"
      }, {
        string: td_N,
        subString: "Mac",
        identity: "Mac"
      }, {
        string: td_N,
        subString: "Linux arm",
        identity: "Android"
      }, {
        string: td_N,
        subString: "Linux aarch",
        identity: "Android"
      }, {
        string: td_N,
        subString: "Linux",
        identity: "Linux"
      }, {
        string: td_N,
        subString: "BlackBerry",
        identity: "BlackBerry"
      }, {
        string: td_N,
        subString: "iPhone",
        identity: "iPhone"
      }, {
        string: td_N,
        subString: "iPad",
        identity: "iPad"
      }];
      this.td_o = [{
        identity: "Windows",
        versionMap: [{
          s: "Windows 10",
          r: /(Windows 10.0|Windows NT 10.0)/
        }, {
          s: "Windows 8.1",
          r: /(Windows 8.1|Windows NT 6.3)/
        }, {
          s: "Windows 8",
          r: /(Windows 8|Windows NT 6.2)/
        }, {
          s: "Windows 7",
          r: /(Windows 7|Windows NT 6.1)/
        }, {
          s: "Windows Vista",
          r: /Windows NT 6.0/
        }, {
          s: "Windows Server 2003",
          r: /Windows NT 5.2/
        }, {
          s: "Windows XP",
          r: /(Windows NT 5.1|Windows XP)/
        }, {
          s: "Windows 2000",
          r: /(Windows NT 5.0|Windows 2000)/
        }, {
          s: "Windows ME",
          r: /(Win 9x 4.90|Windows ME)/
        }, {
          s: "Windows 98",
          r: /(Windows 98|Win98)/
        }, {
          s: "Windows 95",
          r: /(Windows 95|Win95|Windows_95)/
        }, {
          s: "Windows NT 4.0",
          r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
        }, {
          s: "Windows CE",
          r: /Windows CE/
        }, {
          s: "Windows 3.11",
          r: /Win16/
        }]
      }, {
        identity: "Mac",
        versionMap: [{
          s: "Mac OS X",
          r: /Mac OS X/
        }, {
          s: "Mac OS",
          r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
        }]
      }, {
        identity: "Windows Phone",
        versionMap: [{
          s: "Windows Phone 6.0",
          r: /Windows Phone 6.0/
        }, {
          s: "Windows Phone 7.0",
          r: /Windows Phone 7.0/
        }, {
          s: "Windows Phone 8.0",
          r: /Windows Phone 8.0/
        }, {
          s: "Windows Phone 8.1",
          r: /Windows Phone 8.1/
        }, {
          s: "Windows Phone 10.0",
          r: /Windows Phone 10.0/
        }]
      }];
      this.td_3J = typeof window.orientation !== "undefined";
      this.td_1x = this.td_y(this.td_g) || "unknown";
      this.td_4Q = this.td_O(this.td_3J, this.td_1x) || "unknown";
      this.td_1p = this.td_y(this.td_Y) || "unknown";
      this.td_4E = this.td_Z(this.td_1p, td_V) || this.td_Z(this.td_1p, td_R) || "unknown";
      this.td_4e = this.td_y(this.td_u) || "unknown";
      this.td_0q = this.td_w(this.td_o, this.td_4e, td_V, td_R) || this.td_4e;
      this.td_L();
    },
    td_w: function(td_k, td_U, td_i, td_K) {
      var td_P = td_i;
      var td_q = td_K;
      var td_N = td_U;
      var td_B;
      for (var td_G = 0; td_G < td_k.length; td_G++) {
        if (td_k[td_G].identity === td_U) {
          for (var td_r = 0; td_r < td_k[td_G].versionMap.length; td_r++) {
            var td_e = td_k[td_G].versionMap[td_r];
            if (td_e.r.test(td_P)) {
              td_N = td_e.s;
              if (/Windows/.test(td_N)) {
                if (td_N === "Windows 10") {
                  if (td_3r.td_d()) {
                    td_N = "Windows 11";
                  }
                  td_0P.td_5v = td_m;
                  td_3r.td_D();
                }
                return td_N;
              }
              break;
            }
          }
          break;
        }
      }
      switch (td_N) {
        case "Mac OS X":
          td_N = null;
          var td_H = /(Mac OS X 10[\.\_\d]+)/.exec(td_P);
          if (td_H !== null && td_H.length >= 1) {
            td_N = td_H[1];
          }
          if (typeof navigator.platform !== "undefined" && navigator.platform !== null && navigator.platform === "MacIntel" && typeof navigator.maxTouchPoints !== "undefined" && navigator.maxTouchPoints !== null && navigator.maxTouchPoints === 5) {
            if (typeof "".split !== "undefined" && "".split !== null) {
              var td_p = td_N.split(" ");
              if (td_p.length === 4) {
                var td_x = /(Version\/[\.\d]+)/.exec(td_P);
                if (td_x !== null && td_x.length > 1) {
                  var td_f = td_x[1];
                  if (td_f !== null && td_f.length > 1) {
                    var td_s = td_f.split("/");
                    if (td_s !== null && td_s.length > 1) {
                      td_N = "iPad X " + td_s[1];
                    }
                  }
                }
              }
            }
          }
          break;
        case "Android":
          td_N = null;
          var td_I = /[^-](Android[^\d]?[\.\_\d]+)/.exec(td_P);
          if (td_I !== null && td_I.length >= 1) {
            td_N = td_I[1];
          }
          break;
        case "iPad":
        case "iPhone":
        case "iPhone/iPod":
          td_N = null;
          td_B = /OS (\d+)_(\d+)_?(\d+)?/.exec(td_q);
          if (td_B !== null) {
            var td_E = td_B.length >= 1 ? td_B[1] : "unknown";
            var td_v = td_B.length >= 2 ? td_B[2] : "unknown";
            var td_R = td_B.length >= 3 ? td_B[3] | "0" : "0";
            td_N = "iOS " + td_E + "." + td_v + "." + td_R;
          }
          break;
        default:
          return null;
      }
      return td_N;
    },
    td_y: function(td_B) {
      for (var td_q = 0; td_q < td_B.length; ++td_q) {
        var td_T = td_B[td_q].string;
        var td_W = td_B[td_q].prop;
        this.versionSearchString = td_B[td_q].versionSearch || td_B[td_q].identity;
        if (td_T) {
          if (td_T.indexOf(td_B[td_q].subString) !== -1) {
            return td_B[td_q].identity;
          }
        } else {
          if (td_W) {
            return td_B[td_q].identity;
          }
        }
      }
    },
    td_Z: function(td_t, td_V) {
      if (!td_t) {
        return null;
      }
      var td_n;
      switch (td_t) {
        case "Safari":
          var td_F = /\WVersion[^\d]([\.\d]+)/.exec(td_V);
          if (td_F !== null && td_F.length >= 1) {
            td_n = td_F[1];
          }
          break;
        case "Opera":
          if (this.versionSearchString === "OPR") {
            var td_J = /\WOPR[^\d]*([\.\d]+)/.exec(td_V);
            if (td_J !== null && td_J.length >= 1) {
              td_n = td_J[1];
            }
            break;
          }
        default:
          var td_r = td_V.indexOf(this.versionSearchString);
          if (td_r !== -1) {
            td_n = td_V.substring(td_r + this.versionSearchString.length + 1);
          }
          break;
      }
      if (td_n) {
        return parseFloat(td_n);
      }
      return null;
    },
    td_S: function(td_R) {
      var td_E = null;
      try {
        td_E = new Worker(td_R);
      } catch (td_A) {
        if (td_E !== null && typeof td_E.terminate !== "undefined") {
          td_E.terminate();
        }
        return td_A.toString().indexOf("is not a valid URL") !== -1;
      }
      return false;
    },
    td_O: function(isMobile, osNoUA) {
      var psc = this.td_S;
      try {
        var check = typeof window.opr !== "undefined" && typeof td_b.addons !== "undefined" || typeof window.opera !== "undefined";
        if (check) {
          return "Opera";
        }
        check = typeof InstallTrigger !== "undefined";
        if (check) {
          return "Firefox";
        }
        check = /constructor/i.test(window.HTMLElement) || function(p) {
          return p.toString() === "[object SafariRemoteNotification]";
        }(!window["safari"] || typeof safari !== "undefined" && safari.pushNotification);
        if (check) {
          return "Safari";
        }
        check = typeof window.safari !== "undefined";
        if (check) {
          return "Safari";
        }
        check = false || typeof document.documentMode !== "undefined";
        if (check) {
          return "Explorer";
        }
        if (!check && typeof window.StyleMedia !== "undefined") {
          return "Edge";
        }
        if (psc("brave://")) {
          return "Brave";
        }
        if (psc("edge://")) {
          return "Edge";
        }
        if (psc("puffin://")) {
          return "Puffin";
        }
        check = typeof window.chrome !== "undefined" && typeof window.yandex == "undefined" && (typeof window.chrome.webstore !== "undefined" || typeof window.chrome.runtime !== "undefined" || typeof window.chrome.loadTimes !== "undefined");
        if (check) {
          return "Chrome";
        }
        if (isMobile) {
          check = typeof window.chrome !== "undefined" && typeof window.chrome.Benchmarking !== "undefined";
          if (check) {
            return "SamsungBrowser";
          }
          check = typeof window.ucapi !== "undefined";
          if (check) {
            return "UCBrowser";
          }
        }
        if (osNoUA === "iPhone" || osNoUA === "iPad") {
          if (typeof navigator.serviceWorker !== "undefined") {
            return "Safari";
          }
          if (typeof window.$jscomp !== "undefined") {
            return "Chrome";
          }
        }
        check = typeof window.chrome !== "undefined" && typeof window.yandex !== "undefined";
        if (check) {
          return "Yandex";
        }
      } catch (err) {}
      return null;
    },
    td_L: function() {
      var td_K = this.td_1p;
      if (td_K === "Chrome" && this.td_4Q === "Brave") {
        td_K = "Brave";
      }
      this.td_1p = td_K;
      if (this.td_3J !== true || this.td_1x !== "Mac") {
        return;
      }
      this.td_1x = "iPhone/iPad";
      this.td_4e = this.td_1x;
      var td_f = typeof this.td_0q === "string" && this.td_0q !== null && this.td_0q.indexOf("iPad X") !== -1;
      if (td_f) {
        return;
      }
      this.td_0q = this.td_4e;
    },
    td_c: function(td_E) {
      return typeof td_E !== "undefined" && td_E !== null;
    },
    td_M: function(td_R) {
      this.td_0q = td_R;
    },
    td_D: function() {
      if (this.td_1p === "Firefox" || this.td_1p === "Safari") {
        td_0P.td_5v = td_l;
        return;
      }
      if (td_0P.td_5v > td_m) {
        return;
      }
      td_0P.td_5v = td_h;
      if (td_3r.td_c(navigator.userAgentData) && td_3r.td_c(navigator.userAgentData.getHighEntropyValues)) {
        var td_q = navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
        if (td_3r.td_c(td_q) && td_3r.td_c(td_q.then)) {
          td_q.then(function(td_B) {
            function td_G(td_I) {
              return typeof td_I !== "undefined" && td_I !== null;
            }
            if (td_G(navigator.userAgentData.platform) && navigator.userAgentData.platform === "Windows") {
              if (td_G(td_B) && td_G(td_B.platformVersion) && td_G(td_B.platformVersion.split)) {
                var td_H = parseInt(td_B.platformVersion.split(".")[0]);
                if (td_H >= 13) {
                  td_3r.td_M("Windows 11");
                  td_0P.td_5v = td_C;
                } else {
                  if (td_H > 0) {
                    td_3r.td_M("Windows 10");
                  }
                  td_0P.td_5v = td_l;
                }
              }
            }
          });
        }
      }
    },
    td_d: function() {
      if (this.td_1p === "Firefox" || this.td_1p === "Safari") {
        return false;
      }
      try {
        if (td_3r.td_c(document.fonts) && td_3r.td_c(document.fonts.check)) {
          return document.fonts.check("18px Segoe Fluent Icons");
        }
      } catch (td_V) {}
      return false;
    },
    td_Y: {},
    td_u: {},
    td_g: {},
    td_o: {}
  };

  function tmx_run_page_fingerprinting(td_Ik) {
    if (typeof td_Ik !== "undefined") {
      td_Ik("DISABLED");
    }
  }
  window.tmx_run_page_fingerprinting = tmx_run_page_fingerprinting;

  function td_z(td_P, td_q, td_K) {
    if (typeof td_K === "undefined" || td_K === null) {
      td_K = 0;
    } else {
      if (td_K < 0) {
        td_K = Math.max(0, td_P.length + td_K);
      }
    }
    for (var td_Q = td_K, td_F = td_P.length; td_Q < td_F; td_Q++) {
      if (td_P[td_Q] === td_q) {
        return td_Q;
      }
    }
    return -1;
  }

  function td_t(td_q, td_F, td_A) {
    return td_q.indexOf(td_F, td_A);
  }

  function td_H(td_f) {
    if (typeof td_f !== "string" || td_f === null || typeof td_f.replace === "undefined" || td_f.replace === null) {
      return null;
    }
    return td_f.replace(/^\s+|\s+$/g, "");
  }

  function td_I(td_F) {
    if (typeof td_F !== "string" || td_F === null || typeof td_F.trim === "undefined" || td_F.trim === null) {
      return null;
    }
    return td_F.trim();
  }

  function td_4t(td_N) {
    if (typeof td_N !== "string" || td_N === null || typeof td_N.trim === "undefined" || td_N.trim === null) {
      return null;
    }
    return td_N.trim();
  }

  function td_0z(td_N, td_A, td_E) {
    return td_N.indexOf(td_A, td_E);
  }

  function td_n() {
    return Date.now();
  }

  function td_x() {
    return new Date().getTime();
  }

  function td_v() {
    return performance.now();
  }

  function td_r() {
    return window.performance.now();
  }

  function td_5P(td_N) {
    return parseFloat(td_N);
  }

  function td_4y(td_K) {
    return parseInt(td_K);
  }

  function td_0f(td_T) {
    return isNaN(td_T);
  }

  function td_3F(td_Q) {
    return isFinite(td_Q);
  }

  function td_e() {
    if (typeof Number.parseFloat !== "undefined" && typeof Number.parseInt !== "undefined") {
      td_5P = Number.parseFloat;
      td_4y = Number.parseInt;
    } else {
      if (typeof parseFloat !== "undefined" && typeof parseInt !== "undefined") {
        td_5P = parseFloat;
        td_4y = parseInt;
      } else {
        td_5P = null;
        td_4y = null;
      }
    }
    if (typeof Number.isNaN !== "undefined") {
      td_0f = Number.isNaN;
    } else {
      if (typeof isNaN !== "undefined") {
        td_0f = isNaN;
      } else {
        td_0f = null;
      }
    }
    if (typeof Number.isFinite !== "undefined") {
      td_3F = Number.isFinite;
    } else {
      if (typeof isFinite !== "undefined") {
        td_3F = isFinite;
      } else {
        td_3F = null;
      }
    }
  }

  function td_p() {
    if (!Array.prototype.indexOf) {
      td_0z = td_z;
    } else {
      td_0z = td_t;
    }
    if (typeof String.prototype.trim !== "function") {
      td_4t = td_H;
    } else {
      td_4t = td_I;
    }
    if (typeof Date.now === "undefined") {
      td_n = td_x;
    }
    var td_E = false;
    if (typeof performance === "undefined" || typeof performance.now === "undefined") {
      if (typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") {
        td_v = td_r;
      } else {
        td_v = td_n;
        td_E = true;
      }
    }
    if (!td_E) {
      var td_J = td_v();
      var td_P = td_J.toFixed();
      if (td_J === td_P) {
        td_v = td_n;
      }
    }
    if (typeof Array.isArray === "undefined") {
      Array.isArray = function(td_G) {
        return Object.prototype.toString.call(td_G) === "[object Array]";
      };
    }
    td_e();
  }

  function td_2t(td_W) {
    if (typeof document.readyState !== "undefined" && document.readyState !== null && typeof document.readyState !== "unknown" && document.readyState === "complete") {
      td_W();
    } else {
      if (typeof document.readyState === "undefined") {
        setTimeout(td_W, 300);
      } else {
        var td_A = 200;
        var td_q;
        if (typeof window !== "undefined" && typeof window !== "unknown" && window !== null) {
          td_q = window;
        } else {
          td_q = document.body;
        }
        if (td_q.addEventListener) {
          td_q.addEventListener("load", function() {
            setTimeout(td_W, td_A);
          }, false);
        } else {
          if (td_q.attachEvent) {
            td_q.attachEvent("onload", function() {
              setTimeout(td_W, td_A);
            }, false);
          } else {
            var td_R = td_q.onload;
            td_q.onload = new function() {
              var td_G = true;
              if (td_R !== null && typeof td_R === "function") {
                td_G = td_R();
              }
              setTimeout(td_W, td_A);
              td_q.onload = td_R;
              return td_G;
            }();
          }
        }
      }
    }
  }

  function td_i() {
    if (typeof td_2Z !== "undefined") {
      td_2Z();
    }
    if (typeof td_1j !== "undefined") {
      td_1j();
    }
    if (typeof td_0L !== "undefined") {
      td_0L();
    }
    if (typeof td_1C !== "undefined") {
      if (typeof td_5j !== "undefined" && td_5j !== null) {
        td_1C(td_5j, false);
      }
      if (typeof td_4F !== "undefined" && td_4F !== null) {
        td_1C(td_4F, true);
      }
    }
    if (typeof tmx_link_scan !== "undefined") {
      tmx_link_scan();
    }
    if (typeof td_5M !== "undefined") {
      td_5M();
    }
    if (typeof td_3Q !== "undefined") {
      td_3Q.start();
    }
    if (typeof td_2M !== "undefined") {
      td_2M.start();
    }
  }

  function td_5Y() {
    try {
      td_0P.td_3L();
      td_0P.td_5q(document);
      td_3r.td_3x();
      td_p();
      var td_E = "1";
      if (typeof td_0P.td_0x !== "undefined" && td_0P.td_0x !== null && td_0P.td_0x === td_E) {
        td_i();
      } else {
        td_2t(td_i);
      }
    } catch (td_N) {}
  }
  td_0P.td_0B = function() {
    return typeof navigator.vendor !== "undefined" && navigator.vendor.indexOf("Apple") !== -1;
  };
  td_0P.td_3c = function(td_ux, td_yb) {
    td_ux["src"] = td_yb;
  };
  td_0P.td_1F = function(td_UC) {
    return typeof td_UC["open"].call !== "undefined" ? td_UC["open"].call(td_UC) : td_UC.open();
  };
  td_0P.td_5B = function(td_Hq, td_iX) {
    td_Hq["style"]["background"] = td_iX;
  };

  function tmx_post_session_params_fixed(td_L5, td_Ws) {
    if (typeof td_Ws !== "undefined") {
      td_Ws("DISABLED");
    }
  }
  window.tmx_post_session_params_fixed = tmx_post_session_params_fixed;
  if (typeof td_0P.td_1E === "undefined") {
    td_0P.td_1E = [];
  }
  td_0P.td_3L = function() {
    for (var td_K = 0; td_K < td_0P.td_1E.length; ++td_K) {
      td_0P.td_1E[td_K]();
    }
  };
  td_0P.td_3K = function(td_X, td_q) {
    try {
      var td_A = td_X.length + "&" + td_X;
      var td_Q = "";
      var td_K = "0123456789abcdef";
      for (var td_N = 0, td_G = 0; td_N < td_A.length; td_N++) {
        var td_E = td_A.charCodeAt(td_N) ^ td_q.charCodeAt(td_G) & 10;
        if (++td_G === td_q.length) {
          td_G = 0;
        }
        td_Q += td_K.charAt(td_E >> 4 & 15);
        td_Q += td_K.charAt(td_E & 15);
      }
      return td_Q;
    } catch (td_B) {
      return null;
    }
  };
  td_0P.td_4H = function() {
    try {
      var td_W = window.top.document;
      var td_J = td_W.forms.length;
      return td_W;
    } catch (td_f) {
      return document;
    }
  };
  td_0P.td_1a = function(td_T) {
    try {
      var td_R;
      if (typeof td_T === "undefined") {
        td_R = window;
      } else {
        if (td_T === "t") {
          td_R = window.top;
        } else {
          if (td_T === "p") {
            td_R = window.parent;
          } else {
            td_R = window;
          }
        }
      }
      var td_f = td_R.document.forms.length;
      return td_R;
    } catch (td_s) {
      return window;
    }
  };
  td_0P.add_lang_attr_html_tag = function(td_F) {
    try {
      if (td_F === null) {
        return;
      }
      var td_f = td_F.getElementsByTagName("html");
      if (typeof td_f !== "undefined" && td_f !== null && typeof td_f.length !== "undefined" && td_f.length !== null && td_f.length > 0 && typeof td_f[0] !== "undefined" && typeof td_f[0] !== null && typeof td_f[0].setAttribute !== "undefined" && td_f[0].setAttribute !== null && typeof td_f[0].getAttribute !== "undefined" && td_f[0].getAttribute !== null && (td_f[0].getAttribute("lang") === null || td_f[0].getAttribute("lang") === "")) {
        td_f[0].setAttribute("lang", "en");
      } else {}
    } catch (td_q) {}
  };
  td_0P.load_iframe = function(td_W, td_E) {
    var td_G = td_1O(5);
    if (typeof td_5x !== "undefined") {
      td_5x(td_G, "IFRAME");
    }
    var td_F = td_E.createElement("iframe");
    td_F.id = td_G;
    td_F.title = "empty";
    td_F.setAttribute("aria-disabled", "true");
    td_F.setAttribute("aria-hidden", "true");
    td_F.width = "0";
    td_F.height = "0";
    if (typeof td_F.tabIndex !== "undefined") {
      td_F.tabIndex = "-1";
    }
    if (typeof td_4j !== "undefined" && td_4j !== null) {
      td_F.setAttribute("sandbox", td_4j);
    }
    td_F.style = "color:rgba(0,0,0,0); float:left; position:absolute; top:-200; left:-200; border:0px";
    td_F.setAttribute("src", td_W);
    td_E.body.appendChild(td_F);
  };
  td_0P.csp_nonce = null;
  td_0P.td_5q = function(td_W) {
    if (typeof td_W.currentScript !== "undefined" && td_W.currentScript !== null) {
      var td_B = td_W.currentScript.getAttribute("nonce");
      if (typeof td_B !== "undefined" && td_B !== null && td_B !== "") {
        td_0P.csp_nonce = td_B;
      } else {
        if (typeof td_W.currentScript.nonce !== "undefined" && td_W.currentScript.nonce !== null && td_W.currentScript.nonce !== "") {
          td_0P.csp_nonce = td_W.currentScript.nonce;
        }
      }
    }
  };
  td_0P.td_4w = function(td_k) {
    if (td_0P.csp_nonce !== null) {
      td_k.setAttribute("nonce", td_0P.csp_nonce);
      if (td_k.getAttribute("nonce") !== td_0P.csp_nonce) {
        td_k.nonce = td_0P.csp_nonce;
      }
    }
  };
  td_0P.td_3I = function() {
    try {
      return new ActiveXObject(activeXMode);
    } catch (td_k) {
      return null;
    }
  };
  td_0P.td_1u = function() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
      var td_f = ["MSXML2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
      for (var td_X = 0; td_X < td_f.length; td_X++) {
        var td_J = td_0P.td_3I(td_f[td_X]);
        if (td_J !== null) {
          return td_J;
        }
      }
    }
    return null;
  };
  td_0P.td_3Z();
})();