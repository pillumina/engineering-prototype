'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type TrainingTest = {
  id: string
  status: "success" | "failed"
  testDetails: {
    baselineLossCurve: number[]
    currentLossCurve: number[]
    lossRelativeError: number
    threshold: {
      operator: string
      value: number
    }
    dataset: string
  }
}

function sampleData(data: number[], sampleSize: number): number[] {
  const step = Math.floor(data.length / sampleSize)
  return Array.from({ length: sampleSize }, (_, i) => data[i * step])
}

function downloadLossFile(data: number[], filename: string) {
  const content = data.map((value, index) => `${index},${value}`).join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function TrainingTestDetails({ test }: { test?: TrainingTest }) {
  if (!test) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>无法加载训练测试详情。测试数据不存在。</AlertDescription>
      </Alert>
    )
  }

  const { testDetails, status } = test
  const { baselineLossCurve, currentLossCurve, lossRelativeError, threshold, dataset } = testDetails

  const chartData = useMemo(() => {
    if (!Array.isArray(baselineLossCurve) || !Array.isArray(currentLossCurve)) {
      return []
    }
    const sampleSize = 100 // 选择100个样本点
    const sampledBaseline = sampleData(baselineLossCurve.slice(0, 5000), sampleSize)
    const sampledCurrent = sampleData(currentLossCurve.slice(0, 5000), sampleSize)
    
    return sampledBaseline.map((baseline, index) => ({
      step: index * (5000 / sampleSize),
      baseline,
      current: sampledCurrent[index],
    }))
  }, [baselineLossCurve, currentLossCurve])

  if (!chartData.length) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>无法加载训练测试详情。请确保数据格式正确。</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>训练精度测试详情</DialogTitle>
      </DialogHeader>
      <Card>
        <CardHeader>
          <CardTitle>Loss 曲线对比</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="step" 
                label={{ value: 'Steps', position: 'insideBottomRight', offset: -10 }}
              />
              <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="#8884d8" name="基线 Loss" dot={false} />
              <Line type="monotone" dataKey="current" stroke="#82ca9d" name="当前测试 Loss" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>测试结果</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="font-medium">Loss 相对误差</dt>
              <dd>{lossRelativeError.toFixed(4)}</dd>
            </div>
            <div>
              <dt className="font-medium">阈值</dt>
              <dd>{`${threshold.operator} ${threshold.value}`}</dd>
            </div>
            <div>
              <dt className="font-medium">关联数据集</dt>
              <dd>{dataset}</dd>
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
      <Card>
        <CardHeader>
          <CardTitle>下载 Loss 文件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button 
              onClick={() => downloadLossFile(baselineLossCurve, 'baseline_loss.csv')}
              aria-label="下载基线 Loss 文件"
            >
              下载基线 Loss
            </Button>
            <Button 
              onClick={() => downloadLossFile(currentLossCurve, 'current_loss.csv')}
              aria-label="下载当前测试 Loss 文件"
            >
              下载当前测试 Loss
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}