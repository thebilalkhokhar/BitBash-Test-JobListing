import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getJobs, getJob, createJob, updateJob, deleteJob, triggerScrape } from './services/jobService'
import JobCard from './components/JobCard'
import JobForm from './components/JobForm'
import FilterBar from './components/FilterBar'
import Pagination from './components/Pagination'
import JobDetails from './components/JobDetails'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function useDebouncedValue(value, delay = 400) {
	const [debounced, setDebounced] = useState(value)
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay)
		return () => clearTimeout(id)
	}, [value, delay])
	return debounced
}

function SkeletonCard() {
	return (
		<div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm animate-pulse">
			<div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
			<div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
			<div className="h-3 bg-gray-200 rounded w-1/5"></div>
		</div>
	)
}

export default function App() {
	const [filters, setFilters] = useState({ q: '', location: '', job_type: '', sort: 'posting_date_desc' })
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [jobs, setJobs] = useState([])
	const [totalPages, setTotalPages] = useState(1)
	const [modalOpen, setModalOpen] = useState(false)
	const [editingJob, setEditingJob] = useState(null)
	const [viewOpen, setViewOpen] = useState(false)
	const [viewJob, setViewJob] = useState(null)
	const [scraping, setScraping] = useState(false)

	const debounced = useDebouncedValue(filters, 400)

	const queryParams = useMemo(() => ({ ...debounced, page, limit }), [debounced, page, limit])

	async function loadJobs() {
		setLoading(true)
		setError('')
		try {
			const res = await getJobs(queryParams)
			setJobs(res.data)
			setTotalPages(res.totalPages || 1)
		} catch (err) {
			const msg = err?.response?.data?.message || 'Failed to load jobs'
			setError(msg)
			toast.error(msg)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		setPage(1)
	}, [debounced.q, debounced.location, debounced.job_type, debounced.sort])

	useEffect(() => {
		loadJobs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, debounced])

	function openCreate() {
		setEditingJob(null)
		setModalOpen(true)
	}

	function openEdit(job) {
		setEditingJob(job)
		setModalOpen(true)
	}

	function openView(job) {
		setViewJob(job)
		setViewOpen(true)
	}

	async function handleDelete(job) {
		if (!window.confirm('Delete this job?')) return
		try {
			await deleteJob(job._id)
			toast.success('Deleted')
			loadJobs()
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Delete failed')
		}
	}

	async function handleSubmit(payload) {
		try {
			if (editingJob) {
				await updateJob(editingJob._id, payload)
				toast.success('Updated')
			} else {
				await createJob(payload)
				toast.success('Created')
			}
			setModalOpen(false)
			setEditingJob(null)
			loadJobs()
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Save failed')
		}
	}

	async function handleFetchLatest() {
		const token = import.meta.env.VITE_SCRAPE_SECRET || '';
		if (!token) {
			toast.error('Missing VITE_SCRAPE_SECRET in client env');
			return;
		}
		try {
			setScraping(true)
			toast.info('Scraping started…');
			await triggerScrape(token)
			toast.success('Scraping complete');
			loadJobs()
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Scraping failed')
		} finally {
			setScraping(false)
		}
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<ToastContainer position="top-right" />
			<header className="border-b border-gray-200 bg-white">
				<div className="max-w-6xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-8">
					<h1 className="text-3xl font-bold text-gray-900 tracking-tight">Job Listings</h1>
					<p className="text-gray-600 mt-1">Browse, filter, and manage job postings.</p>
				</div>
			</header>

			<main className="max-w-6xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-6">
				<div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/80 backdrop-blur border-b border-gray-200">
					<FilterBar filters={filters} onChange={setFilters} onCreate={openCreate} onFetch={handleFetchLatest} />
				</div>

				{loading && (
					<div className="mt-2">
						{Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
					</div>
				)}
				{!loading && error && <p className="text-rose-600">{error}</p>}
				{!loading && !error && jobs.length === 0 && (
					<div className="mt-8 text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-700 mb-3">📭</div>
						<h3 className="text-gray-900 text-lg font-medium">No jobs found</h3>
						<p className="text-gray-600">Try adjusting your filters or add a new job.</p>
					</div>
				)}
				<div className="mt-2">
					{!loading && jobs.map(job => (
						<JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} onView={openView} />
					))}
				</div>
				<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
			</main>

			{modalOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 transition-opacity">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-[fadeIn_200ms_ease-out]">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold text-gray-900">{editingJob ? 'Edit Job' : 'New Job'}</h3>
							<button className="text-gray-500 hover:text-gray-700 transition" onClick={() => { setModalOpen(false); setEditingJob(null); }}>✕</button>
						</div>
						<JobForm initialJob={editingJob} onCancel={() => { setModalOpen(false); setEditingJob(null); }} onSubmit={handleSubmit} />
					</div>
				</div>
			)}

			{viewOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 transition-opacity">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-[fadeIn_200ms_ease-out]">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-semibold text-gray-900">Job Details</h3>
							<button className="text-gray-500 hover:text-gray-700 transition" onClick={() => { setViewOpen(false); setViewJob(null); }}>✕</button>
						</div>
						<JobDetails job={viewJob} />
					</div>
				</div>
			)}
		</div>
	)
}
