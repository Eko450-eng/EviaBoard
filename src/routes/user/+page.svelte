<script lang="ts">
    import { checkIsLoggedIn, userData } from "../store";
    import { Label } from "$ui/label";
    import { Button } from "$ui/button";
    import { Input } from "$ui/input";
    import { fileUploadHandler, uploadFile } from "@/helpers/minio";
    import { getFromMinio } from "@/minio";
    import { db, signOut, type user } from "@/db";
    import { toast } from "svelte-sonner";
    import { Icon } from "svelte-icons-pack";
    import { FaSolidArrowRightFromBracket } from "svelte-icons-pack/fa";

    async function generateImage() {
        let image: any;

        let userid = $userData.id.toString();
        let userImage = userid + ".png";
        if (!userid) return "";
        image = await getFromMinio("eviaboard", userImage);

        await uploadFile($userData.id + ".png");
    }

    let user: user = {
        id: $userData.id,
        password: $userData.password,
        role: $userData.role,
        email: $userData.email,
        name: $userData.name,
        image: $userData.image,
    };

    async function updateUser() {
        await generateImage();

        await db
            ?.patch($userData.id, [
                {
                    op: "replace",
                    path: "/email",
                    value: user.email,
                },
                {
                    op: "replace",
                    path: "/name",
                    value: user.name,
                },
                {
                    op: "replace",
                    path: "/image",
                    value: `https://minio.eko450eng.org/eviaboard/${$userData.id}.png`,
                },
            ])
            .then(() => {
                toast.success("Yey", {
                    description: "User updated",
                });
            });
    }
</script>

<form on:submit={updateUser}>
    <div class="flex justify-between">
        <h1 class="text-2xl">{$userData.name}</h1>
        <Button
            class="mx-4"
            on:click={async () => {
                signOut();
                checkIsLoggedIn(false);
            }}
            variant="outline"
            size="icon"
        >
            <Icon src={FaSolidArrowRightFromBracket} size={24} />
        </Button>
    </div>
    <h3 class="text-xs mb-5">{$userData.role}</h3>
    <Label for="email">E-Mail</Label>
    <Input
        type="text"
        name="email"
        placeholder={$userData.email}
        bind:value={user.email}
    />
    <Label for="name">Username</Label>
    <Input
        type="text"
        name="name"
        placeholder={$userData.name}
        bind:value={user.name}
    />
    <Label for="image">Image</Label>

    <div class="flex gap-2">
        <Input type="file" on:change={fileUploadHandler} />
    </div>
    <Button class="my-4" type="submit" variant="secondary">Speichern</Button>
</form>
