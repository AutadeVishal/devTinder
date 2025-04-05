1. Order of routes matters in Express.js.
   - Routes are matched in the order they are defined. If a route matches, subsequent routes will not be checked unless `next()` is explicitly called.

2. Utils can be used to create authorization middlewares.
   - Example: You can create reusable middleware functions for authentication or authorization in a `utils` folder.

3. Error-handling middleware pattern:
   - Use `app.use('/', (err, req, res, next) => {})` to handle errors.
   - This middleware is executed only when an error is passed to `next(err)`.

4. `.then()` always expects a result, not a function to execute after the previous promise.
   - Always use an arrow function to accept the result of the previous promise and use it to call another function.
   - Example:
     ```javascript
     promise.then((result) => otherFunction(result));
     ```
5. Schema->Model->object of Model/(instance of model)->Save in database
6. app.use(express.json()); to convert json to normal object in javascript