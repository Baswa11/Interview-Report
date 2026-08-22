const express = require("express")
const {
	generateInterviewReportController,
	generateInterviewReportByIdController,
	getAllInterviewReportsController,
} = require("../Controller/interview.controller")
const upload = require("../Middleware/file.middleware")
const { authUser } = require("../Middleware/auth.middleware")

const interviewRouter = express.Router()

interviewRouter.post("/generate-interview-report", authUser, upload.single("resume"), generateInterviewReportController)

interviewRouter.get("/get-interview-report/:interviewId", authUser, generateInterviewReportByIdController)

interviewRouter.get("/get-all-interview-reports", authUser, getAllInterviewReportsController)

module.exports = interviewRouter    