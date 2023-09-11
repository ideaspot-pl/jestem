import useSWR from "swr";

export default function useHostCurrentEvent() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${baseUrl}/api/v1/host/event-info`;
    const user = process.env.NEXT_PUBLIC_API_USER || '';
    const pass = process.env.NEXT_PUBLIC_API_PASS || '';
    const basic = btoa(`${user}:${pass}`);

    const fetcher = (url: string) => fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basic}`
        }
    }).then((res) => res.json());
    const {data, isLoading, error, mutate} = useSWR<HostEventInfoDTO>(url, fetcher);

    return {
        eventInfo: data,
        isLoading,
        error,
        mutate,
    }
}
