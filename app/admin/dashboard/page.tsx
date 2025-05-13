"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  LineChart,
  Users,
  ShoppingBag,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Sample data for demonstration
const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", date: "2023-06-01", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", date: "2023-06-02", status: "active" },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", date: "2023-06-03", status: "pending" },
]

const recentOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "E-Commerce Starter Kit",
    amount: 149,
    date: "2023-06-01",
    status: "completed",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "AI Chatbot Framework",
    amount: 99,
    date: "2023-06-02",
    status: "completed",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    product: "Mobile App Development",
    amount: 179,
    date: "2023-06-03",
    status: "pending",
  },
]

const upcomingMeetings = [
  { id: 1, title: "Project Discussion", customer: "John Doe", date: "2023-06-10", time: "10:00 AM" },
  { id: 2, title: "Technical Support", customer: "Jane Smith", date: "2023-06-15", time: "2:30 PM" },
]

export default function AdminDashboardPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the VAIF TECH admin dashboard</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$24,560</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">1,245</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">845</h3>
                <div className="flex items-center mt-1 text-green-500 text-sm">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+5.7%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">Conversion Rate</p>
                <h3 className="text-2xl font-bold mt-1">3.2%</h3>
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  <span>-0.5%</span>
                </div>
              </div>
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex justify-between items-start border-b border-border/30 pb-3">
                  <div>
                    <p className="font-medium">{meeting.title}</p>
                    <p className="text-sm text-muted-foreground">with {meeting.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {meeting.date} at {meeting.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No upcoming meetings</p>
              )}
              <Button variant="outline" className="w-full mt-2">
                View All Meetings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="orders" className="flex-1">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Recent Orders
          </TabsTrigger>
          <TabsTrigger value="users" className="flex-1">
            <Users className="mr-2 h-4 w-4" />
            Recent Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-4 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Product</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/20 hover:bg-muted/20">
                        <td className="py-3 px-4">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.product}</td>
                        <td className="py-3 px-4">${order.amount}</td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={order.status === "completed" ? "default" : "outline"}
                            className={order.status === "completed" ? "bg-green-500" : ""}
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  View All Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/20 hover:bg-muted/20">
                        <td className="py-3 px-4">{user.id}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.date}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={user.status === "active" ? "default" : "outline"}
                            className={user.status === "active" ? "bg-green-500" : ""}
                          >
                            {user.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center mt-6">
                <Button variant="outline">
                  View All Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
