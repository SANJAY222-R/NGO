"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Clock, Package, CheckSquare } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function NgoDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [myClaims, setMyClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"FEED" | "CLAIMS">("FEED");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/food-posts?status=AVAILABLE");
      const json = await res.json();
      if (res.ok) setPosts(json.data);
    } catch (err) {
      toast.error("Failed to fetch available donations.");
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await fetch("/api/claims");
      const json = await res.json();
      if (res.ok) setMyClaims(json.data);
    } catch (err) {
      toast.error("Failed to fetch claims.");
    } finally {
      setLoading(false);
    }
  };

  const loadData = () => {
    fetchPosts();
    fetchClaims();
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async (id: string) => {
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodPostId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim");

      toast.success("Donation successfully claimed! Please pick it up soon.");
      loadData();
      setActiveTab("CLAIMS");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleComplete = async (claimId: string) => {
    try {
      const res = await fetch(`/api/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to mark as picked up");
      }
      toast.success("Pickup completed! Thank you.");
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">NGO Operations</h1>
          <p className="text-zinc-500">Monitor active donations and manage your pickups.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "FEED" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700"}`}
            onClick={() => setActiveTab("FEED")}
          >
            Live Feed & Map
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "CLAIMS" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-700"}`}
            onClick={() => setActiveTab("CLAIMS")}
          >
            My Logistics
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : activeTab === "FEED" ? (
        <div className="space-y-8">
          <div className="w-full bg-white dark:bg-zinc-900 p-2 rounded-xl shadow-lg border">
            {/* The Interactive Map */}
            <MapComponent posts={posts} onClaim={handleClaim} />
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Available Donations ({posts.length})</h3>
            {posts.length === 0 ? (
              <Card className="bg-zinc-50 dark:bg-zinc-900 border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Package className="w-12 h-12 text-zinc-400 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No donations available</h3>
                  <p className="text-zinc-500 mt-2">Please check back later.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="flex flex-col border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-zinc-900 dark:text-zinc-100">{post.title}</CardTitle>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold rounded-full">
                          {post.foodType}
                        </span>
                      </div>
                      <CardDescription className="flex items-center gap-1 mt-2 text-zinc-600 dark:text-zinc-400">
                        <MapPin className="w-4 h-4 text-emerald-500" /> {post.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                          <span>Quantity:</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.quantity}</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                          <span>Expires:</span>
                          <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                            <Clock className="w-4 h-4" /> {new Date(post.expiryDate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-6 pt-0 mt-auto">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleClaim(post.id)}>
                        Claim Donation
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Active Pickups ({myClaims.filter(c => c.status === "PENDING").length})</h3>
          {myClaims.length === 0 ? (
             <p className="text-zinc-500">You have no active claims.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myClaims.map((claim) => (
                <Card key={claim.id} className="border-0 shadow-md">
                  <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        {claim.foodPost?.title}
                        <span className={`text-xs px-2 py-1 rounded-full ${claim.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {claim.status === 'PENDING' ? 'Awaiting Pickup' : 'Completed'}
                        </span>
                      </h4>
                      <p className="text-sm text-zinc-500 mt-2 mb-4">{claim.foodPost?.description || "No description provided."}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-400 block mb-1">Type</span>
                          <span className="font-medium">{claim.foodPost?.foodType}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block mb-1">Quantity</span>
                          <span className="font-medium">{claim.foodPost?.quantity}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block mb-1">Address</span>
                          <span className="font-medium">{claim.foodPost?.address}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block mb-1">Claimed At</span>
                          <span className="font-medium">{new Date(claim.claimedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    {claim.status === "PENDING" && (
                      <Button onClick={() => handleComplete(claim.id)} className="w-full md:w-auto h-12 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5"/> Mark Picked Up
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
