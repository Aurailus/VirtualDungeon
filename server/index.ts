import App from "./App";

process.on('unhandledRejection', up => { throw up });

new App();
