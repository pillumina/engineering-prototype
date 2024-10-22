'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Plus, Loader2, FileText, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'

type InferenceBaseline = {
  name: string
  inputTensorFile: string
  outputTensorFile: string
  inputTensorData?: string
  outputTensorData?: string
  metric: string
  threshold: {
    operator: '>' | '<' | '>=' | '<='
    value: number
  }
  task: string
}

type TrainingBaseline = {
  name: string
  dataset: string
  datasetId: string
  lossFile: string
  lossData?: Array<{ step: number, loss: number }>
}

export function ModelBaselineComponent() {
  const [inferenceBaselines, setInferenceBaselines] = useState<InferenceBaseline[]>([
    { 
      name: "English-French Translation Baseline",
      inputTensorFile: "en_fr_input.pt", 
      outputTensorFile: "en_fr_output.pt",
      inputTensorData: "Tensor(['Hello, how are you?', 'The weather is nice today.'])",
      outputTensorData: "Tensor(['Bonjour, comment allez-vous?', 'Le temps est beau aujourd'hui.'])",
      metric: "BLEU",
      threshold: { operator: ">=", value: 30 },
      task: "Translation"
    },
    { 
      name: "Sentiment Analysis Baseline",
      inputTensorFile: "sentiment_input.pt", 
      outputTensorFile: "sentiment_output.pt",
      inputTensorData: "Tensor(['I love this product!', 'This movie was terrible.'])",
      outputTensorData: "Tensor([0.95, 0.05])",
      metric: "Accuracy",
      threshold: { operator: ">", value: 0.8 },
      task: "Text Classification"
    },
    { 
      name: "Text Summarization Baseline",
      inputTensorFile: "summary_input.pt", 
      outputTensorFile: "summary_output.pt",
      inputTensorData: "Tensor(['Long article text...'])",
      outputTensorData: "Tensor(['Concise summary...'])",
      metric: "ROUGE-L",
      threshold: { operator: ">=", value: 0.4 },
      task: "Text Generation"
    },
  ])
  const [trainingBaselines, setTrainingBaselines] = useState<TrainingBaseline[]>([
    { 
      name: "Training 1", 
      dataset: "ImageNet", 
      datasetId: "imagenet-1k",
      lossFile: "loss_train1.jsonl",
      lossData: [
        { step: 0, loss: 2.3 },
        { step: 100, loss: 1.8 },
        { step: 200, loss: 1.5 },
        { step: 300, loss: 1.2 },
      ]
    },
    { 
      name: "Training 2", 
      dataset: "CIFAR-10", 
      datasetId: "cifar10",
      lossFile: "loss_train2.jsonl",
      lossData: [
        { step: 0, loss: 2.1 },
        { step: 100, loss: 1.7 },
        { step: 200, loss: 1.4 },
        { step: 300, loss: 1.1 },
      ]
    },
  ])
  const [uploading, setUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadType, setUploadType] = useState<'inference' | 'training'>('inference')
  const { toast } = useToast()

  const handleUpload = (type: 'inference' | 'training') => {
    setUploadType(type)
    setUploadDialogOpen(true)
  }

  const handleSubmitUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false)
      setUploadDialogOpen(false)
      
      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string

      if (uploadType === 'inference') {
        const inputFile = formData.get('inputTensorFile') as File
        const outputFile = formData.get('outputTensorFile') as File
        const metric = formData.get('metric') as string
        const thresholdOperator = formData.get('thresholdOperator') as '>' | '<' | '>=' | '<='
        const thresholdValue = parseFloat(formData.get('thresholdValue') as string)
        const task = formData.get('task') as string

        setInferenceBaselines([...inferenceBaselines, { 
          name, 
          inputTensorFile: inputFile.name, 
          outputTensorFile: outputFile.name,
          inputTensorData: "Tensor([[...]])",
          outputTensorData: "Tensor([...])",
          metric,
          threshold: { operator: thresholdOperator, value: thresholdValue },
          task
        }])
      } else {
        const dataset = formData.get('dataset') as string
        const lossFile = formData.get('lossFile') as File
        setTrainingBaselines([...trainingBaselines, { 
          name, 
          dataset, 
          datasetId: dataset.toLowerCase().replace(' ', '-'),
          lossFile: lossFile.name,
          lossData: [
            { step: 0, loss: 2.0 },
            { step: 100, loss: 1.5 },
            { step: 200, loss: 1.0 },
          ]
        }])
      }

      toast({
        title: "Baseline uploaded successfully",
        description: `New ${uploadType} baseline has been added.`,
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="inference" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inference">Inference Baselines</TabsTrigger>
          <TabsTrigger value="training">Training Baselines</TabsTrigger>
        </TabsList>
        <TabsContent value="inference">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Input Tensor</TableHead>
                  <TableHead>Output Tensor</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Task</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inferenceBaselines.map((baseline, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{baseline.name}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            {baseline.inputTensorFile}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Input Tensor Details</DialogTitle>
                            <DialogDescription>
                              File: {baseline.inputTensorFile}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <pre className="rounded-md bg-slate-950 p-4 text-white">
                              {baseline.inputTensorData}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            {baseline.outputTensorFile}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Output Tensor Details</DialogTitle>
                            <DialogDescription>
                              File: {baseline.outputTensorFile}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <pre className="rounded-md bg-slate-950 p-4 text-white">
                              {baseline.outputTensorData}
                            </pre>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>{baseline.metric}</TableCell>
                    <TableCell>{baseline.threshold.operator} {baseline.threshold.value}</TableCell>
                    <TableCell>{baseline.task}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Button onClick={() => handleUpload('inference')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Inference Baseline
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="training">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Loss File</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingBaselines.map((baseline, index) => (
                  <TableRow key={index}>
                    <TableCell>{baseline.name}</TableCell>
                    <TableCell>
                      <Link href={`/datasets/${baseline.datasetId}`} className="flex items-center hover:underline">
                        {baseline.dataset}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            {baseline.lossFile}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Loss Data</DialogTitle>
                            <DialogDescription>
                              File: {baseline.lossFile}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Step</TableHead>
                                  <TableHead>Loss</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {baseline.lossData?.map((data, i) => (
                                  <TableRow key={i}>
                                    <TableCell>{data.step}</TableCell>
                                    <TableCell>{data.loss.toFixed(4)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Button onClick={() => handleUpload('training')}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Training Baseline
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload New {uploadType === 'inference' ? 'Inference' : 'Training'} Baseline</DialogTitle>
            <DialogDescription>
              Fill in the details and upload the required files for the new baseline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpload}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              {uploadType === 'inference' ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="inputTensorFile" className="text-right">
                      Input Tensor
                    </Label>
                    <Input id="inputTensorFile" name="inputTensorFile" type="file" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="outputTensorFile" className="text-right">
                      Output Tensor
                    </Label>
                    <Input id="outputTensorFile" name="outputTensorFile" type="file" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    
                    <Label htmlFor="metric" className="text-right">
                      Metric
                    </Label>
                    <Input id="metric" name="metric" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="thresholdOperator" className="text-right">
                      Threshold
                    </Label>
                    <Select name="thresholdOperator" defaultValue=">">
                      <SelectTrigger className="w-[60px]">
                        <SelectValue placeholder=">" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">{'>'}</SelectItem>
                        <SelectItem value="<">{'<'}</SelectItem>
                        <SelectItem value=">=">{'>='}</SelectItem>
                        <SelectItem value="<=">{'<='}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="thresholdValue" name="thresholdValue" type="number" step="0.01" className="col-span-2" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="task" className="text-right">
                      Task
                    </Label>
                    <Input id="task" name="task" className="col-span-3" required />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dataset" className="text-right">
                      Dataset
                    </Label>
                    <Input id="dataset" name="dataset" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lossFile" className="text-right">
                      Loss File
                    </Label>
                    <Input id="lossFile" name="lossFile" type="file" className="col-span-3" required />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}