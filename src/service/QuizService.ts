import { QuizRepository } from "../repository/QuizRepository";
import { QuizSession, Participant } from "../model/QuizModels";
import { QuizJoinDto, QuizLeaveDto } from "../dto/QuizDto";

export class QuizService {
    private quizRepository: QuizRepository;
    private defaultQuizWords = ['node', 'javascript', 'typescript', 'programming', 'quiz'];

    constructor({
        quizRepository
    }: {
        quizRepository: QuizRepository;
    }) {
        this.quizRepository = quizRepository;
    }

    // Join a quiz session; creates a new session if needed
    public async joinQuizSessionWithUsernameAndQuizId(dto: QuizJoinDto): Promise<{ quizSession: QuizSession, participant: Participant }> {
        const { quizId, username } = dto;
        let session = await this.quizRepository.getQuizSessionById({ quizId });
        if (!session) {
            session = await this.quizRepository.createNewQuizSession({ quizId, words: this.defaultQuizWords.slice() });
        }
        let participant = session.participants.find(p => p.username === username);
        if (!participant) {
            participant = { username, score: 0 };
            session.participants.push(participant);
            await this.quizRepository.updateQuizSession({ session });
        }
        return { quizSession: session, participant };
    }

    // Leave a quiz session.
    public async leaveQuizSessionWithUsernameAndQuizId(dto: QuizLeaveDto): Promise<{ quizSession: QuizSession, username: string } | { error: string }> {
        const { quizId, username } = dto;
        const session = await this.quizRepository.getQuizSessionById({ quizId });
        if (!session) {
            return { error: 'Quiz session not found' };
        }
        const participantIndex = session.participants.findIndex(p => p.username === username);
        if (participantIndex === -1) {
            return { error: 'Participant not found in quiz session' };
        }
        session.participants.splice(participantIndex, 1);
        await this.quizRepository.updateQuizSession({ session });
        return { quizSession: session, username };
    }
}