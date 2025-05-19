'use client'

import React, {useState} from 'react'
import Match, { MatchType } from './Match'

type MatchListProps = {
    matches: MatchType[]
}

export default function MatchList({ matches }: MatchListProps) {
    const [matchList, setMatchList] = useState(matches)

    const handleDelete = (id: number) => {
        setMatchList(prev => prev.filter(m => m.id !== id))
    }

    return (
        <ul>
            {matchList.map(match => (
                <Match key={match.id} match={match} onDelete={handleDelete} />
            ))}
        </ul>
    )
}
