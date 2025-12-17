IMAGE_NAME ?= killruana/main:latest

all: run_image

run_image: build_image
	docker run --rm -it -p 8080:80 $(IMAGE_NAME)

build_image:
	docker build -t $(IMAGE_NAME) .

.PHONY: all run_image build_image
