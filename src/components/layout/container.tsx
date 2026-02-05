import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  size?: 'sm' | 'default' | 'lg' | 'full'
}

export function Container({ size = 'default', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-3xl': size === 'sm',
          'max-w-7xl': size === 'default',
          'max-w-350': size === 'lg',
          'max-w-full': size === 'full',
        },
        className
      )}
      {...props}
    />
  )
}
