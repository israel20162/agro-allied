import type { SVGProps } from 'react'

type CopyButtonProps = SVGProps<SVGSVGElement> & {
    onClick: () => void
    label?: string
}

export default function CopyButton({ onClick, label = 'Copy', ...props }: CopyButtonProps) {
    return (
        <button type="button" onClick={onClick} aria-label={label} title={label}>
            <svg className="w-6 h-6 !text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" {...props}>
                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z" />
            </svg>

        </button>
    )
}