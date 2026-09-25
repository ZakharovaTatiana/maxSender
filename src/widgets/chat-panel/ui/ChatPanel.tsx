export function ChatPanel() {
  return (
    <section className="min-w-0 flex-1 border-r border-slate-200 bg-white px-4 py-6 sm:w-96 sm:flex-none sm:px-5">
      <h1 className="text-2xl font-bold tracking-tight text-slate-950">Чаты</h1>

      <label className="relative mt-5 block">
        <span className="sr-only">Найти по номеру телефона</span>
        <svg
          aria-hidden="true"
          className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m15.5 15.5 4 4" />
        </svg>
        <input
          className="h-12 w-full rounded-2xl bg-slate-100 pr-4 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3478f6]"
          inputMode="tel"
          name="phoneSearch"
          placeholder="Найти по номеру телефона"
          type="search"
        />
      </label>
    </section>
  );
}
