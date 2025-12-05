import { GoogleGenAI, SchemaType, Type } from "@google/genai";

// Ensure API key is present; in a real app, handle this more gracefully.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const evaluateEssayAnswer = async (
  questionText: string,
  userAnswer: string,
  context: string
): Promise<{ score: number; feedback: string }> => {
  if (!apiKey) {
    return { score: 0, feedback: "API Key missing. Cannot evaluate." };
  }

  try {
    const prompt = `
      You are a Computer Science Professor grading a student's answer about Bubble Sort.
      
      Context from course material:
      ${context}

      Question: "${questionText}"
      Student Answer: "${userAnswer}"

      Grade the answer on a scale of 0 to 100.
      Provide brief, constructive feedback.
      If the answer is incorrect, explain why based on the Bubble Sort algorithm rules.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
          },
          required: ["score", "feedback"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Evaluation error:", error);
    return { score: 0, feedback: "Error evaluating answer. Please try again." };
  }
};

export const generateQuizQuestions = async (): Promise<any[]> => {
    if (!apiKey) return [];

    const prompt = `
    Generate a quiz with exactly 20 Multiple Choice Questions (MCQs) about the **Basic** Bubble Sort algorithm.

    CRITICAL VISUAL INSTRUCTION:
    - In the visible question text and options, refer to the algorithm simply as "Bubble Sort". 
    - DO NOT use the words "unoptimized", "basic", or "standard" to qualify the algorithm name in the question text. Just say "Bubble Sort".

    LOGICAL INSTRUCTION (For your internal generation):
    - The underlying logic and answers MUST be based on the unoptimized version (where it runs all passes regardless of whether swaps occurred).
    - Best Case Time Complexity is O(N^2) for this version.
    - Total comparisons is always N(N-1)/2.

    STRICTLY AVOID:
    - Questions about "Optimized Bubble Sort".
    - Questions about "Early termination" or checking a "swapped" flag.
    - Questions implying Best Case time complexity is O(N).

    INCLUDE Questions about:
    - Core mechanics: Comparing adjacent pairs, swapping if out of order.
    - Pass logic: After k passes, the k largest elements are sorted at the end.
    - Comparison counts: Specific counts for Pass 1 (N-1), Pass 2 (N-2), etc.
    - Tracing: "What is the state of array [X, Y, Z...] after the first pass?"
    - Complexity: Time O(N^2), Space O(1).
    - Stability: Definition and why Bubble Sort is stable.
    - Mechanics definitions: "What is a pass?", "What is the bubbling effect?".

    For each question, provide a 'context' field explaining the answer.
    
    Format as a valid JSON array of objects.
    `;

    try {
         const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["MCQ"] },
                            text: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctOptionIndex: { type: Type.INTEGER },
                            context: { type: Type.STRING } // Brief context for grading later
                        },
                        required: ["id", "type", "text", "options", "correctOptionIndex", "context"]
                    }
                }
            }
        });

        const text = response.text;
        if(!text) return [];
        return JSON.parse(text);

    } catch (e) {
        console.error("Failed to generate questions", e);
        return [];
    }
}