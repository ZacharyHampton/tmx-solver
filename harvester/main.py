import os
import config
from fastapi import FastAPI, Request, Response, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from services import services_pb2_grpc, services_pb2
import grpc
import tls_client
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import certifi
import redis
from datetime import datetime
import asyncio
from urllib.parse import urlparse, parse_qs, parse_qsl

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
grpc_ip = "localhost" if os.getenv("stage") == "dev" else "deobfuscator"

mongo_client = MongoClient(config.MONGODB_URI, tlsCAFile=certifi.where())
db = mongo_client["harvester"]
payloads_collection = db["payloads"]

r = redis.from_url(config.REDIS_URL, decode_responses=True, ssl_cert_reqs=None)

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


def deobfuscate_and_replace(response):
    with grpc.insecure_channel('{}:50051'.format(grpc_ip)) as channel:
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


def upload_payload(data: dict):
    payloads_collection.insert_one(data)


def handle_requests(path: str, request: Request, background_tasks: BackgroundTasks):
    if replacement_domain not in str(request.url):
        return Response(status_code=404)

    session = tls_client.Session(
        client_identifier="chrome112",
        random_tls_extension_order=True
    )

    request_headers = dict(request.headers)

    real_tmx_url = f"https://{hostname}/{path}?{str(request.query_params)}"

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
    }

    if "user-agent" in request_headers:
        headers["User-Agent"] = request_headers["user-agent"]

    if "sec-ch-ua" in request_headers:
        headers["sec-ch-ua"] = request_headers["sec-ch-ua"]

    if "sec-ch-ua-mobile" in request_headers:
        headers["sec-ch-ua-mobile"] = request_headers["sec-ch-ua-mobile"]

    if "sec-ch-ua-platform" in request_headers:
        headers["sec-ch-ua-platform"] = request_headers["sec-ch-ua-platform"]

    session.headers = headers

    if request.cookies.get("thx_guid"):
        cookies = {
            "thx_guid": request.cookies.get("thx_guid"),
        }
    else:
        cookies = {}

    if request.method == "GET":
        response = session.get(real_tmx_url, cookies=cookies)
    else:
        body = asyncio.run(request.body()).decode("utf-8")
        response = session.post(real_tmx_url, cookies=cookies, data=body)

    thx_guid = response.cookies.get("thx_guid") or request.cookies.get("thx_guid")

    if ".js" in path and request.method == "GET":  #: this flag only works for v3, other versions use .js in all paths
        param_values = list(request.query_params.values())
        session_id = param_values[1]

        if all(c in "0123456789abcdef" for c in session_id) and thx_guid:  #: session id is not always 32 on other sites
            r.set(name=thx_guid, value=session_id, ex=86400)
    elif thx_guid:
        session_id = r.get(thx_guid)

        data_to_insert = {
            "url": str(request.url),
            "thx_guid": thx_guid,
            "session_id": session_id,
            "parameters": {},
            "timestamp": str(datetime.utcnow()),
        }

        if request.method == "GET":
            iterative_value = request.query_params.items()
        else:
            iterative_value = parse_qsl(asyncio.run(request.body()).decode("utf-8"))

        for key, value in iterative_value:
            if all(c in "0123456789abcdef" for c in value):
                url_data = {
                    "raw_parameter_value": value,
                }

                if session_id:
                    url_data["decoded_parameter_value"] = decode(value, session_id)

                data_to_insert["parameters"][key] = url_data

        if data_to_insert["parameters"]:
            background_tasks.add_task(upload_payload, data_to_insert)

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


@app.get("/{path:path}")
def get(path: str, request: Request, background_tasks: BackgroundTasks):
    return handle_requests(path, request, background_tasks)


@app.post("/{path:path}")
def post(path: str, request: Request, background_tasks: BackgroundTasks):
    return handle_requests(path, request, background_tasks)
