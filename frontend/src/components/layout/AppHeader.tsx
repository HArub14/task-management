export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-2">
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-lg font-semibold text-primary">TaskManagement</span>
      </div>
    </header>
  )
}
