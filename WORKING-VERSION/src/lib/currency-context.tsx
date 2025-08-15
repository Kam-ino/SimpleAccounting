"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Currency {
  code: string
  name: string
  symbol: string
  locale: string
}

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatCurrency: (amount: number) => string
  availableCurrencies: Currency[]
}

const availableCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', locale: 'en-PH' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', locale: 'de-CH' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', locale: 'en-MY' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', locale: 'th-TH' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', locale: 'en-ID' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', locale: 'vi-VN' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', locale: 'es-AR' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', locale: 'ru-RU' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', locale: 'tr-TR' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', locale: 'en-SA' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'en-AE' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'nb-NO' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', locale: 'da-DK' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', locale: 'pl-PL' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', locale: 'cs-CZ' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', locale: 'hu-HU' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', locale: 'ro-RO' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', locale: 'bg-BG' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', locale: 'hr-HR' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', locale: 'is-IS' }
]

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(availableCurrencies[0])

  useEffect(() => {
    // Load currency from localStorage on mount
    const savedCurrency = localStorage.getItem('currency')
    if (savedCurrency) {
      try {
        const parsed = JSON.parse(savedCurrency)
        const foundCurrency = availableCurrencies.find(c => c.code === parsed.code)
        if (foundCurrency) {
          setCurrencyState(foundCurrency)
        }
      } catch (error) {
        console.error('Error loading currency from localStorage:', error)
      }
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('currency', JSON.stringify(newCurrency))
  }

  const formatCurrency = (amount: number): string => {
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' ? 0 : 2,
        maximumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' ? 0 : 2
      }).format(amount)
    } catch (error) {
      // Fallback to basic formatting
      return `${currency.symbol}${amount.toFixed(2)}`
    }
  }

  return (
    <CurrencyContext.Provider value={{
      currency,
      setCurrency,
      formatCurrency,
      availableCurrencies
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}