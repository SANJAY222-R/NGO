"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Clock, History, MapPin } from "lucide-react";

export default function DonorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/food-posts");
      const json = await res.json();
      if (res.ok) setHistory(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      title: formData.get("title"),
      description: formData.get("description") + (formData.get("pickupInstructions") ? `\n\nPickup Instructions: ${formData.get("pickupInstructions")}` : ""),
      quantity: formData.get("quantity"),
      foodType: formData.get("foodType"),
      expiryDate: formData.get("expiryDate"),
      address: formData.get("address"),
    };

    try {
      const res = await fetch("/api/food-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create post");
      }

      toast.success("Food Post created successfully!");
      form.reset();
      fetchHistory(); // Refresh history
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Quick Stats
  const activePosts = history.filter((p) => p.status === "AVAILABLE" || p.status === "RESERVED").length;
  const totalMeals = history.length; // Simply counting posts for this demo

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Donate Food
              </CardTitle>
              <CardDescription>Create a new food post to notify nearby NGOs.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input id="title" name="title" placeholder="e.g., 50 boxes of fresh veggies" required className="bg-white dark:bg-zinc-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodType">Food Type</Label>
                    <Select name="foodType" required>
                      <SelectTrigger className="bg-white dark:bg-zinc-800">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COOKED">Cooked Meal</SelectItem>
                        <SelectItem value="RAW">Raw Ingredients</SelectItem>
                        <SelectItem value="PACKAGED">Packaged Goods</SelectItem>
                        <SelectItem value="PRODUCE">Fresh Produce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" name="quantity" placeholder="e.g., 50 meals / 20 kg" required className="bg-white dark:bg-zinc-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Time</Label>
                  <Input id="expiryDate" name="expiryDate" type="datetime-local" required className="bg-white dark:bg-zinc-800" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description & Dietary Notes</Label>
                  <Textarea id="description" name="description" placeholder="Any special notes like allergies, handling instructions..." className="bg-white dark:bg-zinc-800" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address</Label>
                  <Input id="address" name="address" placeholder="123 Main St, City" required className="bg-white dark:bg-zinc-800" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupInstructions">Detailed Pickup Instructions</Label>
                  <Input id="pickupInstructions" name="pickupInstructions" placeholder="e.g. Leave at front desk, use side entrance..." className="bg-white dark:bg-zinc-800" />
                </div>

                <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white" disabled={loading}>
                  {loading ? "Posting..." : "Create Food Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-emerald-600 to-emerald-900 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-emerald-100">Total Donations</span>
                <span className="text-2xl font-bold">{totalMeals}</span>
              </div>
              <div className="flex justify-between items-center py-2 mt-2">
                <span className="text-emerald-100">Active Posts</span>
                <span className="text-2xl font-bold">{activePosts}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5"/> Donation History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-500">No previous donations.</p>
              ) : (
                history.map((post) => (
                  <div key={post.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm border">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        post.status === 'AVAILABLE' ? 'bg-amber-100 text-amber-700' :
                        post.status === 'RESERVED' ? 'bg-blue-100 text-blue-700' :
                        'bg-zinc-200 text-zinc-700'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="text-zinc-500 flex flex-col gap-1 mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {post.address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
