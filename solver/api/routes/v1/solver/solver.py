import random

from fastapi import APIRouter, Depends
import enum
from ....core.solver.sites import site_list
from ....core.solver.device import get_devices, Device
from pydantic import BaseModel
import time
from ....core.db import get_client
from pymongo import MongoClient


router = APIRouter()
Site = enum.Enum('Site', {site.site_name: site.site_domain for site in site_list.values()})
devices = get_devices()


class SolveRequest(BaseModel):
    session_id: str
    domain: Site
    proxy: str | None = None


class SolveResponse(BaseModel):
    success: bool
    message: str | None = None
    execution_time: float | None = None


@router.post("/solve", response_model=SolveResponse)
def solve(solve_request: SolveRequest):
    site = site_list[solve_request.domain.value]

    #: log time to execute

    start_time = time.time()

    """working_device = Device({
          "jsou": "Mac",
          "jso": "Mac OS X 10_15_7",
          "jsbu": "Chrome",
          "jsb": "Chrome 114"
        })"""

    random_device = random.choice(devices)

    message = None
    execution_time = None
    try:
        success = site.solve(solve_request.session_id, random_device, proxy=solve_request.proxy)
        execution_time = round(time.time() - start_time, 2)
    except Exception as e:
        success = False
        message = str(e)

    return SolveResponse(success=success, message=message, execution_time=execution_time)
