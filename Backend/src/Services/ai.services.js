const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const interviewReportSchema = z.object({
    title: z.string().describe("The title of the report, which can be used as a heading for the report"),

    matchScore: z.number().min(0).max(100).describe("An overall match score between 0 and 100 indicating how well the candidate fits the target job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("Question that is asked by the interviewer"),
        intention: z.string().describe("Intention of Interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).describe("Technical Questions that can be asked in Interview along with their intention and answer"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("Question that is asked by the interviewer"),
        intention: z.string().describe("Intention of Interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    })).describe("Behavioral Questions that can be asked in Interview along with their intention and answer"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this gap, i.e, how much the candidate is lacking in this skill")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan. e.g. data structures and algorithms, or databases etc."),
        tasks: z.array(z.string()).describe("The tasks that the candidate should do on this day.")
    })).describe("A day wise preparation plan for the candidate to prepare for the interview."),
})

const interviewReportResponseSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        matchScore: { type: "integer", minimum: 0, maximum: 100 },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false
            }
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },
                required: ["question", "intention", "answer"],
                additionalProperties: false
            }
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"],
                additionalProperties: false
            }
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day: { type: "integer" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"],
                additionalProperties: false
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
    additionalProperties: false
}


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interviewer and career preparation coach.

Your task is to analyze the candidate's profile and the target job description, then create a personalized interview preparation report.

You will receive three inputs:

1. SELF DESCRIPTION:
${selfDescription || "Not provided"}

2. RESUME:
${resume || "Not provided"}

3. JOB DESCRIPTION:
${jobDescription}

Analyze all three inputs carefully.

Your analysis must focus on:
- The candidate's actual skills and experience mentioned in the resume.
- The candidate's strengths and weaknesses mentioned in the self-description.
- The technical skills, responsibilities, and requirements mentioned in the job description.
- The difference between the candidate's current skills and the skills required for the job.
- Questions that are likely to be asked specifically based on the candidate's resume and this job description.

Generate the following sections:

TITLE:
A concise, engaging title for the preparation plan (e.g., "Senior React Developer Interview Strategy").

MATCH SCORE:
An integer between 0 and 100 assessing how closely the candidate's background matches the requirements in the job description.

TECHNICAL QUESTIONS:
Create realistic technical interview questions that are relevant to this specific candidate and job.
Questions should be based on:
- Technologies mentioned in the resume.
- Projects mentioned in the resume.
- Technical requirements in the job description.
- Fundamental CS concepts relevant to the role.
- Areas where the candidate may be questioned deeply.

For every technical question:
- "question" should contain the question an interviewer may ask.
- "intention" should explain what the interviewer is trying to evaluate by asking it.
- "answer" should explain how the candidate should answer, including important points to cover and a suitable approach. Do not simply provide a one-line answer.

BEHAVIORAL QUESTIONS:
Create realistic behavioral and HR interview questions based on:
- The candidate's self-description.
- Their projects and experience.
- Their career goals.
- The responsibilities of the target job.

For every behavioral question:
- "question" should contain the question an interviewer may ask.
- "intention" should explain what the interviewer wants to evaluate.
- "answer" should explain how the candidate should structure their answer and what points they should cover. Use approaches such as STAR (Situation, Task, Action, Result) when appropriate.

SKILL GAPS:
Compare the candidate's current skills from the resume and self-description against the requirements of the job description.

Only identify meaningful skill gaps.

For each gap:
- "skill" should identify the missing or insufficient skill.
- "severity" should be:
  - "high" if the skill is important for the role and the candidate has little or no evidence of it.
  - "medium" if the candidate has some related knowledge but needs improvement.
  - "low" if the candidate mostly has the skill but needs minor improvement.

Do not claim that a candidate lacks a skill if the resume provides strong evidence that they have it.

PREPARATION PLAN:
Create a practical day-by-day preparation plan based specifically on the identified skill gaps and the job description.

The plan should:
- Start from day 1.
- Prioritize high-severity skill gaps first.
- Include technical preparation, project preparation, coding/DSA, behavioral preparation, and mock interview practice where relevant.
- Give concrete tasks for each day.
- Make the tasks achievable and specific rather than vague instructions such as "study JavaScript."
- Include revision and mock interview practice toward the end of the plan.

IMPORTANT RULES:
- Personalize the entire report to this candidate.
- Do not generate generic interview questions unrelated to the resume or job description.
- Do not invent experience, projects, technologies, certifications, or achievements that are not present in the inputs.
- If a technology appears in the job description but not in the resume, treat it as a potential skill gap rather than assuming the candidate knows it.
- Questions about projects should be based only on information actually provided in the resume.
- Prioritize the most important and likely interview topics.
- Make answers practical so the candidate can actually use them during interview preparation.
- Maintain consistency between skill gaps and the preparation plan.
- Return ONLY one JSON object with exactly these six keys: title, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan.
- technicalQuestions and behavioralQuestions must be arrays of objects. Each object must contain exactly: question, intention, answer.
- skillGaps must be an array of objects containing skill and severity.
- preparationPlan must be an array of objects containing day, focus, and tasks.
- Do not use snake_case keys such as technical_questions or behavioral_questions.
- Do not return arrays of alternating strings.
`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: interviewReportResponseSchema
            }
        })
        return interviewReportSchema.parse(JSON.parse(response.text))
    } catch (err) {
        console.error("Error generating interview report:", err)
        throw err
    }
}

module.exports = generateInterviewReport