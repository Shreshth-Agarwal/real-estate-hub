"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Send, User, Calendar, Package, MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface RFQ {
  id: number;
  quantity: number;
  unit: string;
  message: string;
  preferredDate: string;
  status: string;
  createdAt: string;
  consumerId: string;
  catalog?: {
    id: number;
    title: string;
    brand: string;
    price: number;
    unit: string;
    images: string[];
  };
}

export default function RFQDetailPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const rfqId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [quoteData, setQuoteData] = useState({
    price: "",
    deliveryEtaDays: "7",
    notes: "",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user && rfqId) {
      fetchRFQ();
    }
  }, [session, isPending, rfqId]);

  const fetchRFQ = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/rfq-requests/${rfqId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRfq(data);
        
        // Pre-fill with catalog price if available
        if (data.catalog?.price) {
          setQuoteData(prev => ({ ...prev, price: data.catalog.price.toString() }));
        }
      } else {
        toast.error("Failed to load RFQ details");
      }
    } catch (error) {
      console.error("Error fetching RFQ:", error);
      toast.error("Failed to load RFQ details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteData.price || parseFloat(quoteData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/rfq-requests/${rfqId}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: parseFloat(quoteData.price),
          currency: "INR",
          deliveryEtaDays: parseInt(quoteData.deliveryEtaDays),
          notes: quoteData.notes || null,
        }),
      });

      if (response.ok) {
        toast.success("Quote submitted successfully!");
        router.push("/provider/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit quote");
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user || !rfq) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/provider/dashboard" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">RFQ #{rfq.id}</h2>
            <p className="text-muted-foreground">Review the request and submit your quote</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* RFQ Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Customer requirements and specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rfq.catalog && (
                  <div>
                    <Label className="text-muted-foreground">Product</Label>
                    <div className="flex items-center gap-3 mt-2">
                      {rfq.catalog.images && rfq.catalog.images.length > 0 && (
                        <img
                          src={rfq.catalog.images[0]}
                          alt={rfq.catalog.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{rfq.catalog.title}</p>
                        <p className="text-sm text-muted-foreground">{rfq.catalog.brand}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Quantity
                    </Label>
                    <p className="font-semibold mt-1">
                      {rfq.quantity} {rfq.unit}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Needed By
                    </Label>
                    <p className="font-semibold mt-1">
                      {rfq.preferredDate ? new Date(rfq.preferredDate).toLocaleDateString() : "Flexible"}
                    </p>
                  </div>
                </div>

                {rfq.message && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Additional Notes
                      </Label>
                      <p className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                        {rfq.message}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={rfq.status === 'submitted' ? 'default' : 'secondary'}>
                    {rfq.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Requested On</Label>
                  <p className="text-sm">{new Date(rfq.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quote Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Quote</CardTitle>
                <CardDescription>Provide your best offer to win this order</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Your Price (₹ per {rfq.unit}) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={quoteData.price}
                      onChange={(e) => setQuoteData({ ...quoteData, price: e.target.value })}
                      required
                    />
                    {rfq.catalog?.price && (
                      <p className="text-xs text-muted-foreground">
                        Catalog price: ₹{rfq.catalog.price}/{rfq.unit}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryEta">
                      Delivery Time (days) *
                    </Label>
                    <Input
                      id="deliveryEta"
                      type="number"
                      min="1"
                      value={quoteData.deliveryEtaDays}
                      onChange={(e) => setQuoteData({ ...quoteData, deliveryEtaDays: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      How many days to deliver after order confirmation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Payment terms, delivery conditions, warranties, etc."
                      value={quoteData.notes}
                      onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <Separator />

                  {/* Total Calculation */}
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Unit Price:</span>
                      <span className="font-medium">₹{quoteData.price || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{rfq.quantity} {rfq.unit}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Quote:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{quoteData.price ? (parseFloat(quoteData.price) * rfq.quantity).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Quote
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    The customer will be notified immediately and can compare your quote with others
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tips Card */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-500">💡</span>
                Tips to Win This Order
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Competitive pricing:</strong> Research market rates and offer the best value</li>
                <li>• <strong>Quick delivery:</strong> Faster delivery times often win orders</li>
                <li>• <strong>Clear terms:</strong> Mention payment terms, warranties, and any special offers</li>
                <li>• <strong>Professional tone:</strong> Use clear, business-appropriate language</li>
                <li>• <strong>Response time:</strong> First responders have 40% higher win rates</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
