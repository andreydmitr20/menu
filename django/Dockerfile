FROM python:3.9.16
RUN mkdir /code
WORKDIR /code
COPY . /code
# uwsgi setup
RUN apt-get --assume-yes install python3
RUN pip3 install uwsgi
RUN pip3 install -r requirements.txt
CMD ["uwsgi", "--ini", "/code/uwsgi.ini"]

