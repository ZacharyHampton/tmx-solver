import os

from pymongo import MongoClient
from ..config import MONGODB_URI
import certifi

client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())


def get_client():
    return client
