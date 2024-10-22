import { useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { TrainingTestDetails } from "./training-test-details"
import { InferenceTestDetails } from "./inference-test-details"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
  testDetails: any // This will be different for inference and training
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
    testDetails: {
      baselineTensor: [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
      currentTensor: [[0.11, 0.21, 0.31], [0.41, 0.51, 0.61]],
      taskType: "文本分类",
      metric: "准确率",
      metricValue: 0.95,
      threshold: {
        operator: ">=",
        value: 0.9
      }
    }
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
    testDetails: {
      baselineLossCurve: Array.from({ length: 5000 }, () => Math.random()),
      currentLossCurve: Array.from({ length: 5000 }, () => Math.random()),
      lossRelativeError: 0.15,
      threshold: {
        operator: "<=",
        value: 0.1
      },
      dataset: "MNIST",
    }
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
    testDetails: {
      baselineTensor: [[0.7, 0.8, 0.9], [1.0, 1.1, 1.2]],
      currentTensor: [[0.71, 0.81, 0.91], [1.01, 1.11, 1.21]],
      taskType: "图像分类",
      metric: "Top-1 准确率",
      metricValue: 0.88,
      threshold: {
        operator: ">=",
        value: 0.85
      }
    }
  },
]

// 定义 InferenceTest 类型
type InferenceTest = Extract<AccuracyTest, { type: "inference" }>;

// 定义 TrainingTest 类型
type TrainingTest = Extract<AccuracyTest, { type: "training" }>;

export function AccuracyTestHistory() {
  const [selectedTest, setSelectedTest] = useState<AccuracyTest | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleViewDetails = useCallback((test: AccuracyTest) => {
    try {
      if (!test) {
        throw new Error("测试数据不存在")
      }
      setSelectedTest(test)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法加载测试详情。请稍后再试。")
      setSelectedTest(null)
    }
  }, [])

  const handleCloseDialog = useCallback(() => {
    setSelectedTest(null)
    setError(null)
  }, [])

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
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
              <TableCell>{test.type === "inference" ? "推理" : "训练"}</TableCell>
              <TableCell>{test.status === "success" ? "成功" : "失败"}</TableCell>
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
                <Button variant="link" onClick={() => handleViewDetails(test)}>
                  查看详情
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!selectedTest} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-3xl">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : selectedTest ? (
            selectedTest.type === "training" ? (
              <TrainingTestDetails test={selectedTest as TrainingTest} />
            ) : (
              <InferenceTestDetails test={selectedTest as InferenceTest} />
            )
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
