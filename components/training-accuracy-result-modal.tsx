'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
}

type Props = {
  isOpen: boolean
  onClose: () => void
  test: AccuracyTest
}

// 模拟生成 loss 数据
const generateLossData = () => {
  const data = []
  for (let i = 0; i <= 5000; i += 100) {
    data.push({
      step: i,
      baseline: Math.exp(-i / 1000) + Math.random() * 0.1,
      current: Math.exp(-i / 800) + Math.random() * 0.15,
    })
  }
  return data
}

export function TrainingAccuracyResultModal({ isOpen, onClose, test }: Props) {
  const lossData = generateLossData()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>训练精度测试结果</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="baseline" stroke="#8884d8" name="基线 Loss" />
              <Line type="monotone" dataKey="current" stroke="#82ca9d" name="当前训练 Loss" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">测试详情</h3>
          <p>{test.testDetails}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>关闭</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
