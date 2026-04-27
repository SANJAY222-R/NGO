import Link from "next/link";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function DonorDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-8 transition-colors duration-300">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            Welcome back, {session?.user?.name || "Donor"}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your food donations and track your impact.
          </p>
        </div>
        <div className="flex gap-4">
          <form action={async () => {
            "use server";
            const { signOut } = await import("../../auth");
            await signOut({ redirectTo: "/signin" });
          }}>
            <Button type="submit" variant="ghost" className="text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              Sign Out
            </Button>
          </form>
          <Button variant="outline">View Impact Report</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all">
            + New Food Post
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="col-span-2">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-2xl font-semibold mb-6">Recent Donations</h2>
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className="font-semibold text-lg">50 Hot Meals</h3>
                  <p className="text-sm text-zinc-500">Cooked Food • Expires in 2 hours</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-sm font-medium">
                  Reserved by NGO
                </span>
              </div>
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className="font-semibold text-lg">20 kg Fresh Vegetables</h3>
                  <p className="text-sm text-zinc-500">Raw Produce • Expires in 2 days</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Your Impact</h2>
            <div className="my-6">
              <p className="text-4xl font-bold">1,250</p>
              <p className="text-emerald-100 font-medium mt-1">Meals Donated This Month</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>CO2 Saved</span>
                <span className="font-semibold">300 kg</span>
              </div>
              <div className="flex justify-between">
                <span>NGOs Helped</span>
                <span className="font-semibold">5</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
