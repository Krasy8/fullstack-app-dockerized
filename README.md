## Build & Deploy

The app is currently structured to be deployed as docker containers:
- frontend (react.js) and backend (springboot) in one container
- postgres database in another.

In order to simplify the process of building and deploying the app there are build profiles defined in pom.xml using 
jib plugin:
- build-frontend -> builds react frontend part
- jib-push-to-dockerhub -> copies the content of the build folder inside the frontend part to the static recourses 
  of the springboot part and pushes all to docker hub
- jib-push-to-local -> copies the content of the build folder inside the frontend part to the static recourses
  of the springboot part and pushes all to local docker 

The above means that both frontend and backend are exposed on the same port 8080. 
This is a simplified version as I am planning to decouple these two to separate containers in the future managed by 
nginx.

### Deployment process
1. Frontend .env file (needs to be located in the root of frontend part directory)
    ```
   REACT_APP_API_URL=http://{server IP}:8080
   ```
   
2. Backend .env file (can be located wherever you want on the server)
    ```
    ## environmental variables related to springboot-react-fullstack-app
    # full-stack-app
    ALLOWED_ORIGIN=http://{server IP}:8080
    JWT_SECRET={stron jwt secret}
    SPRING_DATASOURCE_URL=jdbc:postgresql://{server IP}:5432/fullstackapp
    
    # db
    POSTGRES_USER={postgres user}
    POSTGRES_PASSWORD={postgres password}
    ```

3. It is a good practice to clean the code before you build a new version
   - remove the build folder from the frontend directory (if you have any)
   - clean the springboot part from any existing build by removing the target folder or running the ```mvn clean```

4. Jib build command needs to be run with some parameters:
   - build type referring to the profile (eg. ```-P jib-push-to-dockerhub```)
   - docker image tag (eg. ```-Dapp.image.tag=v10-arm64```)
   - arch type (eg. ```-Djib.from.platforms=linux/arm64```)

    example:
    ```shell
    mvn clean install -P build-frontend -P jib-push-to-dockerhub -Dapp.image.tag=v10-arm64 -Djib.from.platforms=linux/arm64
    ```
5. When the docker image is pushed to docker hub the only thing left is to install the app in CasaOS by going to the 
   store and choosing to install a custom app from docker-compose.yml located in the project root directory.
    ```yaml
    name: springboot-react-fullstack-app
    
    services:
      full-stack-app:
        image: "krasy8/springboot-react-fullstack:latest"
        container_name: full-stack-app-cont
        ports:
          - "8080:8080"
        restart: always
        environment:
          - SPRING_DATASOURCE_URL=jdbc:postgresql://full-stack-app-psql-cont:5432/fullstackapp
          - SPRING_DATASOURCE_USERNAME=${POSTGRES_USER}
          - SPRING_DATASOURCE_PASSWORD=${POSTGRES_PASSWORD}
        volumes:
          # Mount the .env file to the same directory path as in your application
          - {dir to the .env file on the server}.env:{dir to .env file inside docker container} # eg.:/app/config/.env
        networks:
          - full-stack-app-net
        depends_on:
          - db
    
      db:
        image: "arm64v8/postgres:12-bullseye"
        container_name: full-stack-app-psql-cont
        environment:
          POSTGRES_DB: fullstackapp
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        networks:
          - full-stack-app-net
        ports:
          - "5432:5432"
        volumes:
          - postgres-data:/var/lib/postgresql/data
    
    networks:
      full-stack-app-net:
        driver: bridge
    
    volumes:
      postgres-data:
    
    ```
   
## Usage
After successful installation the app should be launched by clicking on the app icon on casa os UI or from an 
alternative browser by accessing the url: ```http://{server IP}:8080```
