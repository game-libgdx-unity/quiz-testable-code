The goal is to create a clean but robust coding style to firmly develop new features while still having a maintainable and testable code that gives developers confidence when they modify source code.

Video explaination: https://youtu.be/oIs4GoUicl8

Real-Time Quiz challenge
How to run the source code:
Clone the project, go to the root folder and run
```
pnpm i   to install npm packages
pnpm run dev   to start the dev server
pnpm run build   to build the server app
pnpm run start   to start the built app
pnpm run test  to run all the tests (unit tests and integration tests)
```
## Requirement documentation:
Part 1: System Design
System Design Document:
Architecture Diagram: Create an architecture diagram illustrating how different components of the system interact. This should include all components required for the feature, including the server, client applications, database, and any external services.
Component Description: Describe each component's role in the system.
Data Flow: Explain how data flows through the system from when a user joins a quiz to when the leaderboard is updated.
Technologies and Tools: List and justify the technologies and tools chosen for each component.
Part 2: Implementation
Pick a Component:

Implement one of the core components below using the technologies that you are comfortable with. The rest of the system can be mocked using mock services or data.
Requirements for the Implemented Component:

Real-time Quiz Participation: Users should be able to join a quiz session using a unique quiz ID.
Real-time Score Updates: Users' scores should be updated in real-time as they submit answers.
Real-time Leaderboard: A leaderboard should display the current standings of all participants in real-time.
Build For the Future:

Scalability: Design and implement your component with scalability in mind. Consider how the system would handle a large number of users or quiz sessions. Discuss any trade-offs you made in your design and implementation.
Performance: Your component should perform well even under heavy load. Consider how you can optimize your code and your use of resources to ensure high performance.
Reliability: Your component should be reliable and handle errors gracefully. Consider how you can make your component resilient to failures.
Maintainability: Your code should be clean, well-organized, and easy to maintain. Consider how you can make it easy for other developers to understand and modify your code.
Monitoring and Observability: Discuss how you would monitor the performance of your component and diagnose issues. Consider how you can make your component observable.

### Implementation
## I. Diagram
This diagram outlines the interactions between various components including servers, clients, and databases.

https://app.eraser.io/workspace/F3SaRt1kqQlk82rm7yfj?origin=share 
## II. Component Descriptions
### Server Components
- **Authentication Server:**  
  - Parses user access tokens and sends quiz request data (e.g., username, quiz ID, quiz answer) to the Quiz Server.
-  Quiz Server: The server is implemented in the source code, other servers & services are mocks.
  - **Role:** Acts as the main server responsible for quiz operations.  
In the data flow diagram, authentication and quiz server are illuminated by “NodeJS Server”

  Functionality of QUIZ server:
    - Receives input from the Authentication Server.  
    - Manages quiz operations such as joining or quitting a quiz session, submitting quiz answers, calculating quiz results and points, and sending updates to the Leaderboard Service.
  
- **Leaderboard Service:**  
  - **Role:** Processes user point updates.  
  - **Functionality:**  
    - Updates player ranks on the leaderboard.  
    - Sends leaderboard update notifications to all connected clients.

### Client Components
- **Client Application (React/ReactJS):**  
  - **Role:** Manages user authentication and authorization.  
  - **Functionality:**  
    - Ensures users have an ID and username.  
    - Displays the user's name on the leaderboard.  
    - Listens to push notification services to receive real-time leaderboard updates.

### Database Components
- **Redis:**  
  - **Role:** Provides fast, temporary data storage with support for data expiration.  
  - **Usage:**  
    - Utilizes Zset data structures to rank users by points.  
    - Uses an additional Zset with timestamps as ZScores to rank users by quiz completion time.  
    - Supports commands like `ZRANGE` to retrieve the top N players from the leaderboard.

- **Postgres:**  
  - **Role:** Stores persistent user data and historical leaderboard data.  
  - **Usage:**  
    - Holds long-term data such as user profiles and historical quiz results.  
    - A worker server job periodically updates quiz progress from Redis into Postgres to back up temporary data.  
    - Supports data partitioning (e.g., monthly partitions) to manage large volumes of leaderboard data efficiently.

## III. Data Flow
1. **Player Authentication & Quiz Session Initiation:**  
   - A player sends an authentication request to join a quiz.  
   - The server retrieves relevant user and quiz data from Postgres and returns it to the client, while also creating or joining a quiz session in Redis.

2. **Quiz Answer Submission:**  
   - The player submits a quiz answer to the server.  
   - The server validates the answer, calculates points for correct answers, and updates the player's ranking using a Redis Zset.

3. **Real-time Leaderboard Updates:**  
   - When points change, the server sends updates to a push notification service.  
   - The push notification service broadcasts these updates to all connected clients.  
   - Technologies for push notifications (e.g., AWS AppSync, Firebase Push Notification, or a custom WebSocket server) 

4. **Historical Data Backup:**  
   - Once the quiz expires, a cron job running on a worker server saves the leaderboard data from Redis to Postgres, ensuring long-term historical storage.

## IV. Technology Justification
- **Fastify and NodeJS (for Business, Authentication, Quiz, and Worker Servers):**  
    - NodeJS, paired with Fastify, is highly effective for handling I/O-intensive operations, making it ideal for a real-time quiz application.  
    - It offers cost-effective performance compared to other technologies like Python or Java.

- **Redis:**  
    - Its ability to quickly store temporary data with expiration times makes it perfect for real-time leaderboard calculations and session management.

