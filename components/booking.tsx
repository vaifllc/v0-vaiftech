"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, Users, ArrowRight, Check } from "lucide-react"

// Time slots
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

// Meeting types
const meetingTypes = [
  { id: "consultation", name: "Initial Consultation", duration: "30 min" },
  { id: "project", name: "Project Discussion", duration: "45 min" },
  { id: "technical", name: "Technical Support", duration: "60 min" },
  { id: "demo", name: "Product Demo", duration: "45 min" },
]

export default function Booking() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [meetingType, setMeetingType] = useState<string>("consultation")

  return (
    <section id="booking" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 border border-primary/20 w-fit mb-6">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Easy Scheduling</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Book a Meeting with Our{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                Experts
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Schedule a consultation, project discussion, or technical support session with our team of experts.
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Why book a meeting?</h3>
                <div className="space-y-4">
                  {[
                    "Get personalized advice for your specific needs",
                    "Discuss project requirements and timelines",
                    "Receive technical support for your products",
                    "Learn more about our services and solutions",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-4 shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-purple-400 to-indigo-600"
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">200+</span> meetings booked this month
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle>Schedule a Meeting</CardTitle>
                <CardDescription>Select a date, time, and meeting type to book your session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Type</label>
                  <Select value={meetingType} onValueChange={setMeetingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{type.name}</span>
                            <span className="text-xs text-muted-foreground">{type.duration}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <div className="border border-border/50 rounded-lg p-3 bg-card/30">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0 || date.getDay() === 6
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedSlot === slot ? "default" : "outline"}
                        className={`text-sm ${
                          selectedSlot === slot ? "bg-gradient-to-r from-purple-500 to-indigo-600" : ""
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>You can invite up to 5 team members</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                  disabled={!date || !selectedSlot || !meetingType}
                >
                  Confirm Booking
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
