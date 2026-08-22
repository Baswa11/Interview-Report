const pdfModule = require("pdf-parse")
const mongoose = require("mongoose")
const generateInterviewReport = require("../Services/ai.services")
const interviewReportModel = require("../Models/interviewReport.model")

// Support both pdf-parse v2 class export and default export
const PDFParser = pdfModule.PDFParse || pdfModule.default || pdfModule

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Target job description is required" })
        }

        let resumeText = ""

        if (req.file && req.file.buffer) {
            try {
                const parser = new PDFParser({ data: req.file.buffer })
                const resumeContent = await parser.getText()
                if (typeof parser.destroy === "function") {
                    await parser.destroy()
                }
                resumeText = resumeContent?.text || ""
            } catch (pdfErr) {
                console.error("PDF Parsing error:", pdfErr)
                // Continue with whatever description is available if PDF fails
            }
        }

        if (!resumeText.trim() && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Please provide either a valid resume PDF or a self-description"
            })
        }

        const aiResponse = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim()
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: aiResponse.title || "Interview Preparation Plan",
            matchScore: typeof aiResponse.matchScore === "number" ? aiResponse.matchScore : 75,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim(),
            technicalQuestions: aiResponse.technicalQuestions || [],
            behavioralQuestions: aiResponse.behavioralQuestions || [],
            skillGaps: aiResponse.skillGaps || [],
            preparationPlan: aiResponse.preparationPlan || []
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Error generating report:", err)
        res.status(500).json({ message: "Failed to generate interview report", error: err.message })
    }
}

async function generateInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({ message: "Invalid interview report ID" })
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id }).lean()

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Error fetching report by ID:", err)
        res.status(500).json({ message: "Failed to fetch interview report", error: err.message })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
            .lean()

        res.status(200).json({
            message: "Interview reports fetched successfully",
            interviewReports
        })
    } catch (err) {
        console.error("Error fetching all reports:", err)
        res.status(500).json({ message: "Failed to fetch interview reports", error: err.message })
    }
}

module.exports = {
    generateInterviewReportController,
    generateInterviewReportByIdController,
    getAllInterviewReportsController
}