from fastapi import APIRouter
from .solver import router as solver_router

router = APIRouter(prefix="/v1")
router.include_router(solver_router)
