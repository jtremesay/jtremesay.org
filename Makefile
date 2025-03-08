all: docker-run

.PHONE: docker-run
docker-run: docker-build
	docker run -it -p 8080:80 jtremesay

.PHONE: docker-build
docker-build:
	docker build -t jtremesay .