'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"

type CardOption = "single" | "multi-2" | "multi-4" | "multi-8"

interface UsabilityTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UsabilityTestModal({ isOpen, onClose, onConfirm }: UsabilityTestModalProps) {
  const [pythonVersion, setPythonVersion] = useState<string>("")
  const [openmindVersion, setOpenmindVersion] = useState<string>("")
  const [framework, setFramework] = useState<"MindSpore" | "PyTorch">("MindSpore")
  const [frameworkVersion, setFrameworkVersion] = useState<string>("")
  const [cannVersion, setCannVersion] = useState<string>("")
  const [cardOption, setCardOption] = useState<CardOption>("single")

  const handleConfirm = () => {
    console.log("Test configuration:", { pythonVersion, openmindVersion, framework, frameworkVersion, cannVersion, cardOption })
    onConfirm()  // 调用传入的 onConfirm 函数
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>发起可用性测试</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <label htmlFor="python-version" className="text-sm font-medium">
              Python
            </label>
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
            <label htmlFor="openmind-version" className="text-sm font-medium">
              Openmind
            </label>
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
          <div className="space-y-1">
            <label htmlFor="framework" className="text-sm font-medium">
              Framework
            </label>
            <Select onValueChange={(value: "MindSpore" | "PyTorch") => setFramework(value)} value={framework}>
              <SelectTrigger id="framework">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MindSpore">MindSpore</SelectItem>
                <SelectItem value="PyTorch">PyTorch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label htmlFor="framework-version" className="text-sm font-medium">
              {framework}
            </label>
            <Select onValueChange={setFrameworkVersion} value={frameworkVersion}>
              <SelectTrigger id="framework-version">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {framework === "MindSpore" ? (
                  <>
                    <SelectItem value="1.5">1.5</SelectItem>
                    <SelectItem value="1.6">1.6</SelectItem>
                    <SelectItem value="1.7">1.7</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="1.8">1.8</SelectItem>
                    <SelectItem value="1.9">1.9</SelectItem>
                    <SelectItem value="1.10">1.10</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label htmlFor="cann-version" className="text-sm font-medium">
              CANN
            </label>
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
          <div className="space-y-1">
            <label className="text-sm font-medium">卡数选择</label>
            <div className="flex space-x-2">
              {["单卡", "2卡", "4卡", "8卡"].map((option, index) => (
                <Button
                  key={option}
                  variant={cardOption === ["single", "multi-2", "multi-4", "multi-8"][index] ? "default" : "outline"}
                  onClick={() => setCardOption(["single", "multi-2", "multi-4", "multi-8"][index] as CardOption)}
                  className="flex-1"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
