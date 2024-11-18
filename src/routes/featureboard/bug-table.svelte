<script lang="ts" generics="TData, TValue">
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { Separator } from '$ui/separator';
import {
	type ColumnDef,
	type ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
} from '@tanstack/table-core';
import {
	createSvelteTable,
	FlexRender,
} from '$lib/components/ui/data-table/index.js';
import * as Table from '$lib/components/ui/table/index';
import * as Select from '$lib/components/ui/select/index';
import * as Sheet from '$lib/components/ui/sheet/index';
import * as ContextMenu from '$ui/context-menu';
import { adminOnly } from '@/helpers/admin';
// import { getDb } from '@/db';
import { RecordId } from 'surrealdb';
import { isLoggedIn, userStore } from '@/stores/userstore';
import type { Report, Votes } from '@/types';
import { toast } from 'svelte-sonner';
import { categoryToText, statusToText } from './helpers';
import { invalidateAll } from '$app/navigation';

let selectedCell: any = $state(undefined);
let sheetOpen = $state(false);
let contextOpen = $state(false);

type DateTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
};

let { data, columns }: DateTableProps<TData, TValue> = $props();

// Sorting and filtering
let sorting = $state<SortingState>([]);

async function upvote(id: string) {
	// let db = await getDb();
	// let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	// let userId = $userStore?.id ?? new RecordId('', '');
	// let report = await db?.select<Report>(recordId);
	//
	// let votes = await db?.query<Array<Array<Votes>>>(`SELECT * FROM votes WHERE
	//                  voter = ${'user:' + userId.id}
	//                  AND
	//                  bugreport = ${id}
	//                  `);
	//
	// if (!report || !votes) return;
	// let newUpvotes = report?.upvotes;
	//
	// if (votes[0]?.length >= 1) {
	// 	let v = votes[0][0];
	// 	await db?.delete(v.id!);
	// 	newUpvotes -= 1;
	// } else {
	// 	newUpvotes += 1;
	// 	await db?.create('votes', {
	// 		bugreport: recordId,
	// 		voter: userId,
	// 	});
	// 	// .then(async (vote) => {
	// 	// 	let q = `RELATE ${recordId} -> bug_vote -> ${vote![0].id}`;
	// 	// 	await db?.query(q);
	// 	// });
	// }
	// invalidateAll();
}

async function setStatus(id: string, status: number) {
	// let db = await getDb();
	// let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	// await db
	// 	?.patch(recordId, [
	// 		{
	// 			op: 'replace',
	// 			path: '/status',
	// 			value: status,
	// 		},
	// 	])
	// 	.then(() => {
	// 		toast.success('Yey', {
	// 			description: 'Status gändert',
	// 		});
	// 	});
	// invalidateAll();
}

async function setCategory(id: string, category: number) {
	// let db = await getDb();
	// let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	// await db
	// 	?.patch(recordId, [
	// 		{
	// 			op: 'replace',
	// 			path: '/category',
	// 			value: category,
	// 		},
	// 	])
	// 	.then(() => {
	// 		toast.success('Yey', {
	// 			description: 'Kategorie gändert',
	// 		});
	// 	});
	// invalidateAll();
}

async function setPrio(id: string, prio: number) {
	// let db = await getDb();
	// let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	// await db
	// 	?.patch(recordId, [
	// 		{
	// 			op: 'replace',
	// 			path: '/priority',
	// 			value: prio,
	// 		},
	// 	])
	// 	.then(() => {
	// 		toast.success('Yey', {
	// 			description: 'Priorität gändert',
	// 		});
	// 	});
	// invalidateAll();
}

