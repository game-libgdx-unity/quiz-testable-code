import fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';
import { Server, IncomingMessage, ServerResponse } from 'http';
import awsLambdaFastify from '@fastify/aws-lambda';

import { validateEnvironmentVariables } from './utils/environmentHelper';
import { AVAILABLE_RTP_VERSION, GAME_TITLE } from './core/constant';
import { buildConfig } from './config/buildConfig';
import { PlayRequestSchema } from './schema/play.schema';
import { play } from './controllers/play.controller';
import { description } from './controllers/description.controller';
import { result } from './controllers/result.controller';
import { ResultRequestSchema } from './schema/result.schema';

const port = process.env.PORT || 3000;
const logLevel = process.env.LOG_LEVEL || 'info';

const startServer = async () => {
    try {
        validateEnvironmentVariables();

        const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify<Server>({
            logger: pino({ level: logLevel }),
        });

        server.register(async (fastify: FastifyInstance) => {
            fastify.route({
                method: 'POST',
                url: '/play',
                // schema: { body: PlayRequestSchema },
                handler: play,
            });
        }, { prefix: '/api/v1' });

        server.register(async (fastify: FastifyInstance) => {
            fastify.route({
                method: 'POST',
                url: '/result',
                // schema: { body: ResultRequestSchema },
                handler: result,
            });
        }, { prefix: '/api/v1' });

        server.register(async (fastify: FastifyInstance) => {
            fastify.route({
                method: 'GET',
                url: '/description',
                handler: description,
            });
        }, { prefix: '/api/v1' });

        server.get('/', (request, reply) => {
            reply.send({
                name: `${GAME_TITLE} Game Logic`,
                build: buildConfig.build,
                profiles: AVAILABLE_RTP_VERSION,
            });
        });

        server.get('/health-check', async (request, reply) => {
            const healthcheck = {
                uptime: process.uptime(),
                message: 'OK',
                timestamp: Date.now(),
            };
            reply.send(healthcheck);
        });

        server.setErrorHandler((error, request, reply) => {
            server.log.error(error);
            reply.status(500).send(error);
        });

        if (process.env.NODE_ENV === 'production') {
            for (const signal of ['SIGINT', 'SIGTERM']) {
                process.on(signal, () =>
                    server.close().then((err) => {
                        console.log(`Close application on ${signal}`);
                        process.exit(err ? 1 : 0);
                    })
                );
            }
        }

        if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
            await server.listen({ port: Number(port), host: '0.0.0.0' });
        } else {
            exports.handler = awsLambdaFastify(server);
        }
    } catch (e) {
        console.error(e);
    }
};

process.on('unhandledRejection', (e) => {
    console.error(e);
    process.exit(1);
});

startServer();