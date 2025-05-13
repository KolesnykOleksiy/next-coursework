import { createClient } from '@/utils/supabase/server';

export default async function Instruments() {
    const supabase = await createClient();
    const { data: instruments } = await supabase.from("instruments").select();
    return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}
export function add(a: number, b: number): number {
    return a + b;
}

