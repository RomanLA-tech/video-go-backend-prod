# Video-Go: backend

## 👋 Description

Hi there! This is the server-application of [my](https://github.com/RomanLA-tech)
pet-fullstack [project:](https://video-go-front.vercel.app/)

* Based on [NestJS](https://github.com/nestjs/nest).
* Database: [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql),
* ORM: [TypeORM](https://typeorm.io/),
* Static data storage: [AWS_S3](https://docs.aws.amazon.com/s3/index.html?nc2=h_ql_doc_s3),
* Deployed on: [Heroku](https://heroku.com)

## 🔎 REST API Documentation

* [LINK](https://video-go-api-app.herokuapp.com/api/docs)

## 📌 Installation

```bash
$ npm install
```

💻 Required server .env variables
-------------------------------
<ul>
<li>PORT = <i>number</i> (Default: 8080)</li>
<li>DB_JWT_SECRET = <i>string</i></li>
<li><i>DATABASE_URL*</i> = <i>string</i></li>
<li>POSTGRES_PORT = <i>number</i></li>
<li>POSTGRES_DB = <i>string</i></li>
<li>POSTGRES_HOST = <i>string</i></li>
<li>POSTGRES_USER = <i>string</i></li>
<li>POSTGRES_PASSWORD = <i>string</i></li>
<li>AWS_S3_BUCKET_NAME = <i>string</i></li>
<li>AWS_BUCKET_REGION = <i>string</i></li>
<li>AWS_S3_ACCESS_KEY = <i>string</i></li>
<li>AWS_S3_KEY_SECRET = <i>string</i></li>
<li>APP_URL = <i>string</i> (*URL of front-part of application for CORS config)</li>
<li><i>NPM_CONFIG_PRODUCTION*</i> = <b>false</b> (for deploy on heroku)</li>
</ul>

❗❗❗ *To work with a local Postgres database, you need to comment out these lines in <b>
config/typeorm.config.ts</b>:</br>

	url: configService.get<string>('DATABASE_URL'),
	ssl: { rejectUnauthorized: false }

❕ <b>Procfile</b> is required for deploy app on heroku

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Additionally used packages:

<em>uuid, typeorm, sharp, pg, passport-jwt, passport, helmet,
compression, class-validator,</br> class-transformer, bcryptjs, aws-sdk,
app-root-path, @nestjs/typeorm, @nestjs/swagger</em>


<p align="right">Created by <a href='https://github.com/RomanLA-tech'>RomanLA</a></p>
