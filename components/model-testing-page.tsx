'use client'

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "lucide-react"
import { UsabilityTestModal } from "./usability-test-modal"
import { AccuracyTestModal } from "./accuracy-test-modal"
import { UsabilityTestHistory } from "./usability-test-history"
import { AccuracyTestHistory } from "./accuracy-test-history"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ModelTestingPageComponent() {
  const [isUsabilityModalOpen, setIsUsabilityModalOpen] = useState(false)
  const [isAccuracyModalOpen, setIsAccuracyModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStartTest = (testType: 'usability' | 'accuracy') => {
    if (testType === 'usability') {
      setIsUsabilityModalOpen(true)
    } else {
      setIsAccuracyModalOpen(true)
    }
    setError(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Model Testing</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="model-testing">
          <AccordionTrigger>模型测试</AccordionTrigger>
          <AccordionContent>
            <Tabs defaultValue="usability" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="usability">可用性测试</TabsTrigger>
                <TabsTrigger value="accuracy">精度测试</TabsTrigger>
                <TabsTrigger value="performance">性能测试</TabsTrigger>
              </TabsList>
              <TabsContent value="usability" className="mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Test the usability of the model</p>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => handleStartTest('usability')}>发起测试</Button>
                    <a href="#" className="text-blue-500 hover:text-blue-700">
                      <ExternalLinkIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="accuracy" className="mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Test the accuracy of the model</p>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => handleStartTest('accuracy')}>发起测试</Button>
                    <a href="#" className="text-blue-500 hover:text-blue-700">
                      <ExternalLinkIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Test the performance of the model</p>
                  <div className="flex items-center space-x-2">
                    <Button>发起测试</Button>
                    <a href="#" className="text-blue-500 hover:text-blue-700">
                      <ExternalLinkIcon className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="test-history">
          <AccordionTrigger>测试历史</AccordionTrigger>
          <AccordionContent>
            <Tabs defaultValue="usability-history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="usability-history">可用性测试历史</TabsTrigger>
                <TabsTrigger value="accuracy-history">精度测试历史</TabsTrigger>
              </TabsList>
              <TabsContent value="usability-history" className="mt-4">
                <UsabilityTestHistory />
              </TabsContent>
              <TabsContent value="accuracy-history" className="mt-4">
                <AccuracyTestHistory />
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <UsabilityTestModal isOpen={isUsabilityModalOpen} onClose={() => setIsUsabilityModalOpen(false)} />
      <AccuracyTestModal isOpen={isAccuracyModalOpen} onClose={() => setIsAccuracyModalOpen(false)} />
    </div>
  )
}
