'use client'

import React, { useState } from 'react'
import { MatchType } from '@/components/matches/Match'

type CoefMatchModalProps = {
    match: MatchType
    onClose: () => void
    onConfirm: (coeffHome: number, coeffAway: number) => void
}

export default function CoefMatchWindow({ match, onClose, onConfirm }: CoefMatchModalProps) {
    const [coeffHome, setCoeffHome] = useState<number>(1)
    const [coeffAway, setCoeffAway] = useState<number>(1)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Редагування матчу</h2>
                <p className="mb-2 text-gray-700">
                    {match.home_team_name} vs {match.away_team_name}
                </p>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Коефіцієнт на {match.home_team_name}</label>
                    <input
                        type="number"
                        value={coeffHome}
                        min={1}
                        step={0.01}
                        onChange={(e) => setCoeffHome(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Коефіцієнт на {match.away_team_name}</label>
                    <input
                        type="number"
                        value={coeffAway}
                        min={1}
                        step={0.01}
                        onChange={(e) => setCoeffAway(Number(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Скасувати</button>
                    <button
                        onClick={() => onConfirm(coeffHome, coeffAway)}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Підтвердити
                    </button>
                </div>
            </div>
        </div>
    )
}
