"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCurrency } from '@/lib/currency-context'
import { Settings, DollarSign } from 'lucide-react'

export default function CurrencySelector() {
  const { currency, setCurrency, availableCurrencies } = useCurrency()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="h-4 w-4 mr-2" />
          {currency.code}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Currency Settings</DialogTitle>
          <DialogDescription>
            Choose your preferred currency for displaying amounts throughout the app.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Currency</label>
            <Select
              value={currency.code}
              onValueChange={(value) => {
                const newCurrency = availableCurrencies.find(c => c.code === value)
                if (newCurrency) {
                  setCurrency(newCurrency)
                  setOpen(false)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {availableCurrencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <div className="flex items-center justify-between w-full">
                      <span>{curr.code}</span>
                      <span className="text-muted-foreground text-sm">
                        {curr.name} ({curr.symbol})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Current Selection:</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{currency.code}</span>
              <div className="text-right">
                <p className="font-medium">{currency.name}</p>
                <p className="text-sm text-muted-foreground">Symbol: {currency.symbol}</p>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Example formats:</p>
            <ul className="mt-1 space-y-1">
              <li>• {currency.symbol}1,234.56</li>
              <li>• {currency.symbol}0.99</li>
              <li>• {currency.symbol}1,000,000.00</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}