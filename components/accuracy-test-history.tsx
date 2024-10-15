'use client'

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

const mockAccuracyTests: AccuracyTest[] = [
  {
    id: "1",
    startTime: "2023-05-04 11:00:00",
    endTime: "2023-05-04 11:45:00",
    type: "inference",
    status: "success",
    versions: {
      python: "3.8",
      openmind: "1.1",
      cann: "5.0",
      framework: { name: "mindspore", version: "1.5" }
    },
    branch: "main",
    commitId: "jkl012",
    baselineComparison: "基线 1",
    testDetails: "准确率提高了 2.5%..."
  },
  {
    id: "2",
    startTime: "2023-05-05 13:00:00",
    endTime: "2023-05-05 14:30:00",
    type: "training",
    status: "failed",
    versions: {
      python: "3.9",
      openmind: "1.2",
      cann: "5.1",
      framework: { name: "pytorch", version: "1.9" }
    },
    branch: "feature/accuracy-boost",
    commitId: "mno345",
    baselineComparison: "基线 2",
    testDetails: "测试由于收敛问题而失败..."
  },
  {
    id: "3",
    startTime: "2023-05-06 09:30:00",
    endTime: "2023-05-06 10:15:00",
    type: "inference",
    status: "success",
    versions: {
      python: "3.7",
      openmind: "1.0",
      cann: "5.2",
      framework: { name: "mindspore", version: "1.6" }
    },
    branch: "hotfix/inference-accuracy",
    commitId: "pqr678",
    baselineComparison: "基线 3",
    testDetails: "在推理速度提高 30% 的情况下保持了准确率..."
  },
]

export function AccuracyTestHistory() {
  const [selectedDetails, setSelectedDetails] = useState<string | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>开始时间</TableHead>
            <TableHead>结束时间</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>版本</TableHead>
            <TableHead>分支</TableHead>
            <TableHead>Commit ID</TableHead>
            <TableHead>对比基线</TableHead>
            <TableHead>测试详情</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockAccuracyTests.slice(0, 3).map((test) => (
            <TableRow key={test.id}>
              <TableCell>{test.startTime}</TableCell>
              <TableCell>{test.endTime}</TableCell>
              <TableCell>{test.type}</TableCell>
              <TableCell>{test.status}</TableCell>
              <TableCell>
                Python: {test.versions.python}, 
                Openmind: {test.versions.openmind}, 
                CANN: {test.versions.cann}, 
                {test.versions.framework.name}: {test.versions.framework.version}
              </TableCell>
              <TableCell>{test.branch}</TableCell>
              <TableCell>{test.commitId}</TableCell>
              <TableCell>{test.baselineComparison}</TableCell>
              <TableCell>
                <Button variant="link" onClick={() => setSelectedDetails(test.testDetails)}>
                  查看详情
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedDetails} onOpenChange={() => setSelectedDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>测试详情</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-96">
            {selectedDetails}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}