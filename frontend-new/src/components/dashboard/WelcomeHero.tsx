import { Link } from "react-router-dom"
import { UploadCloud, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function WelcomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-6 py-5 text-white shadow-sm sm:px-8 sm:py-6">
      {/* Soft decorative glow */}
      <div className="pointer-events-none absolute -top-20 -right-16 size-60 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-60 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium text-indigo-100">Wednesday, July 10</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, Prasanna
          </h1>
          <p className="mt-1.5 line-clamp-2 text-sm text-indigo-100">
            Here&apos;s what&apos;s happening across your school today.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2.5">
          <Button
            render={<Link to="/content" />}
            className="h-10 rounded-xl bg-white px-4 text-indigo-700 hover:bg-indigo-50"
          >
            <UploadCloud className="size-4" />
            Upload content
          </Button>
          <Button
            render={<Link to="/classes" />}
            variant="outline"
            className="h-10 rounded-xl border-white/40 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white"
          >
            <Plus className="size-4" />
            Create class
          </Button>
        </div>
      </div>
    </section>
  )
}
