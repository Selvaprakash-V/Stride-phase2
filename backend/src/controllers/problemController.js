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
