'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BetInputProps = {
    userId: string
    matchId: number
    selectedCoef: number | null
    balance: number
    onBetSuccess: (newBalance: number) => void
}

export default function BetInput({
                                     userId,
                                     matchId,
                                     selectedCoef,
                                     balance,
                                     onBetSuccess
                                 }: BetInputProps) {
    const [amount, setAmount] = useState<number | ''>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()
    const handleQuickSelect = (value: number) => {
        setAmount(value)
    }

    const handlePlaceBet = async () => {
        setError(null)
        setSuccess(null)

        if (!selectedCoef) {
            setError('Оберіть коефіцієнт перед ставкою')
            return
        }

        if (!amount || amount < 25) {
            setError('Мінімальна сума ставки — 25 грн')
            return
        }

        if (amount > balance) {
            setError('Недостатньо коштів на балансі')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/bets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    match_id: matchId,
                    coef: selectedCoef,
                    amount,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Помилка при ставці')
            } else {
                const newBalance = balance - amount
                setSuccess('Ставку успішно зроблено!')
                setAmount('')
                onBetSuccess(newBalance)
                router.push('/my-bets')
            }
        } catch (err) {
            setError('Невідома помилка при ставці')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="border-t border-gray-800 p-6 bg-gray-950">
            <label className="block text-lg font-semibold mb-3">Введіть суму ставки:</label>

            <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Сума в грн"
                className="w-full px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 cursor-pointer"
            />

            <div className="flex justify-between gap-4 mt-5">
                {[25, 100, 500].map((val) => (
                    <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickSelect(val)}
                        className="flex-1 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white text-lg font-semibold hover:bg-orange-600 hover:text-black hover:border-orange-500 transition duration-200 cursor-pointer"
                    >
                        {val} ₴
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={handlePlaceBet}
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-black text-lg font-bold transition duration-200 cursor-pointer disabled:opacity-50"
            >
                {loading ? 'Обробка...' : 'Зробити ставку'}
            </button>

            {error && <div className="mt-3 text-red-500 font-medium">{error}</div>}
            {success && <div className="mt-3 text-green-500 font-medium">{success}</div>}

            <div className="mt-4 text-gray-400 text-sm">Баланс: {balance} ₴</div>
        </div>
    )
}
