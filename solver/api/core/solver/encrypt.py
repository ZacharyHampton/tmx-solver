def encrypt(data: str, session_id: str) -> str:
    try:
        td_G = str(len(data)) + "&" + data
        td_r = ""
        td_D = "0123456789abcdef"
        for td_g in range(len(td_G)):
            td_E = ord(td_G[td_g]) ^ ord(session_id[td_g % len(session_id)]) & 10
            td_r += td_D[(td_E >> 4) & 15]
            td_r += td_D[td_E & 15]
        return td_r
    except Exception as e:
        return "None"