import os
import json
from typing import Any

AI_MODE = os.getenv("AI_MODE", "demo").lower()
MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")


def demo_plan(subject: str, topic: str, goal: str, minutes: int) -> dict[str, Any]:
    blocks = max(2, min(5, round(minutes / 12)))
    per = max(5, minutes // blocks)
    return {
        "title": f"{subject}: {topic}",
        "summary": f"A focused {minutes}-minute session for {goal.lower()}.",
        "steps": [
            {"time": f"{per} min", "title": "Warm-up", "detail": f"Write what you already know about {topic}."},
            {"time": f"{per} min", "title": "Learn", "detail": f"Study the core ideas, definitions and one worked example of {topic}."},
            {"time": f"{per} min", "title": "Active recall", "detail": f"Close your notes and explain {topic} in your own words."},
            {"time": f"{per} min", "title": "Practice", "detail": f"Solve 2 exam-style questions on {topic}."},
            {"time": f"{max(3, minutes - per*4)} min", "title": "Review", "detail": "Write 3 key points and one thing to revise next time."},
        ][:blocks],
        "next_action": f"Start with the definition and one simple example of {topic}.",
    }


def demo_chat(message: str, context: dict[str, Any] | None = None) -> str:
    m = message.lower()
    topic = (context or {}).get("topic", "this topic")
    if "hint" in m:
        return f"Hint: break {topic} into its basic definition, purpose, and one small example. Start with the definition."
    if "example" in m:
        return f"Example approach: imagine a small real-world case, then map each part to the main idea of {topic}."
    if "exam" in m:
        return f"Exam format: start with a definition, draw a neat diagram/table if useful, explain 3–5 main points, then give an example and conclusion."
    if "similar" in m:
        return f"Similar practice: explain {topic} in 5 lines, then create one short example and solve it."
    if "simple" in m:
        return f"Simple explanation: {topic} is easier when you first learn what it means, why it is used, and then see one example."
    return f"Let's work on {topic}. First, tell me what part feels confusing. I can explain it simply, give a hint, show an example, or create an exam-style answer."


def bedrock_chat(message: str, context: dict[str, Any] | None = None) -> str:
    try:
        import boto3
        client = boto3.client("bedrock-runtime", region_name=AWS_REGION)
        prompt = f"""You are StudyPilot AI, a friendly exam-focused study coach.
Student context: {json.dumps(context or {})}
Student message: {message}
Answer in simple English. Be concise, practical, encouraging, and exam-focused.
"""
        # Converse API is used because it provides a unified chat interface across
        # supported Bedrock models.
        response = client.converse(
            modelId=MODEL_ID,
            messages=[{"role": "user", "content": [{"text": prompt}]}],
            inferenceConfig={"maxTokens": 500, "temperature": 0.4},
        )
        return response["output"]["message"]["content"][0]["text"]
    except Exception as exc:
        return f"Bedrock is not available right now, so I switched to demo guidance. ({type(exc).__name__})"


def chat(message: str, context: dict[str, Any] | None = None) -> str:
    if AI_MODE == "bedrock" and MODEL_ID:
        return bedrock_chat(message, context)
    return demo_chat(message, context)
