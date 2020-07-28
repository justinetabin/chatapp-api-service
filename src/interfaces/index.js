
module.exports = {
    Routes: (workerFactory) => [
        require('./routes/users')(workerFactory),
        require('./routes/messages')(workerFactory),
    ]
}