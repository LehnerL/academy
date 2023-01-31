# Academy Application

MADE BY: LEHNER L

This is an academy app made in Node.js & Express.

## Technologies

- Node.js
- Express
- MongoDB & Mongoose
- Pug Templating

### Version

2.0.0

## Usage

Run app

For creating some new students to start with,
go to ./models/student and uncomment line 88 "run()"

This app runs on port 3000, route 'http://localhost:3000/', ('/') to start on browser.

On the client side, I`ve used my own created commands,
which do the same functions on the server side.
Please check the 'client_test.txt' file for running some tests,
(one command only each time).

For using the client side (json mode 'app.js --json'),
please uncomment the function 'processLineByLine('client_test.txt')'
on line 124, on the file 'client'.

\*app.get('/'..) is on file 'app'.

### Installation

Install the dependencies

```sh
$ npm install
```

Run app

```sh
$ npm start
```
