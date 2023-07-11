from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
import requests


app = FastAPI()
app.mount("/static", StaticFiles(directory="harvester/static"), name="static")

hostname = "src.ebay-us.com"


"""Act as a proxy server to request to hostname. Support all paths."""


@app.get("/{path:path}")
def get(path: str, request: Request):
    headers = dict(request.headers)

    url = f"https://{hostname}/{path}?{str(request.query_params)}"

    print(request.query_params)

    headers['host'] = hostname
    headers['referer'] = "https://signin.ebay.com/"

    response = requests.get(url, headers=headers)

    response_headers = dict(response.headers)
    del response_headers["Content-Encoding"]

    response = Response(
        content=response.text,
        status_code=response.status_code,
        headers=response_headers,
    )

    return response


