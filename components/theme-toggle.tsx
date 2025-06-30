
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
