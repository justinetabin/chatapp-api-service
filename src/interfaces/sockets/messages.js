
module.exports = (workerFactory) => {
    const messagesWorker = workerFactory.makeMessagesWorker();
    
    return {
        path: '/',
        handler: (nsp, socket) => {
            console.log('a socket connected in /');
            messagesWorker.onCreateMessage((data) => (nsp.emit('message', data)));
        },
        events: [
            {
                name: 'disconnect',
                handler: () => {
                    console.log('a socket dc in /');
                }
            }
        ]
    }
}