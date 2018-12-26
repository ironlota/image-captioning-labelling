run-backend:
	cd backend && npm run start:dev

run-frontend:
	cd frontend && npm run dev

install-frontend:
	cd frontend && npm install

install-backend:
	cd backend && npm install

install:
	make install-frontend
	make install-backend

clean:
	cd backend && rm -rf ./node_modules
	cd frontend && rm -rf ./node_modules
