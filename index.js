// code away!
const server = require('./server.js');

const port = 5000;
server.listen(port, () => {
    console.log(`Listening to port: ${port}`)
})