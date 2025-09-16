import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { 
    AgentIdView, 
    AgentsIdViewError, 
    AgentsIdViewLoading 
} from "@/modules/agents/ui/views/agents-id-view";

interface Props {
    params: Promise<{ agentId: string }>
};

const Page = async ({params}: Props) => {
    const { agentId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.agents.getOne.queryOptions({id: agentId}),
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsIdViewLoading />}>
                <ErrorBoundary fallback={<AgentsIdViewError />}>
                    <AgentIdView agentId={agentId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    );
}

export default Page;
