"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, ShoppingBag, Clock, ArrowRight, FileCheck } from "lucide-react"
import Link from "next/link"

// Sample data for demonstration
const recentPurchases = [
  {
    id: "p1",
    name: "E-Commerce Starter Kit",
    date: "2023-05-15",
    price: 149,
    status: "completed",
  },
  {
    id: "p2",
    name: "AI Chatbot Framework",
    date: "2023-06-02",
    price: 99,
    status: "completed",
  },
]

const upcomingMeetings = [
  {
    id: "m1",
    title: "Project Discussion",
    date: "2023-06-10",
    time: "10:00 AM",
    with: "Sarah Johnson",
  },
  {
    id: "m2",
    title: "Technical Support",
    date: "2023-06-15",
    time: "2:30 PM",
    with: "Michael Chen",
  },
]

const recentDocuments = [
  {
    id: "d1",
    name: "Website Development Contract",
    date: "2023-05-20",
    status: "signed",
  },
  {
    id: "d2",
    name: "Mobile App Development Proposal",
    date: "2023-06-05",
    status: "pending",
  },
]

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-24 md:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's an overview of your activity and purchases</p>
        </div>
        <div className="flex gap-4">
          <Link href="/quote-builder">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Create Quote
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline">View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
              Purchases
            </CardTitle>
            <CardDescription>Your recent purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex justify-between items-center border-b border-border/30 pb-3">
                  <div>
                    <p className="font-medium">{purchase.name}</p>
                    <p className="text-sm text-muted-foreground">{purchase.date}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-2">${purchase.price}</span>
                    <Button size="icon" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {recentPurchases.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No purchases yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Meetings
            </CardTitle>
            <CardDescription>Your upcoming meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex justify-between items-center border-b border-border/30 pb-3">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.date} at {meeting.time}
                    </p>
                    <p className="text-xs text-muted-foreground">with {meeting.with}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Upcoming
                    </Badge>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No upcoming meetings</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Documents
            </CardTitle>
            <CardDescription>Your recent documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((document) => (
                <div key={document.id} className="flex justify-between items-center border-b border-border/30 pb-3">
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">{document.date}</p>
                  </div>
                  <div>
                    <Badge
                      variant={document.status === "signed" ? "default" : "outline"}
                      className={document.status === "signed" ? "bg-green-500" : ""}
                    >
                      {document.status === "signed" ? (
                        <>
                          <FileCheck className="mr-1 h-3 w-3" /> Signed
                        </>
                      ) : (
                        "Pending"
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentDocuments.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No documents yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchases" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="purchases" className="flex-1">
            <ShoppingBag className="mr-2 h-4 w-4" />
            All Purchases
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            All Documents
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            All Meetings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>View all your purchases and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-border/30 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{purchase.name}</h3>
                      <p className="text-sm text-muted-foreground">Purchased on {purchase.date}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <span className="font-bold mr-4">${purchase.price}</span>
                      <Button size="sm" variant="outline" className="mr-2">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {recentPurchases.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't made any purchases yet.</p>
                    <Link href="#products">
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                        Browse Products
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Document History</CardTitle>
              <CardDescription>View all your documents and contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-border/30 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                      <p className="text-sm text-muted-foreground">Created on {document.date}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Badge
                        variant={document.status === "signed" ? "default" : "outline"}
                        className={`mr-4 ${document.status === "signed" ? "bg-green-500" : ""}`}
                      >
                        {document.status === "signed" ? (
                          <>
                            <FileCheck className="mr-1 h-3 w-3" /> Signed
                          </>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                      <Button size="sm" variant="outline" className="mr-2">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
                {recentDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't created any documents yet.</p>
                    <Link href="/quote-builder">
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                        Create Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Meeting Schedule</CardTitle>
              <CardDescription>View all your upcoming and past meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-border/30 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {meeting.date} at {meeting.time}
                      </p>
                      <p className="text-xs text-muted-foreground">with {meeting.with}</p>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Badge variant="outline" className="mr-4 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        Upcoming
                      </Badge>
                      <Button size="sm" variant="outline" className="mr-2">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-500">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
                {upcomingMeetings.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
                    <p className="text-muted-foreground mb-4">You don't have any upcoming meetings.</p>
                    <Link href="/quote-builder">
                      <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                        Schedule Meeting
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
