<a href="https://priority-calendar.web.app/"><img src="https://priority-calendar.web.app/favicon.ico" title="Priority calendar" alt="Priority calendar"></a>


# Priority calendar

> React application for simple project managament and tasks within.

---

## DEMO

> You can checkout this application live on the following location:

- https://priority-calendar.web.app/

> There is a demo account option if you don't want to create personalized account.

## Setup

> Clone this repo to your local machine using 

```shell
git clone https://github.com/ljudina/priority-calendar
```
> Once you cloned repo go to priority calendar folder and run following command

```shell
npm install
```
> To run this application locally run 
```shell
npm start
```
## Tests
> There are basic tests on application and you can run it with following command
```shell
npm test
```

### Connecting to backend (Firebase)

#### Firebase project setup
> In order to use this app you must have <a href="https://firebase.google.com/">firebase</a> account and created project for this application.

#### Enabling email autorization

> This project use firebase email autorization and it should be enabled in your Firebase project settings.

#### Setup realtime database

> Once you setup firebase project you should create realtime database and database rules:

```json
{
  "rules": {
    "profiles": {
      ".read": "auth != null",
      ".write": "auth != null"      
    },
    "projects": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": "userId"
    },
    "tasks": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": "projectId"
    }            
  }
}
```
> Also you should add your firebase credentials to your application application. Configuration file can be found at:

```
/src/shared/firebaseConfig.js
```

> You should fill up fields with your firebase project credentals which can be found at firebase project settings:

```js
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: ""
};
```

---

## Built With

* [React](https://reactjs.org/) - Javascript library
* [React Redux](https://react-redux.js.org/) - React bindings for Redux
* [Materials UI](https://material-ui.com/) - React components for faster and easier web development.
* [Firebase](https://firebase.google.com/) - Tools and infrastructure you need to develop and grow your application.
---

## Support and feedback

Feel free to contact me via

- Linkedin at <a href="https://rs.linkedin.com/in/marko-jovanovic-7a444825" target="_blank">`linkedin.com`</a>
- Mail at ljudina[at]gmail.com</a>

---

## License



- **[The Prosperity Public License 3.0.0](https://prosperitylicense.com/)**
- See the [LICENSE.md](LICENSE.md) file for details
- Copyright 2020 © <a href="mailto:ljudina[at]gmail.com">Marko Jovanovic</a>