import { getMatches } from './action'
import MatchCard from "@/components/matches/MatchCard";


export default async function ConfirmedMatchesPage() {
    const matches = await getMatches()
    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    )
}
