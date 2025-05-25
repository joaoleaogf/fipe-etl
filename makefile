# Builda a imagem Docker
build:
	docker-compose build

# Sobe o container
up:
	docker-compose up

# Derruba o container
down:
	docker-compose down

# Remove imagem
clean:
	docker-compose down --rmi all -v --remove-orphans

# Acessa o container via shell
sh:
	docker-compose run etl-fipe sh
