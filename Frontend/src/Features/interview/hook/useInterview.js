import { useCallback, useContext } from 'react'
import {
    generateInterviewReport,
    getAllInterviewReportById,
    getAllInterviewReports,
} from '../services/interview.api.js'
import { InterviewContext } from '../interview.context.jsx'

export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider')
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        interviewReports,
        setInterviewReports,
    } = context

    const generateReport = async ({ jobDescription, selfDescription, resume }) => {
        setLoading(true)
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resume })
            setReport(data.interviewReport)
            return data
        } catch (error) {
            console.error("Error generating report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        try {
            const data = await getAllInterviewReportById({ interviewId })
            setReport(data.interviewReport)
            return data
        } catch (error) {
            console.error("Error fetching report:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [setLoading, setReport])

    const getAllReports = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllInterviewReports()
            setInterviewReports(data.interviewReports || [])
            return data
        } catch (error) {
            console.error("Error fetching all reports:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }, [setLoading, setInterviewReports])

    return { loading, report, interviewReports, generateReport, getReportById, getAllReports }
}