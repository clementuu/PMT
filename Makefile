.PHONY: ihm
ihm:
	cd ihm && ng serve

.PHONY: pmt
pmt:
	cd pmt && mvn spring-boot:run

.PHONY: ihmtest
ihmtest:
	cd ihm && ng test --code-coverage