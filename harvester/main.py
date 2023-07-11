import os

from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
import requests
from services import services_pb2_grpc, services_pb2
import grpc
from dotenv import load_dotenv
import tls_client
from tls_client.cookies import create_cookie
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hostname = "src.ebay-us.com"
replacement_domain = "localhost:8000" if os.getenv("stage") == "dev" else "tmx.zacharysproducts.com"

sessions = {}

"""Act as a proxy server to request to hostname. Support all paths."""


def decode(encrypted_string, session_id):
    try:
        td_D = "0123456789abcdef"
        td_G = ""
        for td_g in range(0, len(encrypted_string), 2):
            td_E = (td_D.index(encrypted_string[td_g]) << 4) | td_D.index(encrypted_string[td_g + 1])
            td_T = ord(session_id[td_g // 2 % len(session_id)]) & 10
            td_G += chr(td_E ^ td_T)
        td_U_length = int(td_G.split("&")[0])
        td_U = td_G[td_G.index("&") + 1: td_U_length + td_G.index("&") + 1]
        return td_U
    except Exception:
        return None


def deobfuscate_and_replace(response: requests.Response):
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = services_pb2_grpc.TransformationServiceStub(channel)

        response = stub.Transform(services_pb2.TransformationMessage(
            script=response.text,
            fast=True,
        ))

        if response.error:
            raise Exception(f'Failed to deobfuscate script. Error: {response.error}')

        script = response.script

        #: replace all instances of hostname with localhost or prod domain
        script = script.replace(hostname, replacement_domain)

        return script


@app.get("/{path:path}")
def get(path: str, request: Request):
    session = tls_client.Session(
        client_identifier="chrome112",
        random_tls_extension_order=True
    )

    request_headers = dict(request.headers)

    url = f"https://{hostname}/{path}?{str(request.query_params)}"

    headers = {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Referer': 'https://signin.ebay.com/',
        'Sec-Fetch-Dest': 'script',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
    }

    session.headers = headers

    response = session.get(url)

    if len((param_values := list(request.query_params.values()))) >= 2:
        session_id = param_values[1]
        guid = response.cookies.get("thx_guid") or request.cookies.get("thx_guid")

        if all(c in "0123456789abcdef" for c in session_id) and len(session_id) == 32 and guid:  #: session id is not always 32 on other sites
            sessions[guid] = session_id
            print("Set {} to {}".format(guid, session_id))

    if request_guid := request.cookies.get('thx_guid'):
        session.cookies.set_cookie(create_cookie(
            name="thx_guid",
            value=request_guid,
        ))

        for key, value in request.query_params.items():
            if all(c in "0123456789abcdef" for c in value) and len(value) > 32:
                session_id = sessions.get(request_guid)
                if session_id:
                    print(key, decode(value, session_id))
                else:
                    print("No session id to decode with.")

    response_headers = dict(response.headers)
    if "text/javascript" in response_headers["Content-Type"] and response.status_code == 200:
        data = deobfuscate_and_replace(response)
    else:
        data = response.text

    if "Content-Encoding" in response_headers:
        del response_headers["Content-Encoding"]

    if "Content-Length" in response_headers:
        del response_headers["Content-Length"]

    response = Response(
        content=data,
        status_code=response.status_code,
        headers=response_headers,
    )

    return response
