"use server"

import { db } from "@/db";
import getSession from "./getSession";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

type Props = {
    name: string;
}

export async function newUserAction(data: Props) {
    const session = await getSession();

    if (!session || !session.user.id) {
        throw new Error("User not authenticated");
    }

    if (session.user.profileCompleted) {
        // If the user already has a profile, redirect to the profile page
        throw new Error("Profile already completed");
    }

    // update user in db
    await db.update(users)
        .set({
            name: data.name,
            profileCompleted: true,
        })
        .where(eq(users.id, session.user.id));
}