'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type TestType = "inference" | "training"

type BaselineInfo = {
  inputTensor?: string
  taskType: string
  metric: string
  threshold: string
  dataset?: string
  lossFile?: string
}

const baselineOptions: Record<string, BaselineInfo> = {
  baseline1: {
    inputTensor: "input_tensor_1.pt",
    taskType: "文本分类",
    metric: "相对误差",
    threshold: "<=0.01",
    dataset: "squad",
    lossFile: "loss_output_1.jsonl",
  },
  baseline2: {
    inputTensor: "input_tensor_2.pt",
    taskType: "图像文本生成",
    metric: "BLEU",
    threshold: ">=0.9",
    dataset: "coco",
    lossFile: "loss_output_2.jsonl",
  },
  baseline3: {
    inputTensor: "input_tensor_3.pt",
    taskType: "翻译",
    metric: "BLEU",
    threshold: ">=0.9",
    dataset: "wmt14",
    lossFile: "loss_output_3.jsonl",
  },
}

const taskTypeOptions = [
  { value: "text-classification", label: "文本分类", metric: "相对误差", threshold: "<=0.01" },
  { value: "image-text-generation", label: "图像文本生成", metric: "BLEU", threshold: ">=0.9" },
  { value: "translation", label: "翻译", metric: "BLEU", threshold: ">=0.9" },
]

export function AccuracyTestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [testType, setTestType] = useState<TestType>("inference")
  const [runAsBaseline, setRunAsBaseline] = useState(false)
  const [selectedBaseline, setSelectedBaseline] = useState<string>("")
  const [pythonVersion, setPythonVersion] = useState<string>("")
  const [openmindVersion, setOpenmindVersion] = useState<string>("")
  const [pytorchVersion, setPytorchVersion] = useState<string>("")
  const [cannVersion, setCannVersion] = useState<string>("")
  const [inputTensorFile, setInputTensorFile] = useState<File | null>(null)
  const [taskType, setTaskType] = useState<string>("")
  const [metric, setMetric] = useState<string>("")
  const [threshold, setThreshold] = useState<string>("")
  const [dataset] = useState<string>("")

  useEffect(() => {
    const selectedTask = taskTypeOptions.find(option => option.value === taskType)
    if (selectedTask) {
      setMetric(selectedTask.metric)
      setThreshold(selectedTask.threshold)
    }
  }, [taskType])

  const handleConfirm = () => {
    console.log("Accuracy Test configuration:", {
      testType,
      runAsBaseline,
      selectedBaseline,
      pythonVersion,
      openmindVersion,
      pytorchVersion,
      cannVersion,
      inputTensorFile: inputTensorFile?.name,
      taskType,
      metric,
      threshold,
      dataset,
    })
    onClose()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setInputTensorFile(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>发起精度测试</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">测试类型</label>
              
              <div className="flex space-x-2">
                {["推理", "训练"].map((type) => (
                  <Button
                    key={type}
                    variant={testType === (type === "推理" ? "inference" : "training") ? "default" : "outline"}
                    onClick={() => setTestType(type === "推理" ? "inference" : "training")}
                    className="flex-1"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="run-as-baseline"
                checked={runAsBaseline}
                onCheckedChange={setRunAsBaseline}
              />
              <Label htmlFor="run-as-baseline" className="text-sm font-medium">
                作为基线运行
              </Label>
            </div>
          </div>
          {!runAsBaseline && (
            <div className="space-y-1">
              <label htmlFor="baseline" className="text-sm font-medium">选择基线</label>
              <Select onValueChange={setSelectedBaseline} value={selectedBaseline}>
                <SelectTrigger id="baseline">
                  <SelectValue placeholder="选择基线" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline1">基线 1</SelectItem>
                  <SelectItem value="baseline2">基线 2</SelectItem>
                  <SelectItem value="baseline3">基线 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="python-version" className="text-sm font-medium">Python</label>
              <Select onValueChange={setPythonVersion} value={pythonVersion}>
                <SelectTrigger id="python-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.7">3.7</SelectItem>
                  <SelectItem value="3.8">3.8</SelectItem>
                  <SelectItem value="3.9">3.9</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="openmind-version" className="text-sm font-medium">Openmind</label>
              <Select onValueChange={setOpenmindVersion} value={openmindVersion}>
                <SelectTrigger id="openmind-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0</SelectItem>
                  <SelectItem value="1.1">1.1</SelectItem>
                  <SelectItem value="1.2">1.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="pytorch-version" className="text-sm font-medium">PyTorch</label>
              <Select onValueChange={setPytorchVersion} value={pytorchVersion}>
                <SelectTrigger id="pytorch-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.8">1.8</SelectItem>
                  <SelectItem value="1.9">1.9</SelectItem>
                  <SelectItem value="1.10">1.10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="cann-version" className="text-sm font-medium">CANN</label>
              <Select onValueChange={setCannVersion} value={cannVersion}>
                <SelectTrigger id="cann-version">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5.0">5.0</SelectItem>
                  <SelectItem value="5.1">5.1</SelectItem>
                  <SelectItem value="5.2">5.2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {(runAsBaseline || selectedBaseline) && (
            <Card>
              <CardHeader>
                <CardTitle>{runAsBaseline ? "基线设置" : "基线信息"}</CardTitle>
              </CardHeader>
              <CardContent>
                {testType === "inference" && (
                  <>
                    <div className="space-y-1 mb-4">
                      <Label htmlFor="input-tensor" className="text-sm font-medium">输入 Tensor 文件</Label>
                      {runAsBaseline ? (
                        <Input id="input-tensor" type="file" onChange={handleFileChange} accept=".pt" />
                      ) : (
                        <Input id="input-tensor" value={baselineOptions[selectedBaseline]?.inputTensor} readOnly />
                      )}
                    </div>
                    <div className="space-y-1 mb-4">
                      <Label htmlFor="task-type" className="text-sm font-medium">任务类型</Label>
                      {runAsBaseline ? (
                        <Select onValueChange={setTaskType} value={taskType}>
                          <SelectTrigger id="task-type">
                            <SelectValue placeholder="选择任务类型" />
                          </SelectTrigger>
                          <SelectContent>
                            {taskTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input id="task-type" value={baselineOptions[selectedBaseline]?.taskType} readOnly />
                      )}
                    </div>
                    <div className="space-y-1 mb-4">
                      <Label htmlFor="metric" className="text-sm font-medium">Metric</Label>
                      <Input id="metric" value={runAsBaseline ? metric : baselineOptions[selectedBaseline]?.metric} readOnly />
                    </div>
                    <div className="space-y-1 mb-4">
                      <Label htmlFor="threshold" className="text-sm font-medium">阈值</Label>
                      <Input id="threshold" value={runAsBaseline ? threshold : baselineOptions[selectedBaseline]?.threshold} readOnly />
                    </div>
                  </>
                )}
                {testType === "training" && (
                  <>
                    <div className="space-y-1 mb-4">
                      <Label htmlFor="dataset" className="text-sm font-medium">关联数据集</Label>
                      <Input id="dataset" value={runAsBaseline ? dataset : baselineOptions[selectedBaseline]?.dataset} readOnly={!runAsBaseline} />
                    </div>
                    {!runAsBaseline && (
                      <div className="space-y-1 mb-4">
                        <Label htmlFor="loss-file" className="text-sm font-medium">Loss 文件</Label>
                        <Input id="loss-file" value={baselineOptions[selectedBaseline]?.lossFile} readOnly />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
