<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Toggle } from "$lib/components/ui/toggle";
    import { Button } from "$lib/components/ui/button";
    import Label from "@/components/ui/label/label.svelte";
    import { signIn, signUp } from "$lib/db";
    import { checkIsLoggedIn } from "../store";
    import { goto } from "$app/navigation";

    let data = {
        username: "",
        email: "",
        pass: "",
        confirmPass: "",
    };

    let registering: boolean = true;

    async function signInHandler() {
        let login = await signIn(data);
        console.log(login)
        if (login){
          goto("/")
        }
        checkIsLoggedIn(true)
    }

    async function signUpHandler() {
        signUp(data);
        checkIsLoggedIn(true)
    }
</script>

<div class="px-4">
    <Toggle on:click={() => (registering = !registering)} variant="outline"
        >{registering ? "Login?" : "Register?"}</Toggle
    >
</div>

{#if registering}
    <form on:submit={signUpHandler} class="p-4">
        <div class="py-2">
            <Label for="Username">Username</Label>
            <Input
                type="text"
                id="Username"
                bind:value={data.username}
                placeholder="Username"
                required
            />
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
                bind:value={data.confirmPass}
                placeholder="Confirm Password"
                required
            />
        </div>
        <Button type="submit">Register</Button>
    </form>
{:else}
    <form on:submit={signInHandler} class="p-4">
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
        </div>
        <Button type="submit">Login</Button>
    </form>
{/if}
