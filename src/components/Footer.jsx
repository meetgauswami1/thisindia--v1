import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-12 border-t border-orange-100 bg-orange-50/70 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>ThisIndia – Discover the Real India through hidden destinations and AI-powered travel planning.</p>
        <div className="flex items-center gap-4 font-semibold">
          <Link to="/about-us" className="hover:text-primary">About</Link>
          {/* <a href="#" className="hover:text-primary">Contact</a> */}
          {/* <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a> */}
          {/* <a href="#" className="hover:text-primary">Project Info</a> */}
        </div>
        <p>© {new Date().getFullYear()} ThisIndia</p>
      </div>
    </footer>
  )
}

export default Footer
