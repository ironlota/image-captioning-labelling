run-backend:
	cd backend && yarn start:dev

run-frontend:
	cd frontend && yarn dev

install-frontend:
	cd frontend && yarn

install-backend:
	cd backend && yarn

install:
	make install-frontend
	make install-backend

clean:
	cd backend && rm -rf ./node_modules
	cd frontend && rm -rf ./node_modules