"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Code, Copy, Check, Sparkles } from "lucide-react"

export default function CodeEditor() {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  // Sample code for demonstration
  const sampleCode = `// Generated React component
import React, { useState } from 'react';

export default function ProductCard({ title, price, image }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="rounded-lg overflow-hidden shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={image || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">\${price}</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Add to Cart
        </button>
      </div>
    </div>
  );
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode || sampleCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    setGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedCode(sampleCode)
      setGenerating(false)
    }, 1500)
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-5 w-5 mr-2 text-primary" />
          AI Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="prompt">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe what you want to create:</label>
              <Textarea
                placeholder="Create a React component for a product card with hover effects..."
                className="min-h-[200px] bg-card/30 border-border/50"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Code
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="code">
            <div className="relative">
              <pre className="p-4 rounded-lg bg-card/30 border border-border/50 overflow-auto max-h-[400px] text-sm">
                <code className="text-foreground">{generatedCode || sampleCode}</code>
              </pre>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border/50 pt-4">
        <div className="text-xs text-muted-foreground">Powered by AI technology</div>
        <Button variant="ghost" size="sm" className="text-primary">
          View Documentation
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
