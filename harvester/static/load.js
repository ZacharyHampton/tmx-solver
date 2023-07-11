var tm = tm || {};
(tm.version = 3),
(tm.create_url = function (t, e, r, n, a) {
  function i() {
    return Math.floor(2742745743359 * Math.random());
  }
  function c() {
    return o(i());
  }
  function o(t) {
    return (t + 78364164096).toString(36);
  }
  var m = i(),
    u = i(),
    l = 885187064159;
  (u = ((u = u - (u % 256) + tm.version) + m) % 2742745743359),
    (l = (l + m) % 2742745743359);
  var s = 'https://' + t + '/' + (m = c() + o(m)) + e,
    h = [(u = o(l) + o(u)) + '=' + r, c() + c() + '=' + n];
  return (
    void 0 !== a && a.length > 0 && h.push(c() + c() + '=' + a),
    s + '?' + h.join('&')
  );
}),
(tm.beacon = function (t, e, r, n) {
  var a = 'turn:aa.online-metrix.net?transport=',
    i = '1:' + e + ':' + r,
    c = {
      iceServers: [
        { urls: a + 'tcp', username: i, credential: r },
        { urls: a + 'udp', username: i, credential: r },
      ],
    };
  try {
    var o = new RTCPeerConnection(c);
    o.createDataChannel(Math.random().toString());
    var m = function () {},
      u = function (t) {
        o.setLocalDescription(t, m, m);
      };
    'undefined' == typeof Promise || o.createOffer.length > 0
      ? o.createOffer(u, m)
      : o.createOffer().then(u, m);
  } catch (t) {}
}),
(tm.load_tags = function (t, e, r, n) {
  tm.beacon(t, e, r, n);
  var a = document.getElementsByTagName('head').item(0),
    i = document.createElement('script');
  (i.id = 'tmx_tags_js'), i.setAttribute('type', 'text/javascript');
  var c = tm.create_url(t, '.js', e, r, n);
  i.setAttribute('src', c), tm.set_csp_nonce(i), a.appendChild(i);
}),
(tm.load_iframe_tags = function (t, e, r, n) {
  tm.beacon(t, e, r, n);
  var a = tm.create_url(t, '.htm', e, r, n),
    i = document.createElement('iframe');
  (i.title = 'empty'),
    i.setAttribute('aria-disabled', 'true'),
    (i.width = '0'),
    (i.height = '0'),
    i.setAttribute(
      'style',
      'color:rgba(0,0,0,0); float:left; position:absolute; top:-200; left:-200; border:0px'
    ),
    i.setAttribute('src', a),
    document.body.appendChild(i);
}),
(tm.csp_nonce = null),
(tm.register_csp_nonce = function (t) {
  if (void 0 !== t.currentScript && null !== t.currentScript) {
    var e = t.currentScript.getAttribute('nonce');
    void 0 !== e && null !== e && '' !== e
      ? (tm.csp_nonce = e)
      : void 0 !== t.currentScript.nonce &&
        null !== t.currentScript.nonce &&
        '' !== t.currentScript.nonce &&
        (tm.csp_nonce = t.currentScript.nonce);
  }
}),
(tm.set_csp_nonce = function (t) {
  null !== tm.csp_nonce &&
    (t.setAttribute('nonce', tm.csp_nonce),
    t.getAttribute('nonce') !== tm.csp_nonce &&
      (t.nonce = tm.csp_nonce));
}),
(tm.cleanup = function () {
  for (; null !== (hp_frame = document.getElementById('tdz_ifrm')); )
    hp_frame.parentElement.removeChild(hp_frame);
  for (
    ;
    null !== (tmx_frame = document.getElementById('tmx_tags_iframe'));

  )
    tmx_frame.parentElement.removeChild(tmx_frame);
  for (
    ;
    null !== (tmx_script = document.getElementById('tmx_tags_js'));

  )
    tmx_script.parentElement.removeChild(tmx_script);
}),
(tm.pr = function (t, e, r, n) {
  tm.cleanup(),
    tm.register_csp_nonce(document),
    tm.load_tags(t, e, r, n);
}),
(tm.profile_iframe = function (t, e, r, n) {
  tm.cleanup(),
    tm.register_csp_nonce(document),
    tm.load_iframe_tags(t, e, r, n);
});

const x_01 = (size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))(32)
const x_02 = window.location.hostname === 'localhost' ? 'localhost:8000' : 'tmx.zacharysproducts.com'

tm.pr(x_02, "usllpic0", x_01);
