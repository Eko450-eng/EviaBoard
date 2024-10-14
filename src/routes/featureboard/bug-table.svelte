<script lang="ts">
    import {
        createTable,
        Render,
        Subscribe,
        createRender,
    } from "svelte-headless-table";
    import { writable } from "svelte/store";
    import * as Table from "../../lib/components/ui/table";
    import DataTableActions from "./bug-table-actions.svelte";
    import { addSortBy } from "svelte-headless-table/plugins";
    import Button from "@/components/ui/button/button.svelte";
    import { Icon } from "svelte-icons-pack";
    import { BsArrowDownUp } from "svelte-icons-pack/bs";
    import { db, getDb, type Report } from "$lib/db";
    import { onMount } from "svelte";

    let data: Report[] = [];

    let dataNew = writable(data);

    export async function updateTable() {
        await getDb()
        if (db && db.ready) {
            await db
                ?.query<
                    Report[][]
                >("select id, title, body, status, category, upvotes, owner.name as owner from bugreports")
                .then((v) => {
                    dataNew.set(v[0]);
                    return v;
                });
        }
    }

    onMount(async () => {
        await getDb();
        updateTable();
    });

    let table = createTable(dataNew, {
        sort: addSortBy(),
    });

    const columns = table.createColumns([
        table.column({
            accessor: "title",
            header: "title",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "body",
            header: "body",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "status",
            header: "status",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "category",
            header: "category",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "upvotes",
            header: "upvotes",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "owner",
            header: "owner",
            plugins: {
                sort: {
                    disable: false,
                },
            },
        }),
        table.column({
            accessor: "id",
            header: "actions",
            plugins: {
                sort: {
                    disable: true,
                },
            },
            cell: (value) => {
                return createRender(DataTableActions, { id: value.id });
            },
        }),
    ]);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } =
        table.createViewModel(columns);
</script>

<div class="w-full rounded-md border">
    <Table.Root {...$tableAttrs}>
        <Table.Header>
            {#each $headerRows as headerRow}
                <Subscribe rowAttrs={headerRow.attrs()}>
                    <Table.Row>
                        {#each headerRow.cells as cell (cell.id)}
                            <Subscribe
                                attrs={cell.attrs()}
                                let:attrs
                                props={cell.props()}
                                let:props
                            >
                                <Table.Head {...attrs}>
                                    {#if cell.id !== "id"}
                                        <Button
                                            variant="ghost"
                                            on:click={props.sort.toggle}
                                        >
                                            <Render of={cell.render()} />
                                            <Icon
                                                src={BsArrowDownUp}
                                                className="mx-2"
                                            />
                                        </Button>
                                    {/if}
                                </Table.Head>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Header>
        <Table.Body {...$tableBodyAttrs}>
            {#each $pageRows as row (row.id)}
                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                    <Table.Row {...rowAttrs}>
                        {#each row.cells as cell (cell.id)}
                            <Subscribe attrs={cell.attrs()} let:attrs>
                                <Table.Cell {...attrs}>
                                    <Render of={cell.render()} />
                                </Table.Cell>
                            </Subscribe>
                        {/each}
                    </Table.Row>
                </Subscribe>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
