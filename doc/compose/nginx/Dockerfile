FROM nginx:1.24.0
COPY nginx.conf /etc/nginx/nginx.conf
COPY menu.nginx.conf /etc/nginx/sites-available/menu.nginx.conf
RUN mkdir /etc/nginx/sites-enabled
RUN ln -s /etc/nginx/sites-available/menu.nginx.conf /etc/nginx/sites-enabled/
CMD ["nginx", "-g", "daemon off;"]