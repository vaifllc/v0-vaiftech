import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeEditor from "@/components/code-editor"
import PromptCreator from "@/components/prompt-creator"
import { ArrowLeft, Code, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AITools() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Development Tools</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Accelerate your development workflow with our suite of AI-powered tools. Generate code, create prompts, and
          more with just a few clicks.
        </p>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="code" className="flex-1">
            <Code className="h-4 w-4 mr-2" />
            Code Generator
          </TabsTrigger>
          <TabsTrigger value="prompt" className="flex-1">
            <Sparkles className="h-4 w-4 mr-2" />
            Prompt Creator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <div className="max-w-4xl mx-auto">
            <CodeEditor />
          </div>
        </TabsContent>
        <TabsContent value="prompt">
          <div className="max-w-4xl mx-auto">
            <PromptCreator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
