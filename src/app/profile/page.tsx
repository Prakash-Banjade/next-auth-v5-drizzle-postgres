import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import getSession from '@/lib/getSession';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

type Props = {}

export default async function ProfilePage({ }: Props) {
    const session = await getSession();
    const isAdmin = session?.user?.role === 'admin';

    return (
        <div>
            <h1 className='text-2xl'>Profile</h1>
            <p>Name: {session?.user?.name}</p>
            <p>Email: {session?.user?.email}</p>
            <p>Role: {session?.user?.role}</p>

            {
                isAdmin && (
                    <Button>
                        <Link href="/cms">Go to CMS</Link>
                    </Button>
                )
            }


            <Button className='mt-4' type="button" onClick={async () => {
                "use server"
                await signOut()
            }}>
                <LogOut />
                Logout
            </Button>
        </div>
    )
}