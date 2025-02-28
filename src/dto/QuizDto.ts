export interface QuizJoinDto {
    quizId: string;
    username: string;
}

export interface QuizLeaveDto {
    quizId: string;
    username: string;
}

export enum ActionType {
    JOIN_ACK = 'joinAck',
    LEAVE_ACK = 'leaveAck'
}

export interface QuizResponseDto {
    type: ActionType;
    quizId: string;
    username: string;
}
