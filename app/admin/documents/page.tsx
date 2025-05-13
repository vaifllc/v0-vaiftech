"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Filter, Download, Trash, Edit, Sparkles, Copy, Check, FileCheck } from "lucide-react"

// Sample templates
const documentTemplates = [
  { id: "nda", name: "Non-Disclosure Agreement", category: "Legal", createdAt: "2023-05-10" },
  { id: "contract", name: "Service Contract", category: "Legal", createdAt: "2023-05-15" },
  { id: "invoice", name: "Invoice Template", category: "Finance", createdAt: "2023-05-20" },
  { id: "proposal", name: "Project Proposal", category: "Business", createdAt: "2023-05-25" },
]

// Sample generated documents
const generatedDocuments = [
  {
    id: "doc1",
    name: "Website Development NDA - Client A",
    template: "Non-Disclosure Agreement",
    createdAt: "2023-06-01",
    status: "sent",
  },
  {
    id: "doc2",
    name: "Mobile App Development Contract - Client B",
    template: "Service Contract",
    createdAt: "2023-06-02",
    status: "signed",
  },
  {
    id: "doc3",
    name: "E-Commerce Project Proposal - Client C",
    template: "Project Proposal",
    createdAt: "2023-06-03",
    status: "draft",
  },
]

export default function AdminDocumentsPage() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Form fields for document generation
  const [formFields, setFormFields] = useState({
    documentName: "",
    clientName: "",
    projectName: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormFields((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateDocument = () => {
    setGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredTemplates = documentTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredDocuments = generatedDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.template.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Create and manage AI-generated documents</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates and documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="templates" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Generated Documents
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex-1">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate New
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{template.category}</Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{template.name}</CardTitle>
                  <CardDescription>Created on {template.createdAt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This template is used for generating {template.name.toLowerCase()} documents.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setActiveTemplate(template.id)}>
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? `No templates matching "${searchQuery}"` : "You haven't created any templates yet."}
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Generated Documents</CardTitle>
              <CardDescription>View and manage your generated documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-4 font-medium">Document Name</th>
                      <th className="text-left py-3 px-4 font-medium">Template</th>
                      <th className="text-left py-3 px-4 font-medium">Created</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b border-border/20 hover:bg-muted/20">
                        <td className="py-3 px-4">{doc.name}</td>
                        <td className="py-3 px-4">{doc.template}</td>
                        <td className="py-3 px-4">{doc.createdAt}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={doc.status === "signed" ? "default" : "outline"}
                            className={
                              doc.status === "signed" ? "bg-green-500" : doc.status === "sent" ? "bg-blue-500" : ""
                            }
                          >
                            {doc.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? `No documents matching "${searchQuery}"`
                      : "You haven't generated any documents yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Generate New Document</CardTitle>
                  <CardDescription>Fill in the details to generate a document</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="templateSelect">Select Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentName">Document Name</Label>
                    <Input
                      id="documentName"
                      name="documentName"
                      value={formFields.documentName}
                      onChange={handleInputChange}
                      placeholder="Enter document name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        name="clientName"
                        value={formFields.clientName}
                        onChange={handleInputChange}
                        placeholder="Enter client name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        name="projectName"
                        value={formFields.projectName}
                        onChange={handleInputChange}
                        placeholder="Enter project name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formFields.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formFields.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formFields.description}
                      onChange={handleInputChange}
                      placeholder="Enter project description"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    onClick={handleGenerateDocument}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Document
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>Preview of the generated document</CardDescription>
                </CardHeader>
                <CardContent>
                  {generated ? (
                    <div className="space-y-4">
                      <div className="relative border border-border/50 rounded-lg p-4 bg-card/30 min-h-[300px]">
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="icon" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="text-center mb-4">
                          <h3 className="text-lg font-bold">{formFields.documentName || "Document Title"}</h3>
                        </div>
                        <p className="mb-2">
                          <strong>Client:</strong> {formFields.clientName || "Client Name"}
                        </p>
                        <p className="mb-2">
                          <strong>Project:</strong> {formFields.projectName || "Project Name"}
                        </p>
                        <p className="mb-2">
                          <strong>Duration:</strong> {formFields.startDate || "Start Date"} to{" "}
                          {formFields.endDate || "End Date"}
                        </p>
                        <p className="mb-4">
                          <strong>Description:</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formFields.description || "Project description will appear here."}
                        </p>
                        <div className="mt-6 pt-6 border-t border-border/30">
                          <p className="text-sm text-muted-foreground">Signature fields will appear here.</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                          <FileCheck className="mr-2 h-4 w-4" />
                          Send for Signing
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Document Generated</h3>
                      <p className="text-muted-foreground mb-4">
                        Fill in the form and click "Generate Document" to preview the document here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
