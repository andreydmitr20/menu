## Description.

This is a MVP for my site <a href="memenu.me">memenu.me</a>.

To collect dishes which you like. <br>
To find fast what to cook. <br>
To feed yourself healthy dishes. <br>
To share dishes receipts.

Frontend: JS + CSS + BOOTSTRAP
Backend: Django

## Install on a server.

1.             > gh repo clone andreydmitr20/menu

2.  Create .env file inside /env folder.
    It should contain something like that:
    SECRET_KEY = "yfYAF5eGCekxO8eobSN0ChAdscF5ygbntIa6ud0JVTQ6JgSsmN"
    DEBUG=True

3.  Copy test database from /utils/test_db.sqlite3 into /db/db.sqlite3

4.  In Jenkins add new task to get updates from git.

5.  In a shell run :

        docker compose build

        docker compose up -d

If you need do make some operations on database, use: > docker ps -a
to find the docker-menu container id.
Then run:

        > docker exec -it django_cont /bin/sh

After that you can run commands inside the container.

\# python3 manage.py migrate

To create new database db.sqlite3:

\# python3 manage.py migrate
\# python3 m shell

    >>> from dish.models import Unit,Tag,Vitamin
    >>> o=Unit()
    >>> o.fill()
    >>> o=Tag()
    >>> o.fill()
    >>> o=Vitamin()
    >>> o.fill()

## Debug on a local computer.

1.  Make .venv

        > python3 -m venv .venv

2.              > source .venv/bin/activate

3.              > pip3 install -r requirements.txt

4.              > python3 manage.py runserver

5.  Then open in your browser (put your path instead of "....."):
    file:///...../www/html/index.html

## Relational schema

<img src="./doc/rs.png">

## Icons:

<a href="https://www.flaticon.com/free-icons/menu" title="menu icons">Menu icons created by Becris - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/settings" title="settings icons">Settings icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/settings" title="settings icons">Settings icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/ingredient" title="ingredient icons">Ingredient icons created by SetitikPixelStudio - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/salad" title="salad icons">Salad icons created by Mihimihi - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/eye" title="eye icons">Eye icons created by Kiranshastry - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/food-and-restaurant" title="food and restaurant icons">Food and restaurant icons created by Icon home - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/cancel" title="cancel icons">Cancel icons created by Alfredo Hernandez - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/spoon" title="spoon icons">Spoon icons created by Triangle Squad - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/brands" title="brands icons">Brands icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/more" title="more icons">More icons created by Anggara - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Maxim Basinski Premium - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/plus" title="plus icons">Plus icons created by Vectors Market - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/vitamins" title="vitamins icons">Vitamins icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/tick" title="tick icons">Tick icons created by Octopocto - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/ui" title="ui icons">Ui icons created by Corner Pixel - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/edit" title="edit icons">Edit icons created by Freepik - Flaticon</a>
