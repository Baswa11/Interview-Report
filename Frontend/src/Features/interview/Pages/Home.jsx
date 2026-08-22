import { useRef, useState } from 'react'
import {
  FiBriefcase,
  FiInfo,
  FiStar,
  FiUploadCloud,
  FiUser,
  FiLogOut,
  FiAlertCircle,
  FiFileText
} from 'react-icons/fi'
import { useInterview } from '../hook/useInterview.js'
import { useAuth } from '../../auth/Hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [resumeName, setResumeName] = useState('')
  const { loading, generateReport } = useInterview()
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [error, setError] = useState('')
  const resumeInputRef = useRef(null)

  const handleGenerateReport = async () => {
    setError('')
    const resumeFile = resumeInputRef.current?.files?.[0]

    if (!jobDescription.trim()) {
      setError('Please provide a target job description.')
      return
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError('Please upload a resume or provide a quick self-description.')
      return
    }

    try {
      const data = await generateReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resume: resumeFile,
      })

      if (data?.interviewReport?._id) {
        navigate(`/interview/${data.interviewReport._id}`, {
          state: { interviewReport: data.interviewReport },
        })
      } else {
        setError('Failed to generate report. Please try again.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Error generating interview report. Please try again.')
    }
  }

  const onLogout = async () => {
    try {
      await handleLogout()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-[#090d13] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-[#2b3444] bg-[#121820] px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600/20 text-pink-500 border border-pink-500/30">
              <FiFileText className="text-lg" />
            </span>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white leading-tight">
                Interview Prep AI
              </h1>
              <p className="text-[11px] text-slate-400">Personalized Strategy Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-[#1d2435] border border-[#2a3346] px-3 py-1.5 rounded-full">
                <FiUser className="text-pink-400" />
                <span>{user.username || user.email}</span>
              </span>
            )}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-lg border border-[#2a3346] bg-[#1d2435] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-pink-500 hover:text-pink-400"
              title="Logout"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-8 flex items-center justify-center">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleGenerateReport()
          }}
          className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#2b3444] bg-[#121820] shadow-2xl shadow-black/30"
        >
          {error && (
            <div className="mx-6 mt-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 sm:mx-7">
              <FiAlertCircle className="shrink-0 text-lg" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2">
            <section className="border-b border-[#2b3444] p-6 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-xl text-pink-500" />
                  <h2 className="text-base font-bold sm:text-lg">
                    Target Job Description
                  </h2>
                </div>

                <span className="rounded-md border border-pink-500/20 bg-pink-500/15 px-2.5 py-1 text-[11px] font-bold uppercase text-pink-500">
                  Required
                </span>
              </div>

              <div className="relative">
                <label
                  htmlFor="jobDescription"
                  className="sr-only"
                >
                  Target job description
                </label>

                <textarea
                  onChange={(event) => setJobDescription(event.target.value)}
                  value={jobDescription}
                  id="jobDescription"
                  name="jobDescription"
                  required
                  maxLength={5000}
                  rows={17}
                  placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  className="min-h-[360px] w-full resize-none rounded-lg border border-[#2a3346] bg-[#1d2435] px-4 py-4 text-sm leading-6 outline-none placeholder:text-slate-400/80 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 sm:min-h-[410px]"
                />

                <span className="pointer-events-none absolute bottom-3 right-3 text-xs text-slate-400">
                  {jobDescription.length} / 5000 chars
                </span>
              </div>
            </section>

            <section className="p-6 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <FiUser className="text-xl text-pink-500" />
                <h2 className="text-base font-bold sm:text-lg">Your Profile</h2>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label htmlFor="resume" className="text-sm font-semibold">
                    Upload Resume
                  </label>
                  <span className="rounded-md border border-pink-500/20 bg-pink-500/15 px-2 py-1 text-[10px] font-bold uppercase text-pink-500">
                    Best results
                  </span>
                </div>

                <label
                  htmlFor="resume"
                  className="flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#3b455b] bg-[#1d2435] px-4 text-center transition hover:border-pink-500 hover:bg-[#222b40]"
                >
                  <FiUploadCloud className="mb-3 text-3xl text-pink-500" />
                  <span className="text-sm font-semibold">
                    Click to upload or drag &amp; drop
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    PDF (Max 3MB)
                  </span>

                  {resumeName && (
                    <span className="mt-2 max-w-full truncate text-xs text-pink-400">
                      {resumeName}
                    </span>
                  )}
                </label>

                <input
                  className="sr-only"
                  type="file"
                  id="resume"
                  name="resume"
                  accept="application/pdf"
                  ref={resumeInputRef}
                  onChange={(event) => setResumeName(event.target.files?.[0]?.name || '')}
                />
              </div>

              <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-[#303a4b]" />
                OR
                <span className="h-px flex-1 bg-[#303a4b]" />
              </div>

              <div>
                <label
                  htmlFor="selfDescription"
                  className="mb-2 block text-sm font-semibold"
                >
                  Quick Self-Description
                </label>

                <textarea
                  onChange={(event) => setSelfDescription(event.target.value)}
                  value={selfDescription}
                  id="selfDescription"
                  name="selfDescription"
                  rows={4}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  className="w-full resize-none rounded-lg border border-[#2a3346] bg-[#1d2435] px-4 py-3.5 text-sm leading-6 outline-none placeholder:text-slate-400/80 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div className="mt-4 flex gap-3 rounded-lg border border-blue-400/20 bg-[#1b3158]/60 px-4 py-3 text-xs leading-5 text-blue-200">
                <FiInfo className="mt-0.5 shrink-0 text-blue-400 text-sm" />
                <p>
                  Either a <strong className="text-white">Resume</strong> or a{' '}
                  <strong className="text-white">Self Description</strong> is
                  required to generate a personalized plan.
                </p>
              </div>
            </section>
          </div>

          <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#2b3444] px-6 py-4 sm:flex-row sm:px-7">
            <p className="text-xs text-slate-400">
              AI-Powered Strategy Generation
              <span className="mx-1 text-slate-600">•</span>
              Approx 30s
            </p>

            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-pink-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-950/30 transition hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400 sm:w-auto"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <FiStar />
                  Generate My Interview Strategy
                </>
              )}
            </button>
          </footer>
        </form>
      </main>
    </div>
  )
}

export default Home