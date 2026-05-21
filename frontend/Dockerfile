# Serve static files with Nginx (Alpine — tiny image, ~8 MB).
FROM nginx:alpine

# Remove the default Nginx welcome page.
RUN rm /usr/share/nginx/html/*

# Copy the frontend static files into the Nginx serving directory.
COPY index.html style.css app.js /usr/share/nginx/html/

# Nginx listens on port 80 inside the container.
# docker-compose maps host port 3000 → container port 80.
EXPOSE 80
