<script lang="ts">
import { env } from "$env/dynamic/public";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import { Input } from "$lib/components/ui/input";
import * as Table from "$lib/components/ui/table";
import { db, getDb } from "$lib/db";
import Button from "@/components/ui/button/button.svelte";
import type { Report as OriginalReport } from "@/types.js";
import { onMount } from "svelte";
import {
	Render,
	Subscribe,
	createRender,
	createTable,
} from "svelte-headless-table";
import { addSortBy, addTableFilter } from "svelte-headless-table/plugins";
import { Icon } from "svelte-icons-pack";
import { BsArrowDownUp } from "svelte-icons-pack/bs";
import { writable } from "svelte/store";
import DataTableActions from "./bug-table-actions.svelte";

type Report = OriginalReport & {
	// eslint-disable-next-line
	value?: any;
	// eslint-disable-next-line
	original?: any;
};

export const data: Report[] = [];
const cardOpen = false;
let cardContent: Report;

const dataNew = writable(data);
const token = env.PUBLIC_EJ_TOKEN;

async function getEJData() {
	if (!token) return;
	const ejParams = new URLSearchParams({
		type: "ekoapi",
		token: token,
		action: "getReports",
	}).toString();
	const ejAPI = "https://ejberichtsheft.de/";

	const response = await fetch(`${ejAPI}?${ejParams}`, {}).then(
		async (response) => {
			// eslint-disable-next-line
			const respon: Array<any> = await response.json();
			const results: Report[] = [];
			respon.forEach((res) => {
				const result: Report = {
					source: "Typer",
					id: res.report_key,
					title: res.report_title,
					body: res.report_description,
					status: res.report_state,
					category: res.report_type,
					upvotes: 0,
					owner: res.user_name,
				};
				results.push(result);
			});
			let oldSet = $dataNew;
			oldSet = [...oldSet, ...results];
			dataNew.set(oldSet);
		},
	);
	return response;
}

export async function updateTable() {
	await getDb();
	if (db && db.ready) {
		await db
			?.query<Report[][]>(
				"select id, title, body, status, category, upvotes, owner.name as owner from bugreports WHERE status != 10",
			)
			.then((v) => {
				const responses = v[0];
				const results: Report[] = [];

				responses.forEach((res) => {
					const result: Report = {
						source: "Eviaboard",
						id: res.id,
						title: res.title,
						body: res.body,
						status: res.status,
						category: res.category,
						upvotes: res.upvotes,
						owner: res.owner,
					};
					results.push(result);
				});

				dataNew.set(results);
				getEJData();
				return v;
			});
	}
}

onMount(async () => {
	await getDb();
	updateTable();

	// eslint-disable-next-line
	const queryUuid = await db?.live("bugreports", (action, _result) => {
		if (action === "CLOSE") return;
	});
	// eslint-disable-next-line
	await db?.subscribeLive(queryUuid!, async (action, _result) => {
		if (action === "CREATE" || action === "UPDATE" || action === "DELETE") {
			updateTable();
		}
	});
});

const table = createTable(dataNew, {
	sort: addSortBy(),
	filter: addTableFilter({
		fn: ({ filterValue, value }) => {
			return value.toLowerCase().includes(filterValue.toLowerCase());
		},
	}),
});

const columns = table.createColumns([
	table.column({
		accessor: "source",
		header: "App",
		plugins: {
			filter: {
				getFilterValue(value) {
					return "app:" + value;
				},
			},
			sort: {
				disable: false,
			},
		},
	}),
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
		cell: ({ value }) => {
			if (value.length > 30) {
				return `${value.substring(0, 30)}...`;
			} else {
				return value;
			}
		},
	}),
	table.column({
		accessor: "status",
		header: "status",
		plugins: {
			filter: {
				getFilterValue(value) {
					return "status:" + value;
				},
			},
			sort: {
				disable: false,
			},
		},
		cell: ({ value }) => {
			switch (value) {
				case 0:
					return "Open";
				case 1:
					return "WIP";
				case 2:
					return "Accepted";
				case 3:
					return "Denied";
				case 4:
					return "Closed";
				case 10:
					return "Archived";
				default:
					return "Open";
			}
		},
	}),
	table.column({
		accessor: "category",
		header: "category",
		plugins: {
			filter: {
				getFilterValue(value) {
					return "category:" + value;
				},
			},
			sort: {
				disable: false,
			},
		},
		cell: ({ value }) => {
			switch (value) {
				case 0:
					return "Bug";
				case 1:
					return "Feature";
				case 2:
					return "Question";
				default:
					return "Bug";
			}
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
		// eslint-disable-next-line
		cell: ({ value }: any) => {
			return createRender(DataTableActions, { id: value.id });
		},
	}),
]);

const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
	table.createViewModel(columns);

const { filterValue } = pluginStates.filter;
</script>

<div class="flex items-center py-4">
    <Input
        class="max-w-sm"
        placeholder="Filter..."
        type="text"
        bind:value={$filterValue}
    />
</div>

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
                                <Table.Cell
                                    class={cell.id === "status"
                                        ? cell.value === 0
                                            ? "bg-blue-900 rounded-xl"
                                            : cell.value === 1
                                              ? "bg-teal-900 rounded-xl"
                                              : cell.value === 2
                                                ? "bg-purple-900 rounded-xl"
                                                : cell.value === 3
                                                  ? "bg-red-900 rounded-xl"
                                                  : cell.value === 4
                                                    ? "bg-green-900 rounded-xl"
                                                    : ""
                                        : ""}
                                    on:click={() => {
                                        if (cell.id !== "id") {
                                            cardOpen = true;
                                            cardContent = row.original;
                                        }
                                    }}
                                    {...attrs}
                                >
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

<Dialog.Root open={cardOpen} onOpenChange={() => (cardOpen = !cardOpen)}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>{cardContent.title}</Dialog.Title>
        </Dialog.Header>

        <Dialog.Description>
            {cardContent.body}
        </Dialog.Description>
        <Dialog.Footer>
            <p>Upvotes: {cardContent.upvotes}</p>
            <p>Ersteller: {cardContent.owner}</p>
            <p>
                Status: {cardContent.status == 0
                    ? "Open"
                    : cardContent.status == 1
                      ? "WIP"
                      : cardContent.status == 2
                        ? "Accepted"
                        : cardContent.status == 3
                          ? "Denied"
                          : "Closed"}
            </p>
            <p>
                Kategorie: {cardContent.category == 0
                    ? "Bug"
                    : cardContent.category == 1
                      ? "Feature"
                      : "Question"}
            </p>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
