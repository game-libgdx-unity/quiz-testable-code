// This repository manages in-memory storage of quiz sessions

import { QuizSession } from "../model/QuizModels";

export class QuizRepository {
    private quizSessions: { [quizId: string]: QuizSession } = {};

    // Retrieve a quiz session by its quizId
    public async getQuizSessionById({
        quizId
    }: {
        quizId: string
    }): Promise<QuizSession | null> {
        const session = this.quizSessions[quizId];
        return session ? session : null;
    }

    // Create a new quiz session with given quizId and words array
    public async createNewQuizSession({
        quizId,
        words
    }: {
        quizId: string,
        words: string[]
    }): Promise<QuizSession> {
        const newSession: QuizSession = {
            quizId: quizId,
            participants: [],
            words: words,
            currentIndex: 0
        };
        this.quizSessions[quizId] = newSession;
        return newSession;
    }

    // Update quiz session in repository
    public async updateQuizSession({
        session
    }: {
        session: QuizSession
    }): Promise<void> {
        this.quizSessions[session.quizId] = session;
    }
}