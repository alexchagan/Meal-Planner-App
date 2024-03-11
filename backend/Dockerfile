FROM python:3

WORKDIR /usr/src/backend

COPY requirements.txt /usr/src/backend

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python3", "/usr/src/backend/run.py" ]