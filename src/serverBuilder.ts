// import Fastify, { FastifyInstance } from 'fastify';
// import { QuizController } from './controller/QuizController';
// import { QuizService } from './service/QuizService';
// import { QuizRepository } from './repository/QuizRepository';
// import {IncomingMessage, Server, ServerResponse} from "http";
// import fastify from "fastify";
//
// const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify<Server>({
//     logger: true
// });
//
// // Create repository, service, and controller
// const quizRepositoryInstance = new QuizRepository();
// const quizServiceInstance = new QuizService({
//     quizRepository: quizRepositoryInstance
// });
// const quizControllerInstance = new QuizController({
//     quizService: quizServiceInstance
// });
//
// server.route({
//     method: 'POST',
//     url: '/api/v1/quiz/join',
//     handler: async (request, reply) => {
//         return quizControllerInstance.handleJoin(request, reply);
//     },
// });
//
// server.route({
//     method: 'POST',
//     url: '/api/v1/quiz/leave',
//     handler: async (request, reply) => {
//         return quizControllerInstance.handleLeave(request, reply);
//     },
// });
//
// export { server as app, fastify as server };