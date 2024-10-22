'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ExternalLink } from "lucide-react"
import { AccuracyTestHistory } from "./accuracy-test-history"
import { UsabilityTestHistory } from "./usability-test-history"
import { AccuracyTestModal } from "./accuracy-test-modal"
import { UsabilityTestModal } from "./usability-test-modal"

const modelReadme = `
# LLaMA 3

LLaMA 3 is a large language model developed by Meta AI. It builds upon the success of its predecessors, offering improved performance and capabilities.

## Key Features

- Enhanced natural language understanding
- Improved context retention
- Multilingual support
- Efficient fine-tuning for specific tasks

## Model Variants

LLaMA 3 comes in several sizes:
- LLaMA 3 7B
- LLaMA 3 13B
- LLaMA 3 33B
- LLaMA 3 65B

## Usage

To use LLaMA 3, you can load it using the Transformers library:

\`\`\`python
from transformers import AutoTokenizer, AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-7b")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-7b")

prompt = "Hello, I am a language model"
input_ids = tokenizer(prompt, return_tensors="pt").input_ids

generated_ids = model.generate(input_ids, max_length=100)
generated_text = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
print(generated_text)
\`\`\`

## License

LLaMA 3 is released under the MIT license. See the LICENSE file for more details.

## Citation

If you use LLaMA 3 in your research, please cite:

\`\`\`
@article{llama3,
  title={LLaMA 3: Large Language Model Meta AI},
  author={Meta AI Team},
  journal={arXiv preprint arXiv:2305.12345},
  year={2023}
}
\`\`\`
`

type TestStatus = 'idle' | 'testing' | 'terminated'

