const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

module.exports = (workerFactory) => {
    const usersWorker = workerFactory.makeUsersWorker();
    const messagesWorker = workerFactory.makeMessagesWorker();
    return [
        {
            path: '/api/messages',
            method: 'GET',
            validate: {
                query: Joi.object({
                    skip: Joi.number().default(0),
                    limit: Joi.number().default(10)
                })
            },
            handler: async (payload, params, query) => {
                const skip = query.skip;
                const limit = query.limit;
                try {
                    return await messagesWorker.fetchMessages(skip, limit);
                } catch (error) {
                    return Boom.badRequest(error);
                }
            }
        },
        
        {
            method: 'POST',
            path: '/api/messages',
            validate: {
                payload: Joi.object({
                    message: Joi.string().required(),
                    senderId: Joi.string().required(),
                    localId: Joi.string().required()
                })
            },
            handler: async (payload, params, query) => {
                const message = payload.message;
                const senderId = payload.senderId;
                const localId = payload.localId;
                try {
                    await usersWorker.getUser(senderId);
                    return await messagesWorker.createMessage({ message, senderId, localId });
                } catch (error) {
                    return Boom.badRequest(error);
                }
            }
        },
    ]
    
}