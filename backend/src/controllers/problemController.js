import Problem from "../models/Problem.js";

export async function getProblems(req, res) {
  try {
    const problems = await Problem.find().sort({ title: 1 }).select("-__v");
    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in getProblems controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getProblemById(req, res) {
  try {
    const { id } = req.params; // slug
    const problem = await Problem.findOne({ id }).select("-__v");

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemById controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createProblem(req, res) {
  try {
    const user = req.user; // attached by protectRoute

    if (!user || user.role !== "host") {
      return res.status(403).json({ message: "Only hosts can create problems" });
    }

    const {
      id,
      title,
      difficulty,
      category,
      descriptionText,
      notes,
      examples,
      constraints,
      starterCode,
      expectedOutput,
    } = req.body;

    if (!id || !title || !difficulty || !category || !descriptionText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Problem.findOne({ id });
    if (existing) {
      return res.status(409).json({ message: "Problem with this id already exists" });
    }

    const problem = new Problem({
      id,
      title,
      difficulty,
      category,
      description: {
        text: descriptionText,
        notes: notes || [],
      },
      examples: examples || [],
      constraints: constraints || [],
      starterCode: starterCode || {},
      expectedOutput: expectedOutput || {},
    });

    await problem.save();

    res.status(201).json({ problem });
  } catch (error) {
    console.error("Error in createProblem controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
