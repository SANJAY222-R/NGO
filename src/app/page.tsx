import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Turn Surplus into <span className="text-emerald-600 dark:text-emerald-400">Smiles</span>.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          The unified platform connecting generous food donors with verified NGOs and volunteers to facilitate rapid recovery and redistribution of surplus food.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/donor">
            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all h-14 px-8 text-lg rounded-full">
              I want to Donate Food
            </Button>
          </Link>
          <Link href="/signin">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all h-14 px-8 text-lg rounded-full">
              NGO / Volunteer Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
