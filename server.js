// HTTP module import : allows http requests
const http = require("http");
// Imports my app.js file
const app = require("./app");
// Makes sure the port is a valid int
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// Defines the port (4000 by default)
const port = normalizePort(process.env.PORT || "4000");
// Sets the port
app.set("port", port);
// Handles various errors : error outside listening, port already in use, require higher privileges...
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Creates an http server
const server = http.createServer(app);
// sets up the error handler to be called at each error
server.on("error", errorHandler);
// Displays the port in the console
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
// Sets the server to listen on the required port
server.listen(port);
