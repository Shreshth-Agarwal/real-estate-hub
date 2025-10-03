"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, FileText, Phone, Building, TrendingUp, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const cities = [
  {
    code: "DL",
    name: "Delhi",
    region: "National Capital Region",
    description: "India's capital and a major real estate hub with diverse residential and commercial opportunities.",
  },
  {
    code: "MH",
    name: "Mumbai",
    region: "Maharashtra",
    description: "Financial capital with premium real estate and high-rise developments.",
  },
  {
    code: "BLR",
    name: "Bangalore",
    region: "Karnataka",
    description: "IT hub with growing residential and commercial real estate demand.",
  },
  {
    code: "JPR",
    name: "Jaipur",
    region: "Rajasthan",
    description: "Pink City with heritage properties and emerging modern developments.",
  },
];

const cityInsights = {
  DL: {
    masterplan: "Delhi Master Plan 2041 focuses on sustainable urban development, transit-oriented development, and affordable housing.",
    schemes: [
      "PM Awas Yojana",
      "Smart City Mission",
      "Pradhan Mantri Adarsh Gram Yojana",
    ],
    upcomingProjects: [
      "Dwarka Expressway Development",
      "Delhi-Meerut RRTS Corridor",
      "Aerocity Extension",
    ],
    govContacts: [
      { dept: "DDA (Delhi Development Authority)", phone: "011-23760031", email: "dda@delhi.gov.in" },
      { dept: "Municipal Corporation of Delhi", phone: "1800-11-0093", email: "mcd@delhi.gov.in" },
    ],
    utilitySteps: {
      propertyRegistration: [
        "Visit Sub-Registrar office with documents",
        "Pay stamp duty (4-6% of property value for men, 4% for women)",
        "Submit sale deed and ID proofs",
        "Biometric verification",
        "Receive registered documents in 7-15 days",
      ],
      landConversion: [
        "Obtain NOC from Agriculture Department",
        "Submit application to SDM",
        "Pay conversion fee (10-50% of land value)",
        "Get approval from District Collector",
        "Update land records at Tehsil",
      ],
    },
  },
  // Add more cities as needed
};

export default function CityInsightsPage() {
  const [selectedCity, setSelectedCity] = useState("DL");

  const insights = cityInsights[selectedCity as keyof typeof cityInsights] || cityInsights.DL;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold">Hub4Estate</h1>
            </Link>
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">City Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Municipal masterplans, government schemes, and essential information for every city
          </p>
        </motion.div>

        {/* City Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Select City</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{city.name}</span>
                        <span className="text-xs text-muted-foreground">({city.region})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>

        {/* City Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Master Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle>Master Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insights.masterplan}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Government Schemes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Government Schemes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.schemes.map((scheme, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span className="text-sm">{scheme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Projects */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Upcoming Projects</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.upcomingProjects.map((project, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="text-sm">{project}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Government Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <CardTitle>Government Contacts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.govContacts.map((contact, idx) => (
                    <div key={idx} className="pb-4 border-b last:border-0">
                      <p className="font-medium text-sm mb-2">{contact.dept}</p>
                      <p className="text-xs text-muted-foreground">📞 {contact.phone}</p>
                      <p className="text-xs text-muted-foreground">✉️ {contact.email}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Utility Procedures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <CardTitle>Common Procedures</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Property Registration */}
                  <div>
                    <h3 className="font-semibold mb-3">Property Registration</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {insights.utilitySteps.propertyRegistration.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="font-medium text-primary">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Land Conversion */}
                  <div>
                    <h3 className="font-semibold mb-3">Land Conversion</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      {insights.utilitySteps.landConversion.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="font-medium text-primary">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Need More Help?</h3>
              <p className="text-muted-foreground mb-4">
                Ask HubAI for personalized guidance on any property-related question
              </p>
              <Button size="lg">Ask HubAI Assistant</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}