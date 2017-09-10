CONTAINER_NAME:= lotas/contentful-graph-web
PORT:= 3000

build:
	docker build -t $(CONTAINER_NAME) .

run:
	docker run -it --rm -p $(PORT):3000 $(CONTAINER_NAME)

push:
	docker push $(CONTAINER_NAME)

