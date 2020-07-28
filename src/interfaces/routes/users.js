const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

module.exports = (workerFactory) => {
    const usersWorker = workerFactory.makeUsersWorker();
    return [
        {
            path: '/api/users/{id}',
            method: 'GET',
            validate: {
                params: Joi.object({
                    id: Joi.string()
                }),
            },
            handler: async (payload, params) => {
                const userId = params.id;
                try {
                    return await usersWorker.getUser(userId);
                } catch (error) {
                    return Boom.notFound(error);
                }
            }
        },
        
        {
            path: '/api/users/login',
            method: 'POST',
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            },
            handler: async (payload) => {
                const username = payload.username;
                const password = payload.password;
                try {
                    return await usersWorker.login({ username, password });
                } catch (error) {
                    return Boom.unauthorized(error);
                }
            }
        },
        
        {
            path: '/api/users/signup',
            method: 'POST',
            validate: {
                payload: Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().required()
                })
            },
            handler: async (payload) => {
                const username = payload.username;
                const password = payload.password;
                try {
                    return await usersWorker.signup({ username, password });
                } catch (error) {
                    return Boom.unauthorized(error);
                }
            }
        }
    ]
}