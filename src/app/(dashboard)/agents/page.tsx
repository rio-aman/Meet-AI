import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from 'react-error-boundary';

import { getQueryClient, trpc } from "@/trpc/server";

import { auth } from "@/lib/auth";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

const Page = async () => {
  const session = await auth.api.getSession({
      headers: await headers(),
    }); // Placeholder to ensure this is a client component
  
    if (!session) {
      redirect("/sign-in");
    }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <AgentsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<AgentsViewLoading />}>
          {/* when error boundary downloaded */}
          <ErrorBoundary fallback={<AgentsViewError />}>
              <AgentsView />
          </ErrorBoundary>
          </Suspense>
      </HydrationBoundary>
    </>
  )
};

export default Page;