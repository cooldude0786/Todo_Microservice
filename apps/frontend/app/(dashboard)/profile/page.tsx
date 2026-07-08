"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession, signOut } from "next-auth/react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleSignOut = async () => {
      await signOut({ redirect: false });
      router.push("/login");
    };

    return (
        <Card className="w-full h-full rounded-4xl text-primary" >
            <CardHeader>
                <CardTitle>
                    User Profile
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-primary">
                    {session ? (
                        <Field>

                            <FieldLegend >Billing Address</FieldLegend>

                            <p><strong>Name:</strong> {session.user?.name}</p>
                            <p><strong>Email:</strong> {session.user?.email}</p>
                       </Field>

                    ) : (
                        <p>User is not authenticated.</p>
                    )}
                </CardDescription>
            </CardContent>
            <CardFooter>
                <Button 
                  variant="outline" 
                  className="bg-secondary text-secondary-foreground"
                  onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </CardFooter>
        </Card>
    )
}
