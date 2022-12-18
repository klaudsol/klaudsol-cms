# klaudsol-cms
KlaudSol CMS is a Headless and Serverless CMS (Content Management System). Welcome to the future. 👽👾🛸

* A great headless and serverless alternative to WordPress and Strapi.
* Serverless - stop worrying about servers, uptime, devops, and deployment. 
  * Just keep coding - *it will just run*. 🏃🏽‍♂️ 
  * No more support calls on weekends and midnights.
  * Written in [Next.js](https://nextjs.org/).
* Headless - Have **absolute control** on how your site looks and feels. 
  * No more studying of new templating languages. 
  * No more kludgy "UI Builders" that don't do what you want them to do. 
  * Works great with a [Next.js](https://nextjs.org/) frontend!
* Deploys seamlessly to [AWS Amplify Hosting](https://aws.amazon.com/amplify/) + [AWS Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/).
  * Have full access and control to **your** data.
* Licensed under a permissive licence ([MIT License](https://opensource.org/licenses/MIT)).

## How to Run on Development Machine

### Prerequisites:

#### Install the following:
* nvm
* yarn

#### Copy .env to .env.local, and modify the following values:  
```
AURORA_AWS_ACCESS_KEY_ID=
AURORA_AWS_SECRET_ACCESS_KEY=
AURORA_DATABASE=
AURORA_RESOURCE_ARN=
AURORA_SECRET_ARN=
SECRET_COOKIE_PASSWORD=a random secret value that should be unique for each KlaudSol CMS installation.
FRONTEND_URL= 
IMAGE_DOMAINS=
```

#### Run the following commands:
```
nvm use --lts
./dev-start.sh
```

#### Open browser to http://localhost:3001


## Live Demo
For a live demo, go to https://cms-demo.klaudsol.app

```
Username: admin@klaudsol.com
Password: admin
```

Note: The database is being refreshed every 24 hours. Your data will be removed!

## Screenshots

<img width="1678" alt="image" src="https://user-images.githubusercontent.com/1546228/192326061-794fcf32-c89a-4604-9bf2-a6b2ccf09ab2.png">

<img width="1678" alt="image" src="https://user-images.githubusercontent.com/1546228/192326373-d30303b2-4988-4282-8fdc-70d9a0fa190c.png">

<img width="1679" alt="image" src="https://user-images.githubusercontent.com/1546228/196386299-7c82a22d-aeae-439c-a62f-725bb20a1358.png">

<img width="1680" alt="image" src="https://user-images.githubusercontent.com/1546228/196386361-76cbfddb-5d7b-45d4-aeb2-c807e477fe02.png">


<img width="1677" alt="image" src="https://user-images.githubusercontent.com/1546228/196385953-a8ced339-a37e-4601-bd3a-f2e4e85bef96.png">

<img width="1680" alt="image" src="https://user-images.githubusercontent.com/1546228/196386024-caa4e99b-3e76-457b-a5e9-f4b760494196.png">


