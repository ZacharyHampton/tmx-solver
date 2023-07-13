FROM --platform=linux/amd64 python:3.10-slim

ENV stage=prod

RUN mkdir -p /app
WORKDIR /app

RUN python3 -m pip install --root-user-action=ignore --no-cache-dir pip --upgrade
RUN apt-get update

# Install requirements
COPY requirements.txt /app
RUN python3 -m pip install --root-user-action=ignore --no-cache-dir -r requirements.txt

COPY . /app

# Run the application
CMD ["gunicorn", "-w", "4" ,"main:app", "--bind", "0.0.0.0", "--worker-class", "uvicorn.workers.UvicornWorker"]