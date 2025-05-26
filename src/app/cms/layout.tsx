import getSession from '@/getSession';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    children?: React.ReactNode;
}

export default async function CMSLayout({ children}: Props) {
    const session = await getSession();

    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/cms');
    }

    return (
        <div>{children}</div>
    )
}