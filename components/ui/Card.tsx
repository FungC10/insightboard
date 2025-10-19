import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Card({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'md' 
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl shadow-lg border border-gray-100'
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1 transition-all duration-300' : ''
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  )
}