let globalFilter = $state('');
let columnFilter = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
	get data() {
		return data;
	},
	columns,
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	globalFilterFn: 'includesString',
	onSortingChange: (updater) => {
		if (typeof updater === 'function') {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
	},
	onGlobalFilterChange: (updater) => {
		if (typeof updater === 'function') {
			globalFilter = updater(globalFilter);
		} else {
			globalFilter = updater;
		}
	},
	onColumnFiltersChange: (updater) => {
		if (typeof updater === 'function') {
			columnFilter = updater(columnFilter);
		} else {
			columnFilter = updater;
		}
	},
	groupedColumnMode: 'remove',
	enableGlobalFilter: true,
	state: {
		columnVisibility: {
			id: false,
		},
		get sorting() {
			return sorting;
		},
		get globalFilter() {
			return globalFilter;
		},
		get columnFilters() {
			return columnFilter;
		},
	},
});

const statuses = [
	{ label: 'Open', value: 0 },
	{ label: 'WIP', value: 1 },
	{ label: 'Accepted', value: 2 },
	{ label: 'Denied', value: 3 },
	{ label: 'Close', value: 4 },
	{ label: 'Archived', value: 10 },
];

let statusFilter = $state(['0', '1', '2']);
let categoryFilter = $state(['0', '1', '2']);

const statusFilterTrigger = $derived('Gefilterte Statuse');
const categoryFilterTrigger = $derived('Gefilterte Kategorien');

const categorys = [
	{ label: 'Bug', value: 0 },
	{ label: 'Feature', value: 1 },
	{ label: 'Question', value: 2 },
];
</script>

