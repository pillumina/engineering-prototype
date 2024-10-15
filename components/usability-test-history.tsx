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

type UsabilityTest = {
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
  logDetails: string
}

const mockUsabilityTests: UsabilityTest[] = [
  {
    id: "1",
    startTime: "2023-05-01 10:00:00",
    endTime: "2023-05-01 10:30:00",
    type: "inference",
    status: "success",
    versions: {
      python: "3.8",
      openmind: "1.1",
      cann: "5.0",
      framework: { name: "mindspore", version: "1.5" }
    },
    branch: "main",
    commitId: "abc123",
    logDetails: "测试成功完成..."
  },
  {
    id: "2",
    startTime: "2023-05-02 14:00:00",
    endTime: "2023-05-02 14:45:00",
    type: "training",
    status: "failed",
    versions: {
      python: "3.9",
      openmind: "1.2",
      cann: "5.1",
      framework: { name: "pytorch", version: "1.9" }
    },
    branch: "feature/new-model",
    commitId: "def456",
    logDetails: "Test failed due to memory allocation error..."
  },
  {
    id: "3",
    startTime: "2023-05-03 09:00:00",
    endTime: "2023-05-03 09:20:00",
    type: "inference",
    status: "success",
    versions: {
      python: "3.7",
      openmind: "1.0",
      cann: "5.2",
      framework: { name: "mindspore", version: "1.6" }
    },
    branch: "hotfix/inference-bug",
    commitId: "ghi789",
    logDetails: "Test completed with improved performance..."
  },
]

export function UsabilityTestHistory() {
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

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
            <TableHead>日志详情</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsabilityTests.slice(0, 3).map((test) => (
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
              <TableCell>
                <Button variant="link" onClick={() => setSelectedLog(test.logDetails)}>
                  查看日志
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>日志详情</DialogTitle>
          </DialogHeader>
          <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto max-h-96">
            {selectedLog}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  )
}