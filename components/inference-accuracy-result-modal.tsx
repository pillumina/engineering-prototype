'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type AccuracyTest = {
  id: string
  startTime: string
  endTime: string
  type: "inference" | "training"
  status: "success" | "failed"
  versions: {
    python: string
    openmind: string
    cann: string
    framework: {
      name: "mindspore" | "pytorch"
      version: string
    }
  }
  branch: string
  commitId: string
  baselineComparison: string
  testDetails: string
  // 新增字段
  baselineOutputTensor?: string
  testOutputTensor?: string
  taskType?: string
  metric?: string
  threshold?: string
  actualValue?: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  test: AccuracyTest
}

export function InferenceAccuracyResultModal({ isOpen, onClose, test }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>推理精度测试结果</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>测试信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">状态</p>
                  <Badge variant={test.status === "success" ? "success" : "destructive"}>
                    {test.status === "success" ? "通过" : "失败"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">任务类型</p>
                  <p>{test.taskType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Metric</p>
                  <p>{test.metric}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">阈值</p>
                  <p>{test.threshold}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">实际值</p>
                  <p>{test.actualValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tensor 输出</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium">基线输出 Tensor</p>
                  <p className="text-sm text-gray-500">{test.baselineOutputTensor || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">测试输出 Tensor</p>
                  <p className="text-sm text-gray-500">{test.testOutputTensor || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>关闭</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
