<script lang="ts">
    import { env } from "$env/dynamic/public";
    import { getDb, initDb } from "@/db";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import Label from "@/components/ui/label/label.svelte";
    import type Surreal from "surrealdb";

    let NS = env.PUBLIC_DB_NS;
    let DB = env.PUBLIC_DB_DB;

    let data = {
        email: "",
        pass: "",
    };

    let confirmPass = "";

    async function signUp() {
        initDb();
        let db: Surreal | undefined = getDb();
        if (data.pass !== confirmPass) {
            alert("Passwords don't match");
            return;
        }
        if (data.pass.length < 8) {
            alert("Password to short");
            return;
        }

        if (!db || !NS || !DB) return;

        const token = await db.signup({
            namespace: NS,
            database: DB,

            user: data.email,
            scope: 'allusers',

            email: data.email,
            pass: data.pass,
            password: data.pass,
        });


        console.log(token);
    }
</script>

<h1>Login</h1>
<form on:submit={signUp} class="p-4">
    <div class="py-2">
        <Label for="email">E-Mail</Label>
        <Input
            type="text"
            id="email"
            bind:value={data.email}
            placeholder="E-Mail"
            required
        />
    </div>
    <div class="py-2">
        <Label for="password">Password</Label>
        <Input
            type="password"
            id="password"
            bind:value={data.pass}
            placeholder="Password"
            required
        />
        <Input
            type="password"
            id="cpassword"
            bind:value={confirmPass}
            placeholder="Confirm Password"
            required
        />
    </div>
    <Button type="submit">Register</Button>
</form>
