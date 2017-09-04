CONTAINER_NAME:= lotas/contentful-graph-web
PORT:= 3000

BUILD:
	docker build -t $(CONTAINER_NAME) .

RUN:
	docker run -it --rm -p $(PORT):3000 lotas/contentful-graph-web

