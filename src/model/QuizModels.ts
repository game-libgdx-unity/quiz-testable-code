// This file defines the data models for the quiz application

export interface Participant {
    username: string;
    score: number;
}

export interface QuizSession {
    quizId: string;
    participants: Participant[];
    words: string[];
    currentIndex: number;
}