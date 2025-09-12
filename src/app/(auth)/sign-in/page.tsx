import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    }); // Placeholder to ensure this is a client component

    if (!!session) {
    redirect("/");
    }
    
    return <SignInView />;
}

export default Page;

// http://localhost:3000/sign-in

// now in auth so http://localhost:3000/auth/sign-in