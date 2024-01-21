# Project Startup Guide

## GitHub Repository Setup:

### 1. Clone the Repository:

```bash
git clone https://github.com/Sumedha-Sharma/git-finder.git
cd git-finder
```
### 2 Install Dependencies:
```bash
npm install
```
### Configure GitHub Access Token:
#### 1. Generate a personal access token on GitHub with the necessary permissions for the project (repo,project,user).
#### 2. Update the accessToken variable in .env file with your access token as API_KEY.
``` bash
API_KEY=YOURAPIKEY
```

### Build the Project:(for production build)
```bash

npm run build
```

### Local Development:
#### 2. Run the Project:
```bash

npm start
```
#### Run the project locally on your machine.

#### 3. View the Project:
##### Open your browser and navigate to http://localhost:8081 to view your project.


