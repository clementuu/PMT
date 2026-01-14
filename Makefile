.PHONY: ihm
ihm:
	cd ihm && ng serve

.PHONY: pmt
pmt:
	cd pmt && mvn spring-boot:run

.PHONY: test-ihm
test-ihm:
	cd ihm && ng test --code-coverage

.PHONY: test-pmt
test-pmt:
	cd pmt && mvn test verify

.PHONY: build
build:
	docker compose build

.PHONY: start
start:
	docker compose up -d

.PHONY: stop
stop:
	docker compose down