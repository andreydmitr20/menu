FROM nginx:1.24.0
COPY nginx.conf /etc/nginx/nginx.conf
COPY django.nginx.conf /etc/nginx/sites-available/
COPY jenkins.nginx.conf /etc/nginx/sites-available/
RUN mkdir /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/django.nginx.conf /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/jenkins.nginx.conf /etc/nginx/sites-enabled/
CMD ["nginx", "-g", "daemon off;"]