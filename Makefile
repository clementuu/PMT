.PHONY: ihm
ihm:
	cd ihm && ng serve

.PHONY: pmt
pmt:
	cd pmt && mvn spring-boot:run