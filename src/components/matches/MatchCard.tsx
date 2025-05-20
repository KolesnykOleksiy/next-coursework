'use client'

import React, { useState } from 'react'
import { updateMatch, deleteMatch, finishMatch } from '@/app/admin/confirmed/action'
import dayjs from "dayjs";

export default function MatchCard({ match }: { match: any }) {
    const [formData, setFormData] = useState({
        home_team_score: match.home_team_score ?? '',
        away_team_score: match.away_team_score ?? '',
        coefficient_home: match.coefficient_home ?? '',
        coefficient_away: match.coefficient_away ?? '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleUpdate = async () => {
        await updateMatch(match.id, formData)
        location.reload()
    }

    const handleDelete = async () => {
        await deleteMatch(match.id)
        location.reload()
    }

    const handleFinish = async () => {
        await finishMatch(match.id)
        location.reload()
    }

    return (
        <div className="border rounded-xl p-4 shadow bg-white">
            <h3 className="text-xl font-bold mb-2">{match.home_team_name} vs {match.away_team_name}</h3>
            <p className="text-sm text-gray-500 mb-2">
                {dayjs(match.start_time).format('DD.MM.YYYY HH:mm')}
            </p>

            <div className="space-y-2">
                <div>
                    <label>Рахунок:</label>
                    <div className="flex gap-2">
                        <input
                            name="home_team_score"
                            value={formData.home_team_score}
                            onChange={handleChange}
                            className="w-12 border rounded px-2"
                            type="number"
                            inputMode="numeric"
                            min="0"
                        />
                        <span>:</span>
                        <input
                            name="away_team_score"
                            value={formData.away_team_score}
                            onChange={handleChange}
                            className="w-12 border rounded px-2"
                            type="number"
                            inputMode="numeric"
                            min="0"
                        />
                    </div>
                </div>
                <div>
                    <label>Коефіцієнти:</label>
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-col text-sm text-gray-700">
                            {match.home_team_name}
                            <input
                                name="coefficient_home"
                                value={formData.coefficient_home}
                                onChange={handleChange}
                                placeholder="Coef Home"
                                className="mt-1 px-2 py-1 border rounded"
                                type="number"
                                inputMode="numeric"
                                min="0"
                            />
                        </label>

                        <label className="flex flex-col text-sm text-gray-700">
                            {match.away_team_name}
                            <input
                                name="coefficient_away"
                                value={formData.coefficient_away}
                                onChange={handleChange}
                                placeholder="Coef Away"
                                className="mt-1 px-2 py-1 border rounded"
                                type="number"
                                inputMode="numeric"
                                min="0"
                            />
                        </label>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <button onClick={handleUpdate}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Оновити
                    </button>
                    <button onClick={handleDelete}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Видалити
                    </button>
                    <button
                        onClick={handleFinish}
                        disabled={formData.home_team_score === '' || formData.away_team_score === ''}
                        className={`px-3 py-1 rounded text-white ${
                            formData.home_team_score === '' || formData.away_team_score === ''
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        Завершити
                    </button>
                </div>
            </div>
        </div>
    )
}
