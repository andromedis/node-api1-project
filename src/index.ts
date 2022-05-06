import { server } from './api/server';

const port: number = 5000;

// START YOUR SERVER HERE
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
