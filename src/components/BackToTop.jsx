import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 left-4 z-50 rounded-full p-3
        bg-orange-500 text-white shadow-lg
        hover:bg-orange-600 transition-all duration-300
        md:bottom-8 md:left-6"
    >
      <FiArrowUp size={20} />
    </button>
  ) : null
}

export default BackToTop