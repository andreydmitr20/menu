FROM python:3.9.16
RUN mkdir /code
WORKDIR /code
COPY ./uwsgi.ini /code
COPY ./requirements.txt /code
RUN apt-get --assume-yes update
RUN apt-get --assume-yes install python3
RUN apt-get --assume-yes install uwsgi
RUN python3 -m pip install --upgrade pip
# RUN pip3 install uwsgi
RUN pip3 install -r requirements.txt
CMD ["uwsgi", "--ini", "/code/uwsgi.ini"]

