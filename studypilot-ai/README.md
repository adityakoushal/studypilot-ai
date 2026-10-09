# StudyPilot AI

StudyPilot AI is a student-friendly AI study agent for the AWS Weekend Challenge.

## What it does
- Creates a personalized study plan from subject, topic, goal and available time.
- Explains difficult topics in simple language.
- Provides exam-focused practice questions.
- Checks answers and gives feedback.
- Includes a delightful **I'm Stuck** mode with:
  - Give me a hint
  - Explain simply
  - Give an example
  - Show an exam answer
  - Give a similar question
- Keeps a lightweight demo progress score.

## Tech
- React + Vite frontend
- FastAPI + Python backend
- AWS-ready architecture
- Demo mode works without AWS credentials
- Bedrock adapter is prepared in `backend/agent.py`

## Run locally

### 1. Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite.

## Environment
Copy `backend/.env.example` to `backend/.env`.

The default mode is `demo`, so no AWS account configuration is required to try the interface.

For AWS mode, configure AWS credentials with the AWS CLI/standard AWS credential chain and set:
```env
AI_MODE=bedrock
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=YOUR_MODEL_ID
```

## AWS architecture for the challenge
Frontend -> API Gateway -> Lambda/FastAPI agent layer -> Amazon Bedrock

Future persistence:
- DynamoDB for learner progress
- S3 for study material
- CloudWatch for logs
- Cognito for authentication

## Challenge mapping
1. What and who: StudyPilot AI helps students turn limited study time into a focused session.
2. How built: React, FastAPI, and AWS-ready Bedrock integration.
3. Delightful detail: I'm Stuck mode gives the learner control over exactly the kind of help they want.
4. Proof: Run the app and capture the dashboard + generated plan + I'm Stuck interaction.
5. Tag: `#agents`

## Demo script
1. Select DBMS, topic "Normalization", goal "Exam Prep", 45 minutes.
2. Click Generate Study Plan.
3. Ask a question in the study coach.
4. Click I'm Stuck -> Explain simply.
5. Click Practice Question and answer it.
6. Show the progress card changing.

## Suggested repository name
`studypilot-ai`
