import { useState, useEffect, useMemo } from 'react'
import { useInterview } from '../hook/useInterview.js'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import {
    FiCode,
    FiMessageSquare,
    FiCalendar,
    FiArrowLeft,
    FiAlertCircle,
    FiCheckCircle,
    FiPrinter,
    FiCopy,
    FiCheck,
    FiSearch,
    FiChevronDown,
    FiChevronUp,
    FiAward,
    FiTrendingUp,
    FiLayers,
    FiTarget,
    FiCheckSquare,
    FiSquare,
    FiZap
} from 'react-icons/fi'

const NAV_TABS = [
    { id: 'technical', label: 'Technical Questions', icon: FiCode, badgeKey: 'technicalQuestions' },
    { id: 'behavioral', label: 'Behavioral Questions', icon: FiMessageSquare, badgeKey: 'behavioralQuestions' },
    { id: 'roadmap', label: 'Preparation Road Map', icon: FiCalendar, badgeKey: 'preparationPlan' },
    { id: 'skillgaps', label: 'Skill Gap Analysis', icon: FiTarget, badgeKey: 'skillGaps' },
]

// ── Question Card Component ──────────────────────────────────────────────────
const QuestionCard = ({ item, index, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setOpen(defaultOpen)
    }, [defaultOpen])

    const handleCopy = (e) => {
        e.stopPropagation()
        const textToCopy = `Question: ${item.question}\n\nInterviewer Intention: ${item.intention}\n\nModel Answer: ${item.answer}`
        navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            className={`group rounded-xl border transition-all duration-200 ${
                open
                    ? 'border-pink-500/40 bg-[#121929] shadow-lg shadow-pink-950/10'
                    : 'border-[#222f46] bg-[#0e1524] hover:border-[#354664] hover:bg-[#111a2d]'
            }`}
        >
            <div
                className="flex cursor-pointer items-start justify-between gap-4 p-5"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-violet-500/20 text-xs font-bold text-pink-400 border border-pink-500/30">
                        {index + 1}
                    </span>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100 sm:text-base leading-snug">
                            {item.question}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopy}
                        title="Copy question & answer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a3852] bg-[#162033] text-slate-400 opacity-0 transition group-hover:opacity-100 hover:border-pink-500 hover:text-pink-400 sm:opacity-100"
                    >
                        {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy className="text-xs" />}
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:text-white">
                        {open ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                </div>
            </div>

            {open && (
                <div className="space-y-4 border-t border-[#1e2a40] px-5 pb-5 pt-4">
                    {/* Intention */}
                    <div className="rounded-lg border border-sky-500/20 bg-sky-950/20 p-4">
                        <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-block h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                Interviewer's Evaluation Goal
                            </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed sm:text-sm">
                            {item.intention}
                        </p>
                    </div>

                    {/* Model Answer */}
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/15 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                                    Structured Model Answer &amp; Key Talking Points
                                </span>
                            </div>
                            {copied && (
                                <span className="text-[11px] font-medium text-emerald-400">
                                    Copied to clipboard!
                                </span>
                            )}
                        </div>
                        <p className="whitespace-pre-line text-xs text-slate-200 leading-relaxed sm:text-sm">
                            {item.answer}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Roadmap Day Component with Checkable Tasks ──────────────────────────────
const RoadMapDay = ({ day, completedTasks, onToggleTask }) => {
    const totalTasks = (day.tasks || []).length
    const dayCompletedCount = (day.tasks || []).filter((_, i) =>
        completedTasks[`d${day.day}-t${i}`]
    ).length
    const isDayCompleted = totalTasks > 0 && dayCompletedCount === totalTasks

    return (
        <div
            className={`overflow-hidden rounded-xl border transition duration-200 ${
                isDayCompleted
                    ? 'border-emerald-500/30 bg-[#0e1724]'
                    : 'border-[#222f46] bg-[#0e1524]'
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2a40] bg-[#131b2c] px-5 py-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-7 px-2.5 items-center justify-center rounded-lg text-xs font-bold ${
                            isDayCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        }`}
                    >
                        Day {day.day}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 sm:text-base">
                        {day.focus}
                    </h3>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400">
                        {dayCompletedCount}/{totalTasks} tasks done
                    </span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#1e2a40]">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 to-emerald-400 transition-all duration-300"
                            style={{
                                width: `${totalTasks ? (dayCompletedCount / totalTasks) * 100 : 0}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <ul className="divide-y divide-[#182234] p-2">
                {(day.tasks || []).map((task, i) => {
                    const taskId = `d${day.day}-t${i}`
                    const isDone = !!completedTasks[taskId]
                    return (
                        <li
                            key={i}
                            onClick={() => onToggleTask(taskId)}
                            className="flex cursor-pointer items-start gap-3 rounded-lg p-3 transition hover:bg-[#162033]"
                        >
                            <button
                                type="button"
                                className="mt-0.5 shrink-0 text-base text-slate-400 transition hover:text-pink-400"
                            >
                                {isDone ? (
                                    <FiCheckSquare className="text-emerald-400" />
                                ) : (
                                    <FiSquare />
                                )}
                            </button>
                            <span
                                className={`text-xs sm:text-sm leading-relaxed ${
                                    isDone
                                        ? 'text-slate-500 line-through'
                                        : 'text-slate-200'
                                }`}
                            >
                                {task}
                            </span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── Main Interview Report View ───────────────────────────────────────────────
const InterviewReport = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [searchQuery, setSearchQuery] = useState('')
    const [expandAll, setExpandAll] = useState(false)
    const [completedTasks, setCompletedTasks] = useState({})
    const [fetchError, setFetchError] = useState('')
    const [copyPlanSuccess, setCopyPlanSuccess] = useState(false)

    const { report, loading, getReportById } = useInterview()
    const location = useLocation()
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const interviewReport = location.state?.interviewReport || report

    useEffect(() => {
        if (interviewId && !location.state?.interviewReport) {
            setFetchError('')
            getReportById(interviewId).catch((err) => {
                setFetchError(err?.response?.data?.message || 'Unable to load interview report.')
            })
        }
    }, [interviewId, location.state, getReportById])

    const toggleTask = (taskId) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }))
    }

    const technicalList = useMemo(() => {
        const list = interviewReport?.technicalQuestions || []
        if (!searchQuery.trim()) return list
        return list.filter(
            (q) =>
                q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.intention?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [interviewReport, searchQuery])

    const behavioralList = useMemo(() => {
        const list = interviewReport?.behavioralQuestions || []
        if (!searchQuery.trim()) return list
        return list.filter(
            (q) =>
                q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.intention?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [interviewReport, searchQuery])

    const roadmapList = useMemo(() => {
        const list = interviewReport?.preparationPlan || []
        if (!searchQuery.trim()) return list
        return list.filter(
            (day) =>
                day.focus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                day.tasks?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [interviewReport, searchQuery])

    const handleCopyFullPlan = () => {
        if (!interviewReport) return
        const text = `
=== ${interviewReport.title || 'INTERVIEW PREPARATION STRATEGY'} ===
Match Score: ${interviewReport.matchScore ?? 'N/A'}%

--- TECHNICAL QUESTIONS (${(interviewReport.technicalQuestions || []).length}) ---
${(interviewReport.technicalQuestions || []).map((q, i) => `Q${i + 1}: ${q.question}\nIntention: ${q.intention}\nAnswer: ${q.answer}\n`).join('\n')}

--- BEHAVIORAL QUESTIONS (${(interviewReport.behavioralQuestions || []).length}) ---
${(interviewReport.behavioralQuestions || []).map((q, i) => `Q${i + 1}: ${q.question}\nIntention: ${q.intention}\nAnswer: ${q.answer}\n`).join('\n')}

--- PREPARATION ROADMAP (${(interviewReport.preparationPlan || []).length} Days) ---
${(interviewReport.preparationPlan || []).map((d) => `Day ${d.day} - Focus: ${d.focus}\nTasks:\n${(d.tasks || []).map((t) => `  - ${t}`).join('\n')}`).join('\n\n')}

--- SKILL GAPS (${(interviewReport.skillGaps || []).length}) ---
${(interviewReport.skillGaps || []).map((g) => `- ${g.skill} [${g.severity?.toUpperCase()}]`).join('\n')}
        `.trim()

        navigator.clipboard.writeText(text)
        setCopyPlanSuccess(true)
        setTimeout(() => setCopyPlanSuccess(false), 2500)
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#070b12] text-slate-100">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative flex h-14 w-14 items-center justify-center">
                        <span className="absolute h-full w-full animate-ping rounded-full bg-pink-500/20" />
                        <span className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Generating Your Custom Interview Plan...</h2>
                    <p className="text-xs text-slate-400 max-w-sm">
                        Analyzing your profile against role requirements and drafting tailored questions and preparation roadmap.
                    </p>
                </div>
            </main>
        )
    }

    if (fetchError || !interviewReport) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-4 text-slate-100">
                <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-[#2b3444] bg-[#0e1524] p-8 text-center shadow-2xl">
                    <FiAlertCircle className="text-4xl text-red-400" />
                    <h1 className="text-xl font-bold text-white">Interview Report Not Found</h1>
                    <p className="text-sm text-slate-400">
                        {fetchError || "The requested interview report could not be found or you don't have access to it."}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-2 flex items-center gap-2 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-500"
                    >
                        <FiArrowLeft />
                        Back to Generator
                    </button>
                </div>
            </main>
        )
    }

    const matchScore = interviewReport.matchScore ?? 85
    const scoreColorClass =
        matchScore >= 80
            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
            : matchScore >= 60
                ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                : 'text-rose-400 border-rose-500/40 bg-rose-500/10'

    return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 pb-16">
            {/* ── Top App Bar ── */}
            <header className="sticky top-0 z-30 border-b border-[#1b263a] bg-[#0b101c]/90 backdrop-blur-md px-4 py-3.5 sm:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 rounded-lg border border-[#222f46] bg-[#121a2c] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-pink-500 hover:text-pink-400"
                        >
                            <FiArrowLeft />
                            <span className="hidden sm:inline">New Strategy</span>
                        </button>
                        <div className="h-4 w-px bg-[#222f46]" />
                        <span className="text-xs font-semibold text-slate-400 truncate max-w-[200px] sm:max-w-md">
                            {interviewReport.title || 'Personalized Interview Plan'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleCopyFullPlan}
                            className="flex items-center gap-1.5 rounded-lg border border-[#222f46] bg-[#121a2c] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-pink-500 hover:text-white"
                            title="Copy full text strategy"
                        >
                            {copyPlanSuccess ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
                            <span className="hidden md:inline">
                                {copyPlanSuccess ? 'Copied Full Plan!' : 'Copy Plan'}
                            </span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-1.5 rounded-lg bg-pink-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-pink-950/30 transition hover:bg-pink-500"
                        >
                            <FiPrinter />
                            <span>Print / PDF</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
                {/* ── Strategy Hero & Metrics Header ── */}
                <section className="mb-8 rounded-2xl border border-[#1e2a40] bg-gradient-to-b from-[#11192a] to-[#0d1422] p-6 sm:p-8 shadow-xl shadow-black/40">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-400">
                                <FiZap className="text-pink-400" />
                                AI Interview Intelligence
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                                {interviewReport.title || 'Personalized Interview Preparation Plan'}
                            </h1>
                            <p className="text-xs text-slate-400 leading-relaxed sm:text-sm">
                                Tailored strategy generated from your profile and target job specifications. Focus on recommended priority gaps to maximize your interview conversion.
                            </p>
                        </div>

                        {/* Readiness Match Score Card */}
                        <div className="flex items-center gap-4 rounded-xl border border-[#22314a] bg-[#141d2f]/80 p-4 shrink-0">
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${scoreColorClass} text-2xl font-black`}>
                                {matchScore}%
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Role Match Score
                                </span>
                                <p className="text-sm font-semibold text-slate-200">
                                    {matchScore >= 80
                                        ? 'High Role Readiness'
                                        : matchScore >= 60
                                            ? 'Moderate Fit (Target Gaps)'
                                            : 'Requires Deep Prep'}
                                </p>
                                <span className="text-xs text-slate-500">
                                    Based on resume &amp; requirements
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4 Stat Badges */}
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t border-[#1e2a40] pt-6">
                        <div
                            onClick={() => setActiveNav('technical')}
                            className="cursor-pointer rounded-xl border border-[#202c42] bg-[#121a2c]/60 p-3.5 transition hover:border-pink-500/40 hover:bg-[#162035]"
                        >
                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                <FiCode className="text-pink-400" /> Technical Qs
                            </span>
                            <span className="mt-1 block text-xl font-bold text-white">
                                {(interviewReport.technicalQuestions || []).length}
                            </span>
                        </div>

                        <div
                            onClick={() => setActiveNav('behavioral')}
                            className="cursor-pointer rounded-xl border border-[#202c42] bg-[#121a2c]/60 p-3.5 transition hover:border-pink-500/40 hover:bg-[#162035]"
                        >
                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                <FiMessageSquare className="text-pink-400" /> Behavioral Qs
                            </span>
                            <span className="mt-1 block text-xl font-bold text-white">
                                {(interviewReport.behavioralQuestions || []).length}
                            </span>
                        </div>

                        <div
                            onClick={() => setActiveNav('roadmap')}
                            className="cursor-pointer rounded-xl border border-[#202c42] bg-[#121a2c]/60 p-3.5 transition hover:border-pink-500/40 hover:bg-[#162035]"
                        >
                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                <FiCalendar className="text-pink-400" /> Prep Duration
                            </span>
                            <span className="mt-1 block text-xl font-bold text-white">
                                {(interviewReport.preparationPlan || []).length} Days
                            </span>
                        </div>

                        <div
                            onClick={() => setActiveNav('skillgaps')}
                            className="cursor-pointer rounded-xl border border-[#202c42] bg-[#121a2c]/60 p-3.5 transition hover:border-pink-500/40 hover:bg-[#162035]"
                        >
                            <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                <FiTarget className="text-pink-400" /> Skill Gaps
                            </span>
                            <span className="mt-1 block text-xl font-bold text-white">
                                {(interviewReport.skillGaps || []).length} Identified
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── Main Tabbed Content & Search ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left & Main Content Area (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Tab Switcher & Search Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Segmented Tabs */}
                            <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#222f46] bg-[#0e1524] p-1.5">
                                {NAV_TABS.map((tab) => {
                                    const Icon = tab.icon
                                    const count = (interviewReport[tab.badgeKey] || []).length
                                    const isActive = activeNav === tab.id
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveNav(tab.id)}
                                            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                                                isActive
                                                    ? 'bg-pink-600 text-white shadow-md shadow-pink-950/30'
                                                    : 'text-slate-400 hover:bg-[#162135] hover:text-slate-200'
                                            }`}
                                        >
                                            <Icon className="text-sm" />
                                            <span>{tab.label}</span>
                                            <span
                                                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                                    isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-[#1b263b] text-slate-400'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Search & Collapse Filter Controls */}
                        {activeNav !== 'skillgaps' && (
                            <div className="flex items-center justify-between gap-3">
                                <div className="relative flex-1 max-w-sm">
                                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={`Filter ${activeNav}...`}
                                        className="w-full rounded-lg border border-[#222f46] bg-[#0e1524] py-2 pl-9 pr-4 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30"
                                    />
                                </div>

                                {(activeNav === 'technical' || activeNav === 'behavioral') && (
                                    <button
                                        onClick={() => setExpandAll(!expandAll)}
                                        className="flex items-center gap-1.5 rounded-lg border border-[#222f46] bg-[#0e1524] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-pink-500 hover:text-pink-400"
                                    >
                                        {expandAll ? (
                                            <>
                                                <FiChevronUp /> Collapse All
                                            </>
                                        ) : (
                                            <>
                                                <FiChevronDown /> Expand All
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Tab Content: Technical Questions */}
                        {activeNav === 'technical' && (
                            <div className="space-y-4">
                                {technicalList.length === 0 ? (
                                    <div className="rounded-xl border border-[#222f46] bg-[#0e1524] p-8 text-center text-sm text-slate-400">
                                        No technical questions match your search.
                                    </div>
                                ) : (
                                    technicalList.map((item, idx) => (
                                        <QuestionCard
                                            key={idx}
                                            item={item}
                                            index={idx}
                                            defaultOpen={expandAll}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Tab Content: Behavioral Questions */}
                        {activeNav === 'behavioral' && (
                            <div className="space-y-4">
                                {behavioralList.length === 0 ? (
                                    <div className="rounded-xl border border-[#222f46] bg-[#0e1524] p-8 text-center text-sm text-slate-400">
                                        No behavioral questions match your search.
                                    </div>
                                ) : (
                                    behavioralList.map((item, idx) => (
                                        <QuestionCard
                                            key={idx}
                                            item={item}
                                            index={idx}
                                            defaultOpen={expandAll}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Tab Content: Preparation Roadmap */}
                        {activeNav === 'roadmap' && (
                            <div className="space-y-4">
                                {roadmapList.length === 0 ? (
                                    <div className="rounded-xl border border-[#222f46] bg-[#0e1524] p-8 text-center text-sm text-slate-400">
                                        No roadmap milestones match your search.
                                    </div>
                                ) : (
                                    roadmapList.map((day) => (
                                        <RoadMapDay
                                            key={day.day}
                                            day={day}
                                            completedTasks={completedTasks}
                                            onToggleTask={toggleTask}
                                        />
                                    ))
                                )}
                            </div>
                        )}

                        {/* Tab Content: Skill Gaps */}
                        {activeNav === 'skillgaps' && (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#222f46] bg-[#0e1524] p-5">
                                    <h3 className="text-base font-bold text-white mb-2">
                                        Candidate Competency Gap Breakdown
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        These gaps reflect missing or partially evident skills found when comparing your profile against the target job requirements. Prioritize high-severity topics first in your preparation schedule.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {(interviewReport.skillGaps || []).map((gap, i) => {
                                        const sev = gap.severity?.toLowerCase()
                                        const badgeStyle =
                                            sev === 'high'
                                                ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                                : sev === 'medium'
                                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                                    : 'border-sky-500/30 bg-sky-500/10 text-sky-300'

                                        return (
                                            <div
                                                key={i}
                                                className="rounded-xl border border-[#222f46] bg-[#0e1524] p-4 flex flex-col justify-between"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <span className="text-sm font-bold text-white">
                                                        {gap.skill}
                                                    </span>
                                                    <span
                                                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}
                                                    >
                                                        {gap.severity}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">
                                                    {sev === 'high'
                                                        ? 'Critical requirement for this role. Prepare in-depth conceptual and practical answers.'
                                                        : sev === 'medium'
                                                            ? 'Secondary skill or framework knowledge to review and reinforce.'
                                                            : 'Minor gap or peripheral tool mentioned in requirements.'}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sticky Sidebar (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Skill Gaps Overview Card */}
                        <div className="rounded-2xl border border-[#1e2a40] bg-[#0e1524] p-6 shadow-xl">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                    <FiTarget className="text-pink-400" />
                                    Skill Focus Areas
                                </h3>
                                <span className="text-xs font-semibold text-pink-400">
                                    {(interviewReport.skillGaps || []).length} Gaps
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(interviewReport.skillGaps || []).length === 0 ? (
                                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                                        <FiCheckCircle />
                                        <span>No high-priority gaps identified!</span>
                                    </div>
                                ) : (
                                    (interviewReport.skillGaps || []).map((gap, i) => {
                                        const sev = gap.severity?.toLowerCase()
                                        const tagClass =
                                            sev === 'high'
                                                ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                                                : sev === 'medium'
                                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                                    : 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                                        return (
                                            <span
                                                key={i}
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${tagClass}`}
                                            >
                                                {gap.skill}
                                            </span>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Interview Success Checklist */}
                        <div className="rounded-2xl border border-[#1e2a40] bg-gradient-to-br from-[#121929] to-[#0e1524] p-6 shadow-xl space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                                <FiAward className="text-pink-400" />
                                Strategy Execution Tips
                            </h3>
                            <ul className="space-y-3 text-xs text-slate-300">
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 text-pink-400 font-bold">1.</span>
                                    <span>
                                        <strong>STAR Framework:</strong> Structure behavioral answers by Situation, Task, Action, and Result.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 text-pink-400 font-bold">2.</span>
                                    <span>
                                        <strong>Explain Trade-offs:</strong> When answering technical questions, always compare alternatives and justify your approach.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="mt-0.5 text-pink-400 font-bold">3.</span>
                                    <span>
                                        <strong>Daily Milestones:</strong> Follow the day-by-day roadmap and check off tasks as you practice.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default InterviewReport