- **Postgres:**  
    - Provides reliable long-term storage for user data and historical leaderboard records.  
    - Supports data partitioning, which is beneficial for managing large datasets and maintaining optimal database performance.
- ** Push notification: **
- - There are many technologies for push notifications (e.g., AWS AppSync, Firebase Push Notification, or a custom WebSocket server) are selected based on our business needs and cost efficiency.




Quiz Game Application Documentation
Project Overview
This is a multiplayer quiz game application built with TypeScript, featuring a layered architecture that separates concerns and maintains testability.
Core Features
Players can join/leave quiz sessions
Multiple players can participate in the same quiz
Real-time answer processing
Score tracking for participants
Leaderboard functionality (prepared for Redis implementation)
Architecture
1. Layer Structure
src/
├── model/       # Domain models
├── dto/         # Data transfer objects
├── repository/  # Data access layer
├── service/     # Business logic
└── constants/   # Application constants
tests/
└── service/     # Unit tests
2. Key Components
Models
The domain models (QuizModels.ts) define core entities:
Quiz: Represents a quiz session with words, hints, and current progress
Participant: Represents a player in a quiz session
Reference:
export interface Participant {
    quizId: string;
    username: string;
    score: number;
}
export interface QuizSession {
    quizId: string;
    words: string[];
    hints: string[];
    currentIndex: number;
    createdAt?: Date;
    updatedAt?: Date;
    participants: Participant[];
}
Data Transfer Objects (DTOs)
DTOs handle data transfer between layers and define API contracts. Examples include:
QuizJoinDto: For joining a session
QuizAnswerDto: For submitting answers
QuizLeaveDto: For leaving a session
Reference:
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
export interface QuizJoinResult {
    quizSession: QuizSession;
    participant: Participant;
    hints: string[];
    currentIndex: number;
}
Repositories
Two main repositories handle data persistence:
SessionRepository: Manages quiz sessions
SessionParticipantRepository: Manages participant data
Both currently use in-memory storage but are structured to easily switch to a real database.
Services
Services implement business logic:
QuizService: Handles core quiz operations
LeaderboardService: Manages scoring (prepared for Redis implementation)
Testing Strategy
1. Unit Tests
Each service has corresponding unit tests
Mocks are used for repository dependencies
Tests cover success and error scenarios
Example test structure:
describe('QuizService', () => {
    const mockQuizSession: QuizSession = {
        quizId: 'test-quiz',
        participants: [],
        words: ['test'],
        hints: ['test hint'],
        currentIndex: 0,
        createdAt: new Date('2020-01-01T00:00:00Z'),
        updatedAt: new Date('2020-01-01T00:00:00Z')
    };
    const mockParticipant: Participant = {
        quizId: 'test-quiz',
        username: 'test-user',
        score: 0
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('joinQuizSessionWithUsernameAndQuizId', () => {
        test('should create new session and add participant when session does not exist', async () => {
            (quizRepository.getQuizSessionById as jest.Mock).mockResolvedValue(null);
            (quizRepository.createNewQuizSession as jest.Mock).mockResolvedValue(mockQuizSession);
            (participantRepository.findParticipantInSession as jest.Mock).mockResolvedValue(null);
            (participantRepository.addParticipantToSession as jest.Mock).mockResolvedValue({
                session: mockQuizSession,
                participant: mockParticipant
            });
            const result = await quizService.joinQuizSessionWithUsernameAndQuizId({
                quizId: 'test-quiz',
                username: 'test-user'
            });
            expect(quizRepository.getQuizSessionById).toHaveBeenCalledWith({
                quizId: 'test-quiz'
            });
            expect(quizRepository.createNewQuizSession).toHaveBeenCalled();
            expect(participantRepository.addParticipantToSession).toHaveBeenCalled();
            expect(result).toEqual({
                quizSession: mockQuizSession,
                participant: mockParticipant,
                hints: mockQuizSession.hints,
                currentIndex: mockQuizSession.currentIndex
            });
        });
        test('should return error when participant already exists', async () => {
            (quizRepository.getQuizSessionById as jest.Mock).mockResolvedValue(mockQuizSession);
            (participantRepository.findParticipantInSession as jest.Mock).mockResolvedValue(mockParticipant);
            const result = await quizService.joinQuizSessionWithUsernameAndQuizId({
                quizId: 'test-quiz',
                username: 'test-user'
            });
            expect(participantRepository.addParticipantToSession).not.toHaveBeenCalled();
            expect(result).toEqual({
                error: QuizServiceErrorMessages.USER_ALREADY_JOINED
            });
        });
    });
2. Test Coverage
Tests cover:
Session creation/joining
Participant management
Answer processing
Error handling
Design Patterns Used
Repository Pattern: Abstracts data access
DTO Pattern: Manages data transfer between layers
Singleton Pattern: Used for service instances
Dependency Injection: Through constructor injection in services
Future Improvements
Database Integration
Current in-memory storage can be replaced with:
PostgreSQL for quiz and participant data
Redis for leaderboard and real-time features
Real-time Features
WebSocket integration for live updates
Real-time leaderboard updates
Scalability
Session management across multiple servers
Caching layer for quiz data
Message queue for answer processing
Development Workflow
Feature Development
git checkout -b feat/feature-name
# Make changes
git add .
git commit -m "feat: description"
Testing
Write unit tests alongside feature development
Run tests: npm test

