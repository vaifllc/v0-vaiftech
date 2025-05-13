"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, ArrowLeft, CalendarIcon, Clock, FileText, Check, Loader2 } from "lucide-react"
import {
  ProjectType,
  ProjectCategory,
  QuoteComplexity,
  PaymentPlanType,
  getProjectTypeName,
  getCategoryName,
  getComplexityName,
  getPaymentPlanName,
  getBasePrice,
} from "@/lib/types/quote"

// Time slots
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

export default function QuoteBuilderPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    projectType: "",
    projectCategory: "",
    complexity: "",
    paymentPlan: "",
    projectName: "",
    description: "",
    timeline: "3",
    budget: "",
    features: [] as string[],
    name: "",
    email: "",
    phone: "",
    company: "",
  })

  // Calculate total price
  const calculateTotal = () => {
    if (!formData.projectType || !formData.complexity) return 0

    const basePrice = getBasePrice(formData.projectType as ProjectType, formData.complexity as QuoteComplexity)

    // Add feature costs (you can customize this based on your feature pricing)
    const featuresPrice = formData.features.reduce((total, featureId) => {
      // This is a simplified example - you would have a more complex pricing model
      return total + 500 // Add $500 per feature
    }, 0)

    return basePrice + featuresPrice
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Update form with user data when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      // Reset features when service type changes
      if (name === "serviceType") {
        return { ...prev, [name]: value, features: [] }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, featureId] : prev.features.filter((id) => id !== featureId),
    }))
  }

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleGenerateQuote = () => {
    setGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quote builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-24 md:py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quote Builder</h1>
          <p className="text-muted-foreground">Create a custom quote for your project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Build Your Quote</CardTitle>
              <CardDescription>Follow the steps below to create a custom quote for your project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          step === currentStep
                            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                            : step < currentStep
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < currentStep ? <Check className="h-5 w-5" /> : step}
                      </div>
                      <span
                        className={`text-xs ${step === currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        {step === 1 && "Service"}
                        {step === 2 && "Features"}
                        {step === 3 && "Details"}
                        {step === 4 && "Meeting"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1 w-full bg-muted overflow-hidden rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                    style={{ width: `${(currentStep - 1) * 33.33}%` }}
                  ></div>
                </div>
              </div>

              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleSelectChange("projectType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {getProjectTypeName(type as ProjectType)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectCategory">Project Category</Label>
                    <Select
                      value={formData.projectCategory}
                      onValueChange={(value) => handleSelectChange("projectCategory", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryName(category as ProjectCategory)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complexity">Project Complexity</Label>
                    <Select
                      value={formData.complexity}
                      onValueChange={(value) => handleSelectChange("complexity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(QuoteComplexity).map((complexity) => (
                          <SelectItem key={complexity} value={complexity}>
                            {getComplexityName(complexity as QuoteComplexity)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Enter your project name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your project requirements"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Features Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Select Features</h3>
                    {formData.projectType ? (
                      <div className="space-y-4">
                        {/* {featuresByService[formData.serviceType as keyof typeof featuresByService]?.map((feature) => (
                          <div
                            key={feature.id}
                            className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={feature.id}
                                checked={formData.features.includes(feature.id)}
                                onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked as boolean)}
                              />
                              <div>
                                <Label htmlFor={feature.id} className="font-medium">
                                  {feature.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">Additional ${feature.price}</p>
                              </div>
                            </div>
                            <Badge variant="outline">${feature.price}</Badge>
                          </div>
                        ))} */}
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="feature1"
                              checked={formData.features.includes("feature1")}
                              onCheckedChange={(checked) => handleFeatureToggle("feature1", checked as boolean)}
                            />
                            <div>
                              <Label htmlFor="feature1" className="font-medium">
                                Feature 1
                              </Label>
                              <p className="text-sm text-muted-foreground">Additional $500</p>
                            </div>
                          </div>
                          <Badge variant="outline">$500</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id="feature2"
                              checked={formData.features.includes("feature2")}
                              onCheckedChange={(checked) => handleFeatureToggle("feature2", checked as boolean)}
                            />
                            <div>
                              <Label htmlFor="feature2" className="font-medium">
                                Feature 2
                              </Label>
                              <p className="text-sm text-muted-foreground">Additional $500</p>
                            </div>
                          </div>
                          <Badge variant="outline">$500</Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 border border-dashed border-border/50 rounded-lg">
                        <p className="text-muted-foreground">Please select a service type first</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Estimated Timeline (months)</Label>
                      <Select
                        value={formData.timeline}
                        onValueChange={(value) => handleSelectChange("timeline", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 month</SelectItem>
                          <SelectItem value="2">2 months</SelectItem>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5000">$1,000 - $5,000</SelectItem>
                          <SelectItem value="10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="25000">$10,000 - $25,000</SelectItem>
                          <SelectItem value="50000">$25,000 - $50,000</SelectItem>
                          <SelectItem value="100000">$50,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentPlan">Payment Plan</Label>
                    <Select
                      value={formData.paymentPlan}
                      onValueChange={(value) => handleSelectChange("paymentPlan", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentPlanType).map((plan) => (
                          <SelectItem key={plan} value={plan}>
                            {getPaymentPlanName(plan as PaymentPlanType)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Schedule Meeting */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Schedule a Consultation</h3>
                    <p className="text-muted-foreground mb-6">
                      Select a date and time for a consultation with our team to discuss your project in detail.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label>Select Date</Label>
                        <div className="border border-border/50 rounded-lg p-3">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => {
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              return date < today || date.getDay() === 0 || date.getDay() === 6
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Time</Label>
                        <div className="grid grid-cols-2 gap-2">
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

                        <div className="mt-6 p-4 border border-border/50 rounded-lg bg-card/30">
                          <h4 className="font-medium mb-2">Selected Time Slot</h4>
                          {date && selectedSlot ? (
                            <div>
                              <p className="text-sm">
                                <CalendarIcon className="h-4 w-4 inline-block mr-1" />
                                {date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="text-sm">
                                <Clock className="h-4 w-4 inline-block mr-1" />
                                {selectedSlot}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Please select a date and time</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white ml-auto"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && (!formData.projectType || !formData.projectName)) ||
                    (currentStep === 3 && (!formData.name || !formData.email))
                  }
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white ml-auto"
                  onClick={handleGenerateQuote}
                  disabled={generating || !date || !selectedSlot}
                >
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Quote
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
              <CardDescription>Estimated cost based on your selections</CardDescription>
            </CardHeader>
            <CardContent>
              {formData.projectType && formData.complexity ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Selected Project</h3>
                    <p className="text-muted-foreground">{getProjectTypeName(formData.projectType as ProjectType)}</p>
                    {formData.projectCategory && (
                      <p className="text-muted-foreground">
                        Category: {getCategoryName(formData.projectCategory as ProjectCategory)}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Complexity: {getComplexityName(formData.complexity as QuoteComplexity)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Base Price</h3>
                    <p className="text-xl font-bold">
                      ${getBasePrice(formData.projectType as ProjectType, formData.complexity as QuoteComplexity)}
                    </p>
                  </div>

                  {formData.features.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Selected Features</h3>
                      <ul className="space-y-2">
                        {formData.features.map((featureId) => (
                          <li key={featureId} className="flex justify-between">
                            <span className="text-muted-foreground">{featureId}</span>
                            <span>$500</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formData.paymentPlan && (
                    <div>
                      <h3 className="font-medium">Payment Plan</h3>
                      <p className="text-muted-foreground">
                        {getPaymentPlanName(formData.paymentPlan as PaymentPlanType)}
                      </p>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Total Estimate</h3>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                      ${calculateTotal()}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>* This is an estimate based on your selections.</p>
                    <p>* Final pricing may vary based on specific requirements.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a project type and complexity to see the estimated cost.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Generated Modal */}
      {generated && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border border-border/50 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Quote Generated Successfully!</CardTitle>
              <CardDescription>Your quote has been generated and a consultation has been scheduled.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Project Details</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Service:</span>{" "}
                    {/* {serviceTypes.find((s) => s.id === formData.serviceType)?.name} */}
                    {getProjectTypeName(formData.projectType as ProjectType)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Project Name:</span> {formData.projectName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Timeline:</span> {formData.timeline} months
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Consultation Details</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Date:</span>{" "}
                    {date?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Time:</span> {selectedSlot}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Method:</span> Video Conference (link will be sent via
                    email)
                  </p>
                </div>
              </div>

              <div className="p-4 border border-border/50 rounded-lg bg-card/30">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Total Estimate</h3>
                  <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                    ${calculateTotal()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">A detailed quote has been sent to your email address.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setGenerated(false)}>
                Close
              </Button>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                onClick={() => {
                  setGenerated(false)
                  router.push("/dashboard")
                }}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
