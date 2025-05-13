"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowRight, Sparkles, Copy, Check, Save } from "lucide-react"

export default function PromptCreator() {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [temperature, setTemperature] = useState([0.7])
  const [useAdvanced, setUseAdvanced] = useState(false)
  const [generatedResult, setGeneratedResult] = useState("")

  // Sample result for demonstration
  const sampleResult = `Creating a responsive e-commerce product page with the following features:

1. High-quality product image gallery with zoom functionality
2. Product details section with customizable options
3. Add to cart button with quantity selector
4. Related products carousel
5. Customer reviews section with star ratings
6. Mobile-optimized layout with touch-friendly controls

The design should follow modern e-commerce best practices with a clean, minimalist aesthetic that puts the focus on the product. Include subtle animations for user interactions to enhance the shopping experience.`

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult || sampleResult)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    setGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedResult(sampleResult)
      setGenerating(false)
    }, 1500)
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Prompt Creator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What do you want to create?</label>
              <Textarea
                placeholder="Design a responsive e-commerce product page with..."
                className="min-h-[150px] bg-card/30 border-border/50"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="advanced-mode" checked={useAdvanced} onCheckedChange={setUseAdvanced} />
              <Label htmlFor="advanced-mode">Advanced Options</Label>
            </div>

            {useAdvanced && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature: {temperature[0]}</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onValueChange={setTemperature}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values produce more focused results, higher values more creative ones.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context</Label>
                  <Input
                    id="context"
                    placeholder="Target audience, specific requirements, etc."
                    className="bg-card/30 border-border/50"
                  />
                </div>
              </div>
            )}

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
                  Generate Prompt
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="result">
            <div className="relative">
              <div className="p-4 rounded-lg bg-card/30 border border-border/50 min-h-[250px]">
                <p className="whitespace-pre-line">{generatedResult || sampleResult}</p>
              </div>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-border/50 pt-4">
        <Button variant="outline" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Prompt
        </Button>
        <Button variant="ghost" size="sm" className="text-primary">
          View Examples
          <ArrowRight className="ml-2 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
