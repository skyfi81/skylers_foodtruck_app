# San Francisco Food Truck Finder

Food Truck Finder is a web application that helps users discover all actively permitted food trucks in San Francisco. The application displays food trucks on an interactive map, allows users to search and filter food trucks, and provides functionality for user reviews and ratings.

## Features

- **Interactive Map**: Displays all food trucks on a map using their geolocation.
- **Search and Filter**: Search for food trucks by name or type of cuisine.
- **User Reviews and Ratings**: Users can rate and review food trucks.
- **Favorites**: Users can mark food trucks as favorites.
- **Detailed Food Truck Information**: Displays detailed information about each food truck, including menu.


## Technology Stack

- **Frontend**: React.js
- **Backend**: Python/Flask
- **Database**: MongoDB
- **Geolocation**: Leaflet.js
- **Deployment**: Docker

## DEPLOYMENT 

### Docker Deployment

To deploy the application using Docker, ensure you have Docker and Docker Compose installed, and follow these steps:

1. **Build and run the containers from root of project:**

   ```bash
   docker-compose up --build
   ```
   This command will build the Docker images for the backend and frontend, and start the containers.

2. **Access the application:**

- **Backend:** 'http://localhost:5000'
- **Frontend:** 'http://localhost:3000'

3. **Teardown application:**

    ```bash
   docker-compose down
   ```