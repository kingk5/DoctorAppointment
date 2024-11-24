import app from "./app";
import http from 'http';

const port = 3000;
const runningServer = http.createServer(app);
runningServer.listen(port, () => {console.log(`Server is running on http://localhost:${port}`);});

export { runningServer };