function TestStatusBlock({ type, status, onStart, onStop, onRestart }: { 
  type: 'accuracy' | 'usability', 
  status: TestStatus, 
  onStart: () => void, 
  onStop: () => void, 
  onRestart: () => void 
}) {
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showStopDialog, setShowStopDialog] = useState(false)

  const testInfo = {
    accuracy: {
      title: "精度测试",
      description: "评估模型输出的准确性和质量。",
      docLink: "https://example.com/accuracy-test-docs"
    },
    usability: {
      title: "可用性测试",
      description: "评估模型在实际应用场景中的表现和用户体验。",
      docLink: "https://example.com/usability-test-docs"
    }
  }[type]

  const handleStart = () => {
    setShowStartDialog(false)
    onStart()
  }

  const handleStop = () => {
    setShowStopDialog(false)
    onStop()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{testInfo.title}</CardTitle>
        <CardDescription>{testInfo.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <a href={testInfo.docLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
            查看测试文档 <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
        {status === 'idle' && (
          <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
            <DialogTrigger asChild>
              <Button>发起测试</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>发起{testInfo.title}</DialogTitle>
              </DialogHeader>
              {type === 'accuracy' ? (
                <AccuracyTestModal isOpen={showStartDialog} onClose={() => setShowStartDialog(false)} onConfirm={handleStart} />
              ) : (
                <UsabilityTestModal isOpen={showStartDialog} onClose={() => setShowStartDialog(false)} onConfirm={handleStart} />
              )}
            </DialogContent>
          </Dialog>
        )}
        {status === 'testing' && (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>测试中</AlertTitle>
              <AlertDescription>
                测试正在进行中，请稍候。
              </AlertDescription>
            </Alert>
            <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
              <DialogTrigger asChild>
                <Button className="mt-4" variant="destructive">终止测试</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>确认终止测试</DialogTitle>
                </DialogHeader>
                <p>您确定要终止当前的测试吗？这个操作无法撤销。</p>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowStopDialog(false)}>取消</Button>
                  <Button variant="destructive" onClick={handleStop}>确认终止</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
        {status === 'terminated' && (
          <>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>测试已终止</AlertTitle>
              <AlertDescription>测试已被手动终止。</AlertDescription>
            </Alert>
            <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
              <DialogTrigger asChild>
                <Button className="mt-4">重新测试</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>重新发起{testInfo.title}</DialogTitle>
                </DialogHeader>
                {type === 'accuracy' ? (
                  <AccuracyTestModal 
                    isOpen={showStartDialog} 
                    onClose={() => setShowStartDialog(false)} 
                    onConfirm={() => { setShowStartDialog(false); onRestart(); }} 
                  />
                ) : (
                  <UsabilityTestModal 
                    isOpen={showStartDialog} 
                    onClose={() => setShowStartDialog(false)} 
                    onConfirm={() => { setShowStartDialog(false); onRestart(); }} 
                  />
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ModelPage() {
  const [activeTab, setActiveTab] = useState("introduction")
  const [accuracyTestStatus, setAccuracyTestStatus] = useState<TestStatus>('idle')
  const [usabilityTestStatus, setUsabilityTestStatus] = useState<TestStatus>('idle')

  const handleAccuracyTestStart = () => {
    setAccuracyTestStatus('testing')
  }

  const handleUsabilityTestStart = () => {
    setUsabilityTestStatus('testing')
  }

  const handleTestStop = (type: 'accuracy' | 'usability') => {
    if (type === 'accuracy') {
      setAccuracyTestStatus('terminated')
    } else {
      setUsabilityTestStatus('terminated')
    }
  }

  const handleTestRestart = (type: 'accuracy' | 'usability') => {
    if (type === 'accuracy') {
      setAccuracyTestStatus('idle')
    } else {
      setUsabilityTestStatus('idle')
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">LLaMA 3 Model</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="introduction">介绍</TabsTrigger>
          <TabsTrigger value="code">代码</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
          <TabsTrigger value="tests">测试</TabsTrigger>
        </TabsList>
        <TabsContent value="introduction">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>README</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap">{modelReadme}</pre>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>模型测试</CardTitle>
                <CardDescription>发起测试和查看结果</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="accuracy">
                    <AccordionTrigger>精度测试</AccordionTrigger>
                    <AccordionContent>
                      <TestStatusBlock 
                        type="accuracy"
                        status={accuracyTestStatus}
                        onStart={handleAccuracyTestStart}
                        onStop={() => handleTestStop('accuracy')}
                        onRestart={() => handleTestRestart('accuracy')}
                      />
                      <div className="mt-4">
                        <AccuracyTestHistory />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="usability">
                    <AccordionTrigger>可用性测试</AccordionTrigger>
                    <AccordionContent>
                      <TestStatusBlock 
                        type="usability"
                        status={usabilityTestStatus}
                        onStart={handleUsabilityTestStart}
                        onStop={() => handleTestStop('usability')}
                        onRestart={() => handleTestRestart('usability')}
                      />
                      <div className="mt-4">
                        <UsabilityTestHistory />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>示例代码</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {`from transformers import AutoTokenizer, AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-7b")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-7b")

prompt = "Hello, I am a language model"
input_ids = tokenizer(prompt, return_tensors="pt").input_ids

generated_ids = model.generate(input_ids, max_length=100)
generated_text = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
print(generated_text)`}
              </pre>
              <Button className="mt-4">复制代码</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>模型设置</CardTitle>
            </CardHeader>
            <CardContent>
              <p>这里可以放置模型的各种设置选项，如超参数调整、微调选项等。</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>模型测试</CardTitle>
              <CardDescription>发起测试和查看结果</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="accuracy">
                  <AccordionTrigger>精度测试</AccordionTrigger>
                  <AccordionContent>
                    <TestStatusBlock 
                      type="accuracy"
                      status={accuracyTestStatus}
                      onStart={handleAccuracyTestStart}
                      onStop={() => handleTestStop('accuracy')}
                      onRestart={() => handleTestRestart('accuracy')}
                    />
                    <div className="mt-4">
                      <AccuracyTestHistory />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usability">
                  <AccordionTrigger>可用性测试</AccordionTrigger>
                  <AccordionContent>
                    <TestStatusBlock 
                      type="usability"
                      status={usabilityTestStatus}
                      onStart={handleUsabilityTestStart}
                      onStop={() => handleTestStop('usability')}
                      onRestart={() => handleTestRestart('usability')}
                    />
                    <div className="mt-4">
                      <UsabilityTestHistory />
                    </div>
                  </AccordionContent>
                
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
