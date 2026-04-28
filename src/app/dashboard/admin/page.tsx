"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Clock, Users, Package, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the Impact chart since we don't have historical metrics tracking implemented yet
const impactData = [
  { name: 'Jan', meals: 400, wasteDiverted: 240 },
  { name: 'Feb', meals: 300, wasteDiverted: 139 },
  { name: 'Mar', meals: 200, wasteDiverted: 980 },
  { name: 'Apr', meals: 278, wasteDiverted: 390 },
  { name: 'May', meals: 189, wasteDiverted: 480 },
  { name: 'Jun', meals: 239, wasteDiverted: 380 },
  { name: 'Jul', meals: 349, wasteDiverted: 430 },
];

export default function AdminDashboard() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNgos = async () => {
    try {
      const res = await fetch("/api/admin/ngos");
      const json = await res.json();
      if (res.ok) setNgos(json.data);
    } catch (err) {
      toast.error("Failed to fetch NGOs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const handleVerify = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/ngos/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      toast.success(`NGO ${status.toLowerCase()} successfully.`);
      fetchNgos();
    } catch (err) {
      toast.error("Error updating NGO status.");
    }
  };

  const pendingNgos = ngos.filter((n) => n.verificationStatus === "PENDING").length;

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-2">Platform Oversight</h1>
      <p className="text-zinc-500 mb-8">System analytics and NGO verification.</p>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-blue-100">Total NGOs</h3>
              <Users className="text-blue-200 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">{ngos.length}</p>
            <p className="text-sm mt-2 text-blue-200">SDG 11: Sustainable Cities</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-emerald-100">Meals Rescued</h3>
              <Package className="text-emerald-200 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">1,955</p>
            <p className="text-sm mt-2 text-emerald-200">SDG 2: Zero Hunger</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-orange-100">Waste Diverted (kg)</h3>
              <TrendingUp className="text-orange-200 w-6 h-6" />
            </div>
            <p className="text-4xl font-bold">3,039</p>
            <p className="text-sm mt-2 text-orange-200">SDG 12: Responsible Consumption</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recharts Impact Graph */}
        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
          <CardHeader>
            <CardTitle>Impact Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="meals" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Meals Rescued" />
                <Line type="monotone" dataKey="wasteDiverted" stroke="#3b82f6" strokeWidth={3} name="Waste Diverted (kg)" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" opacity={0.2} />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#666'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#666'}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Verification Queue */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80 overflow-hidden flex flex-col">
          <CardHeader className="bg-zinc-50 dark:bg-zinc-950/50 border-b">
            <CardTitle className="flex justify-between items-center text-lg">
              Verification Queue
              {pendingNgos > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingNgos} Pending</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : ngos.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">No NGOs registered yet.</div>
            ) : (
              <div className="divide-y">
                {ngos.map((ngo) => (
                  <div key={ngo.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{ngo.organizationName || ngo.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{ngo.email}</p>
                        
                        <div className="mt-2">
                          {ngo.verificationStatus === "PENDING" && <span className="inline-flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200"><Clock className="w-3 h-3 mr-1"/> Pending Review</span>}
                          {ngo.verificationStatus === "VERIFIED" && <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Verified</span>}
                          {ngo.verificationStatus === "REJECTED" && <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200"><XCircle className="w-3 h-3 mr-1"/> Rejected</span>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {ngo.verificationStatus === "PENDING" && (
                          <>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-7 text-xs" onClick={() => handleVerify(ngo.id, "VERIFIED")}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 h-7 text-xs" onClick={() => handleVerify(ngo.id, "REJECTED")}>
                              Reject
                            </Button>
                          </>
                        )}
                        {ngo.verificationStatus === "VERIFIED" && (
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 text-xs" onClick={() => handleVerify(ngo.id, "REJECTED")}>
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
