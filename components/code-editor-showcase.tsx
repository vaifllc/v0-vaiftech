"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Code, Copy, Check, Sparkles, Terminal, Play, MessageSquare } from "lucide-react"

export default function CodeEditorShowcase() {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI coding assistant. How can I help you build your website or app today?",
    },
  ])
  const [userInput, setUserInput] = useState("")

  // Sample code for demonstration
  const sampleCode = `// React component for a responsive navbar
import React, { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold">VAIF TECH</div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a href="#" className="px-3 py-2 rounded-md hover:bg-white/10">Home</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-white/10">Services</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-white/10">Products</a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-white/10">Contact</a>
              <button className="ml-4 px-4 py-2 rounded-md bg-white text-indigo-600 font-medium">
                Get Started
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10">Home</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10">Services</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10">Products</a>
            <a href="#" className="block px-3 py-2 rounded-md hover:bg-white/10">Contact</a>
            <button className="mt-2 w-full px-4 py-2 rounded-md bg-white text-indigo-600 font-medium">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    setGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false)
      setActiveTab("preview")
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    // Add user message
    const newMessages = [...messages, { role: "user", content: userInput }]
    setMessages(newMessages)
    setUserInput("")

    // Simulate AI response after a delay
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I can help you build that! Let me create a component for you. Would you like to see a responsive design with modern styling?",
        },
      ])
    }, 1000)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1 border border-primary/20 w-fit mb-6">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Development</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Build Your Digital Presence with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-indigo-600">
                AI-Assisted Coding
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Our AI coding assistant helps you build websites and applications faster. Describe what you want to
              create, and watch as our AI generates the code for you.
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-medium">How it works</h3>
                <div className="space-y-4">
                  {[
                    "Describe what you want to build in natural language",
                    "Our AI generates the code based on your requirements",
                    "Preview the result in real-time and make adjustments",
                    "Download the code or deploy directly to your project",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-4 shrink-0">
                        <span className="text-sm font-medium text-primary">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white">
                Try It Now
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="font-medium">AI Code Assistant</span>
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  ))}
                </div>
              </div>

              <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="editor">
                    <Code className="h-4 w-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="space-y-4">
                  <div className="h-[300px] overflow-y-auto border border-border/50 rounded-md p-3 bg-card/30 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Describe what you want to build..."
                      className="min-h-[60px] resize-none"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-600" onClick={handleSendMessage}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="editor" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Describe what you want to create:</label>
                    <Textarea
                      placeholder="Create a responsive navbar with a logo, navigation links, and a call-to-action button..."
                      className="min-h-[100px] bg-card/30 border-border/50"
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

                <TabsContent value="preview">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-card/30 border border-border/50 overflow-auto max-h-[300px] text-sm">
                      <code className="text-foreground">{sampleCode}</code>
                    </pre>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("editor")}>
                      <Code className="h-4 w-4 mr-2" />
                      Edit Prompt
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Run Code
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
