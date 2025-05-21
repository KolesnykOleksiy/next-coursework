import { getMatches } from '@/app/admin/confirmed/action'
import UserMatchList from "@/components/matches/UserMatchList";


export default async function MatchesPage() {
    const matches = await getMatches()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Available matches</h1>
            <UserMatchList matches={matches} />
        </div>
    )
}
