import {
    FastifyBaseLogger,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyTypeProvider,
    RawReplyDefaultExpression, RawServerDefault
} from 'fastify';
import { QuizService } from '../service/QuizService';
import { ActionType, QuizJoinDto, QuizLeaveDto, QuizResponseDto } from '../dto/QuizDto';
import {IncomingMessage, ServerResponse} from "node:http";
import {Server} from "http";

export class QuizController {
    private quizService: QuizService;

    constructor({
        quizService
    }: {
        quizService: QuizService;
    }) {
        this.quizService = quizService;
    }

    // Handler for the join request
    public async handleJoin(
        request: FastifyRequest<{ Body: QuizJoinDto }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const dto = request.body;
            const { quizSession, participant } = await this.quizService.joinQuizSessionWithUsernameAndQuizId(dto);
            const responseDto: QuizResponseDto = {
                type: ActionType.JOIN_ACK,
                quizId: quizSession.quizId,
                username: participant.username,
            };
            reply.send(responseDto);
        } catch (error) {
            reply.status(500).send({ error: 'Failed to join quiz session' });
        }
    }

    // Handler for the leave request
    public async handleLeave(
        request: FastifyRequest<{ Body: QuizLeaveDto }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const dto = request.body;
            const result = await this.quizService.leaveQuizSessionWithUsernameAndQuizId(dto);
            if ('error' in result) {
                reply.status(400).send({ error: result.error });
            } else {
                const responseDto: QuizResponseDto = {
                    type: ActionType.LEAVE_ACK,
                    quizId: result.quizSession.quizId,
                    username: result.username,
                };
                reply.send(responseDto);
            }
        } catch (error) {
            reply.status(500).send({ error: 'Failed to leave quiz session' });
        }
    }
}