<main class="w-full">
    <div class="flex justify-evenly mb-3">
        <Select.Root type="multiple" name="statuses" bind:value={statusFilter}>
          <Select.Trigger class="w-[180px]">
            {statusFilterTrigger}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Statuse</Select.GroupHeading>
              {#each statuses as status}
                <Select.Item value={status.value.toString()} label={status.label} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>

        <Select.Root type="multiple" name="categories" bind:value={categoryFilter}>
          <Select.Trigger class="w-[180px]">
            {categoryFilterTrigger}
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.GroupHeading>Kategorien</Select.GroupHeading>
              {#each categorys as categorie}
                <Select.Item value={categorie.value.toString()} label={categorie.label} />
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
    </div>

    <Input 
        placeholder="Suche" 
        class="w-full my-3" 
        bind:value={globalFilter} 
    /> 

    <div class="rounded-md border w-100">
        <Table.Root class="w-full">
            <Table.Header>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <Table.Row>
                        {#each headerGroup.headers as header (header.id)}
                            <Table.Head>
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#each table.getRowModel().rows as row (row.id)}
                    {#if (statusFilter.includes(row.getValue("status")!.toString()) && categoryFilter.includes(row.getValue("category")!.toString())) }
                        <Table.Row data-state={row.getIsSelected() && "selected"} style="cursor: pointer">
                            {#each row.getVisibleCells() as cell (cell.id)}
                                <Table.Cell onclick={()=>{
                                    if(contextOpen) return
                                    selectedCell = cell
                                    sheetOpen = true
                                }}>
                                <ContextMenu.Root onOpenChange={(v) => contextOpen = v}>
                                    {#if adminOnly()}
                                        <ContextMenu.Trigger>
                                            <FlexRender
                                                content={cell.column.columnDef
                                                    .cell}
                                                context={cell.getContext()}
                                            />
                                        </ContextMenu.Trigger>
                                    {:else}
                                        <FlexRender
                                            content={cell.column.columnDef
                                                .cell}
                                            context={cell.getContext()}
                                        />
                                    {/if}
                                        <ContextMenu.Content class="zindex">
                                            <ContextMenu.Item>
                                                {#if isLoggedIn}
                                                    <Button
                                                        variant="link"
                                                        onclick={() =>
                                                            upvote(
                                                                cell
                                                                    .getContext()
                                                                    .row.getValue(
                                                                        "id",
                                                                    ),
                                                            )}>Upvote</Button
                                                    >
                                                {/if}
                                            </ContextMenu.Item>
                                            <Separator />
                                            {#if adminOnly()}
                                                <div class="flex">
                                                    <div class="flex flex-col">
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        0,
                                                                    )}>Open</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        1,
                                                                    )}>WIP</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        2,
                                                                    )}>Accepted</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        3,
                                                                    )}>Denied</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        4,
                                                                    )}>Closed</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setStatus(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        10,
                                                                    )}>Archived</Button
                                                            >
                                                        </ContextMenu.Item>
                                                    </div>
                                                    <Separator orientation="vertical" />
                                                    <div class="flex flex-col">
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setPrio(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        0,
                                                                    )}>Leicht</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setPrio(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        1,
                                                                    )}>Mittel</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setPrio(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        2,
                                                                    )}>Schwer</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setPrio(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        3,
                                                                    )}>INSTANTTLYFIX</Button
                                                            >
                                                        </ContextMenu.Item>
                                                    </div>
                                                    <Separator orientation="vertical" />
                                                    <div class="flex flex-col">
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setCategory(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        0,
                                                                    )}>Bug</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setCategory(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        1,
                                                                    )}>Feature</Button
                                                            >
                                                        </ContextMenu.Item>
                                                        <ContextMenu.Item>
                                                            <Button
                                                                variant="link"
                                                                onclick={() =>
                                                                    setCategory(
                                                                        cell
                                                                            .getContext()
                                                                            .row.getValue(
                                                                                "id",
                                                                            ),
                                                                        2,
                                                                    )}>Question</Button
                                                            >
                                                        </ContextMenu.Item>
                                                    </div>
                                                </div>
                                            {/if}
                                        </ContextMenu.Content>
                                    </ContextMenu.Root>
                                </Table.Cell>
                            {/each}
                        </Table.Row>
                    {/if}
                {:else}
                    <Table.Row>
                        <Table.Cell
                            colspan={columns.length}
                            class="h-24 text-center"
                        >
                            No results.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>

        <!-- Sheet -->
        <Sheet.Root bind:open={sheetOpen}>
            <Sheet.Content>
                <Sheet.Header>
                    <Sheet.Title
                        >{selectedCell
                            .getContext()
                            .row.getValue(
                                "title",
                            )}</Sheet.Title
                    >
                    <Sheet.Description>
                        <div class="mb-5">
                            <p>
                                {selectedCell
                                    .getContext()
                                    .row.getValue("body")}
                            </p>
                        </div>
                        <Separator />
                        <div class="flex flex-row gap-2">
                            <p class="border-r">
                                Status: {statusToText(
                                    selectedCell
                                        .getContext()
                                        .row.getValue(
                                            "status",
                                        ),
                                )}
                            </p>
                            <p class="border-r">
                                Kategorie: {categoryToText(
                                    selectedCell
                                        .getContext()
                                        .row.getValue(
                                            "category",
                                        ),
                                )}
                            </p>
                            <p class="border-r">
                                Likes: {selectedCell
                                    .getContext()
                                    .row.getValue(
                                        "upvotes",
                                    )}
                            </p>
                            <p class="border-r">
                                Author: {selectedCell
                                    .getContext()
                                    .row.getValue("owner")}
                            </p>
                        </div>
                        <div class="flex justify-between">
                            <Button
                                class="mt-5"
                                variant="outline"
                                onclick={() =>
                                    upvote(
                                        selectedCell
                                            .getContext()
                                            .row.getValue(
                                                "id",
                                            ),
                                    )}>Upvote</Button
                            >
                            <Button
                                class="mt-5"
                                variant="outline"
                                onclick={() => navigator.clipboard.writeText(selectedCell.getContext().row.getValue("id").toString()) }>{selectedCell.getContext().row.getValue("id").replace("bugreports:", "").substring(0, 20)}</Button
                            >
                        </div>
                    </Sheet.Description>
                </Sheet.Header>
            </Sheet.Content>
        </Sheet.Root>
    </div>
</main>
