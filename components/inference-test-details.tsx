'use client'

import { useState } from 'react'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

type InferenceTest = {
  id: string
  status: "success" | "failed"
  testDetails: {
    baselineTensor: number[][]
    currentTensor: number[][]
    taskType: string
    metric: string
    metricValue: number
    threshold: {
      operator: string
      value: number
    }
  }
}

function TensorDialog({ tensor, title }: { tensor: number[][], title: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">查看 {title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Tensor 的具体数值如下：
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[300px] overflow-auto">
          {tensor.map((row, i) => (
            <div key={i} className="grid grid-cols-5 items-center gap-4">
              {row.map((value, j) => (
                <div key={j} className="text-sm">
                  {value.toFixed(4)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary">关闭</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function InferenceTestDetails({ test }: { test?: InferenceTest }) {
  if (!test) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>无法加载推理测试详情。测试数据不存在。</AlertDescription>
      </Alert>
    )
  }

  const { testDetails, status } = test
  const { baselineTensor, currentTensor, taskType, metric, metricValue, threshold } = testDetails

  if (!baselineTensor || !currentTensor || !taskType || !metric || typeof metricValue !== 'number' || !threshold) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>无法加载推理测试详情。请确保数据格式正确。</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>推理精度测试详情</DialogTitle>
      </DialogHeader>
      <Card>
        <CardHeader>
          <CardTitle>Tensor 信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <TensorDialog tensor={baselineTensor} title="基线 Tensor" />
            <TensorDialog tensor={currentTensor} title="当前测试 Tensor" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>测试结果</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">任务类型</dt>
              <dd>{taskType}</dd>
            </div>
            <div>
              <dt className="font-medium">Metric</dt>
              <dd>{metric}</dd>
            </div>
            <div>
              <dt className="font-medium">Metric 计算值</dt>
              <dd>{metricValue.toFixed(4)}</dd>
            </div>
            <div>
              <dt className="font-medium">阈值</dt>
              <dd>{`${threshold.operator} ${threshold.value}`}</dd>
            </div>
            <div>
              <dt className="font-medium">测试结果</dt>
              <dd className={status === "success" ? "text-green-600" : "text-red-600"}>
                {status === "success" ? "通过" : "失败"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}