<script lang="ts" generics="TData, TValue">
// import { Input } from '$ui/input';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { Separator } from '$ui/separator';
import {
	type ColumnDef,
	type ColumnFiltersState,
	// type ColumnFiltersState,
	type FilterFn,
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
import * as Sheet from '$lib/components/ui/sheet/index';
import { rankItem } from '@tanstack/match-sorter-utils';
import * as ContextMenu from '$ui/context-menu';
import { adminOnly } from '@/helpers/admin';
import { getDb } from '@/db';
import { RecordId } from 'surrealdb';
import { isLoggedIn, userStore } from '@/stores/user.store';
import type { Report, Votes } from '@/types';
import { toast } from 'svelte-sonner';
import { getContext } from 'svelte';
// let columnFilters = $state<ColumnFiltersState>([]);

function categoryToText(value: number) {
	switch (value) {
		case 0:
			return 'Bug';
		case 1:
			return 'Feature';
		case 2:
			return 'Question';
		default:
			return 'Bug';
	}
}
function statusToText(value: number) {
	switch (value) {
		case 0:
			return 'open';
		case 1:
			return 'WIP';
		case 2:
			return 'Accepted';
		case 3:
			return 'Denied';
		case 4:
			return 'Closed';
		case 10:
			return 'Archived';
		default:
			return 'Open';
	}
}

type DateTableProps<TData, TValue> = {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
};

let { data, columns }: DateTableProps<TData, TValue> = $props();
let sorting = $state<SortingState>([]);

async function upvote(id: string) {
	let db = await getDb();
	let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	let userId = $userStore?.id ?? new RecordId('', '');
	let report = await db?.select<Report>(recordId);

	let votes = await db?.query<Array<Array<Votes>>>(`SELECT * FROM votes WHERE
                  voter = ${'user:' + userId.id}
                  AND
                  bugreport = ${id}
                  `);

	if (!report || !votes) return;
	let newUpvotes = report?.upvotes;

	if (votes[0]?.length >= 1) {
		let v = votes[0][0];
		await db?.delete(v.id!);
		newUpvotes -= 1;
	} else {
		newUpvotes += 1;
		await db
			?.create('votes', {
				bugreport: recordId,
				voter: userId,
			})
			.then(async (vote) => {
				let q = `RELATE ${recordId} -> bug_vote -> ${vote![0].id}`;
				await db?.query(q);
			});
	}
}

async function setStatus(id: string, status: number) {
	let db = await getDb();
	let recordId = new RecordId('bugreports', id.replace('bugreports:', ''));
	await db
		?.patch(recordId, [
			{
				op: 'replace',
				path: '/status',
				value: status,
			},
		])
		.then(() => {
			toast.success('Yey', {
				description: 'Status gändert',
			});
		});
}

let globalFilter = $state('');

// fuzzyFilter
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({ itemRank });

	return itemRank.passed;
};
let columnFilters = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
	get data() {
		return data;
	},
	columns,
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
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
	filterFns: {
		fuzzy: fuzzyFilter,
	},
	globalFilterFn: (row, columnId, filterValue) => {
		const value = row.getValue(columnId);
		if (value == null) return false;
		return String(value)
			.toLowerCase()
			.includes(String(filterValue).toLowerCase());
	},
	groupedColumnMode: 'reorder',
	enableGlobalFilter: true,
	state: {
		get sorting() {
			return sorting;
		},
		get globalFilter() {
			return columnFilters;
		},
	},
});
</script>

<!-- <Input -->
<!--     placeholder="Suche" -->
<!--     bind:value={globalFilter} -->
<!--     onchange={(e: any) => { -->
<!--         table.setGlobalFilter(String(e.target.value)) -->
<!--     }} -->
<!--     oninput={(e: any) => { -->
<!--         table.setGlobalFilter(String(e.target.value)) -->
<!--     }} -->
<!--     class="max-w-sm" -->
<!-- /> -->

<div class="rounded-md border mt-3">
    <Table.Root>
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
                <Table.Row data-state={row.getIsSelected() && "selected"}>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <Table.Cell>
                            <Sheet.Root>
                                <Sheet.Trigger>
                                    <ContextMenu.Root>
                                        <ContextMenu.Trigger>
                                            <FlexRender
                                                content={cell.column.columnDef
                                                    .cell}
                                                context={cell.getContext()}
                                            />
                                        </ContextMenu.Trigger>
                                        <ContextMenu.Content>
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
                                            {#if adminOnly()}
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
                                            {/if}
                                        </ContextMenu.Content>
                                    </ContextMenu.Root>
                                </Sheet.Trigger>
                                <Sheet.Content>
                                    <Sheet.Header>
                                        <Sheet.Title
                                            >{cell
                                                .getContext()
                                                .row.getValue(
                                                    "title",
                                                )}</Sheet.Title
                                        >
                                        <Sheet.Description>
                                            <div class="mb-5">
                                                <p>
                                                    {cell
                                                        .getContext()
                                                        .row.getValue("body")}
                                                </p>
                                            </div>
                                            <Separator />
                                            <div class="flex flex-row gap-2">
                                                <p class="border-r">
                                                    Status: {statusToText(
                                                        cell
                                                            .getContext()
                                                            .row.getValue(
                                                                "status",
                                                            ),
                                                    )}
                                                </p>
                                                <p class="border-r">
                                                    Kategorie: {categoryToText(
                                                        cell
                                                            .getContext()
                                                            .row.getValue(
                                                                "category",
                                                            ),
                                                    )}
                                                </p>
                                                <p class="border-r">
                                                    Likes: {cell
                                                        .getContext()
                                                        .row.getValue(
                                                            "upvotes",
                                                        )}
                                                </p>
                                                <p class="border-r">
                                                    Author: {cell
                                                        .getContext()
                                                        .row.getValue("owner")}
                                                </p>
                                            </div>
                                        </Sheet.Description>
                                    </Sheet.Header>
                                </Sheet.Content>
                            </Sheet.Root>
                        </Table.Cell>
                    {/each}
                </Table.Row>
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
</div>
