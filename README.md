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

## Live Demo
For a live demo, go to https://cms.demo.klaudsol.app

```
Username: admin@klaudsol.com
Password: admin
```

Note: The database is being refreshed every 24 hours. Your data will be removed!


## How to Run on Development Machine

### Prerequisites:

#### Install the following:
* nvm
* yarn

#### Copy .env to .env.local, and modify the following values (minimal configuration):  
```
KS_AWS_ACCESS_KEY_ID=
KS_AWS_SECRET_ACCESS_KEY=
KS_AURORA_DATABASE=
KS_AURORA_RESOURCE_ARN=
KS_AURORA_SECRET_ARN=
KS_SECRET_COOKIE_PASSWORD=a random secret value that should be unique for each KlaudSol CMS installation.
```

#### Run the following commands:
```
nvm use --lts
./dev-install.sh          # Run this once to setup the database. 
./dev-start.sh            # Let's go!
```

#### Open browser to http://localhost:3001




## Screenshots

Screnshots: https://cms.demo.klaudsol.app

<img width="1677" alt="image" src="https://github.com/klaudsol/klaudsol-cms/assets/1546228/2360a358-7e58-4717-8d71-47b93b7f22be">
<img width="1678" alt="image" src="https://github.com/klaudsol/klaudsol-cms/assets/1546228/5fc4c908-4734-417d-a928-fd931d4eef31">
<img width="1677" alt="image" src="https://github.com/klaudsol/klaudsol-cms/assets/1546228/de115d88-e86e-4776-82d0-abcc2786ea3c">
<img width="1679" alt="image" src="https://github.com/klaudsol/klaudsol-cms/assets/1546228/310f4204-d086-4dbf-89bd-f96a2d9cbe0d">
<img width="1678" alt="image" src="https://github.com/klaudsol/klaudsol-cms/assets/1546228/9836b2b3-d006-4124-9fe8-5521eb6a2433">






