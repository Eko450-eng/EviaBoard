<script lang="ts">
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
import * as Tabs from '$ui/tabs';
import * as Card from '$ui/card';
import Label from '@/components/ui/label/label.svelte';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';
import type { User } from '@/types';

let userData: User = {
	name: '',
	email: '',
	password: '',
	role: 0,
	created_at: new Date(),
};

let confirmPass = $state('');

async function signInHandler() {
	// await signIn(userData).then((res) => {
	// 	if (res.error) {
	// 		toast.error(res.title, {
	// 			description: res.desc,
	// 		});
	// 	} else {
	// 		goto('/', { replaceState: true });
	// 		toast.success(res.title, {
	// 			description: res.desc,
	// 		});
	// 	}
	// });
}

async function signUpHandler() {
	// signUp(userData, confirmPass).then((res) => {
	// 	if (res.error) {
	// 		toast.error(res.title, {
	// 			description: res.desc,
	// 		});
	// 	} else {
	// 		goto('/', { replaceState: true });
	// 		toast.success(res.title, {
	// 			description: res.desc,
	// 		});
	// 	}
	// });
}
</script>

<div class="flex justify-center">
    <Tabs.Root value="registrieren" class="w-[400px]">
        <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="registrieren">Registrieren</Tabs.Trigger>
            <Tabs.Trigger value="anmelden">Anmelden</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="registrieren">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Signup</Card.Title>
                    <Card.Description>Erstelle deinen Account</Card.Description>
                </Card.Header>
                <form onsubmit={signUpHandler}>
                    <Card.Content class="space-y-2">
                        <div class="space-y-1">
                            <Label for="Username">Username</Label>
                            <Input
                                type="text"
                                id="Username"
                                bind:value={userData.name}
                                placeholder="Username"
                                required
                            />
                            <Label for="email">E-Mail</Label>
                            <Input
                                type="text"
                                id="email"
                                bind:value={userData.email}
                                placeholder="E-Mail"
                                required
                            />
                        </div>
                        <div class="space-y-1">
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                bind:value={userData.password}
                                placeholder="Passwort"
                                required
                            />
                            <Input
                                type="password"
                                id="cpassword"
                                bind:value={confirmPass}
                                placeholder="Passwort bestätigen"
                                required
                            />
                        </div>
                    </Card.Content>
                    <Card.Footer>
                        <Button type="submit">Register</Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="anmelden">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Anmelden</Card.Title>
                    <Card.Description>
                        Meld dich mit deinem Account an
                    </Card.Description>
                </Card.Header>
                <form onsubmit={signInHandler}>
                    <Card.Content class="space-y-2">
                        <div class="space-y-1">
                            <Label for="email">E-Mail</Label>
                            <Input
                                type="text"
                                id="email"
                                bind:value={userData.email}
                                placeholder="E-Mail"
                                required
                            />
                        </div>
                        <div class="space-y-1">
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                bind:value={userData.password}
                                placeholder="Passwort"
                                required
                            />
                        </div>
                    </Card.Content>
                    <Card.Footer>
                        <Button type="submit">Login</Button>
                    </Card.Footer>
                </form>
            </Card.Root>
        </Tabs.Content>
    </Tabs.Root>
</div>
