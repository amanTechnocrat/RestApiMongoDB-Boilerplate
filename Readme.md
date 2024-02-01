# Node Boiler Plate

## Features
- User Registeration
- User Login with JWT
- CRUD Operation Avaliable on all Fields
- Upload and Update Profile Photo
- Forget Password
- REST API

### Pre-requisites

- Install mongoDB `https://www.mongodb.com/try/download/community`

- Install npm and nodeJs `https://nodejs.org/`

$ node --versionPlease update your project in below sheet asap
- Must be `npm version >= 6.x`

$ npm --version
- Must be `npm version >= 12.x`


## ----Back-end server----

### Run Node Server


$ cd node

- Install required dependencies
$ npm install

- Start server
$ npm run dev

--Please set .env file before starting the server
DatabaseUrl="mongodb://localhost:27017/UserDatabase"
NODE_ENV="local"
NODE_PORT_ENV=""
PASSWORD="bciiwbfwctogrgih"
FROM="aman.elsner@gmail.com"

### File Structure

```
|-- app.js
|-- config
|   `-- index.js
|-- controller
|   `-- usercont
|       `-- index.js
|-- helper
|   `-- bcrypt.js
|-- images
|   `-- profileImage
|       `-- profileimg-1656587499503.png
|-- model
|   `-- userschema.js
|-- package-lock.json
|-- package.json
|-- routes
|   `-- index.js
|-- services
`-- yarn.lock
