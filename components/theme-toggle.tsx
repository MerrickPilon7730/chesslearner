
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

// This component toggles between light and dark themes
export function ThemeToggle() {
  // Current theme
  const { theme, setTheme } = useTheme()
  // Ensures that the component only renders after hydration on the client
  const [mounted, setMounted] = useState(false)

  // After component is mounted set to true (client-side)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration errors by rendering nothing until component is mounted
  if (!mounted) return null;

  return (
    <div
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="hover:cursor-pointer"
    >
      {theme === 'dark' ? <FaSun size={30} className='hover:text-yellow-300' /> : <FaMoon size={30} className='hover:text-yellow-300'/>}
    </div>
  );
};
