import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Home,
  Menu,
  X,
  Compass,
  BookOpen,
  Mail,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-stone-100 sticky top-0 z-50 text-gray-900 shadow-sm shadow-gray-400">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-2xl font-bold flex items-center">
            <Link to="/" className="flex items-center gap-1.5 group">
              <Compass className="w-7 h-7 text-lime-600 group-hover:rotate-12 transition-transform" />
              <div className="flex gap-1.5">
                <span className="bg-linear-to-r from-lime-600 to-lime-500 bg-clip-text text-transparent">
                  Compass
                </span>
                <span className="text-stone-900">Coaching</span>
              </div>
            </Link>
          </h1>
        </div>

        <Link
          to="/contact"
          className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors font-medium flex items-center gap-2"
          activeProps={{
            className: 'px-4 py-2 rounded-lg bg-lime-400/60 transition-colors font-medium flex items-center gap-2',
          }}
        >
          <Mail size={20} className="hidden sm:block" />
          <span>Contact</span>
        </Link>
      </header>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-stone-200 text-gray-900 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'shadow-xl shadow-gray-950 translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-300">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-stone-300 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-300 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-lime-400/60 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/intake"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-300 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-lime-400/60 transition-colors mb-2',
            }}
          >
            <Compass size={20} />
            <span className="font-medium">Get Started</span>
          </Link>

          <Link
            to="/resources"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-300 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-lime-400/60 transition-colors mb-2',
            }}
          >
            <BookOpen size={20} />
            <span className="font-medium">Resources</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

