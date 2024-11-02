import { renderComponent, renderSnippet } from '@/components/ui/data-table';
import type { Report } from '@/types';
import type { ColumnDef } from '@tanstack/table-core';
import SortableHeader from './header.svelte';
import { createRawSnippet } from 'svelte';

export const columns: ColumnDef<Report>[] = [
	{
		accessorKey: 'id',
		header: 'Id',
	},
	{
		accessorKey: 'source',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'App',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
	},
	{
		accessorKey: 'title',
		header: 'title',
	},
	{
		accessorKey: 'body',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'Body',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
		cell: ({ row }) => {
			let value = row.getValue('body') as string;
			if (value.length > 30) {
				return `${value.substring(0, 30)}...`;
			} else {
				return value;
			}
		},
	},
	{
		accessorKey: 'status',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'Status',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
		cell: ({ row }) => {
			let formated = createRawSnippet<[number]>((getStatus) => {
				let value = getStatus();
				switch (value) {
					case 0:
						return {
							render: () =>
								`<div class="flex justify-center bg-blue-900 p-3 rounded-xl">Open</div>`,
						};
					case 1:
						return {
							render: () =>
								`<div class="flex justify-center bg-teal-900 p-3 rounded-xl">WIP</div>`,
						};
					case 2:
						return {
							render: () =>
								`<div class="flex justify-center bg-purple-900 p-3 rounded-xl">Accepted</div>`,
						};
					case 3:
						return {
							render: () =>
								`<div class="flex justify-center bg-red-900 p-3 rounded-xl">Denied</div>`,
						};
					case 4:
						return {
							render: () =>
								`<div class="flex justify-center bg-green-900 p-3 rounded-xl">Closed</div>`,
						};
					case 10:
						return {
							render: () =>
								`<div class="flex justify-center bg-slate-900 p-3 rounded-xl">Archived</div>`,
						};
					default:
						return {
							render: () =>
								`<div class="flex justify-center bg-blue-900 p-3 rounded-xl">Open</div>`,
						};
				}
			});

			return renderSnippet(formated, row.getValue('status'));
		},
	},
	{
		accessorKey: 'category',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'Kategorie',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
		cell: ({ row }) => {
			let value = row.getValue('category');
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
		},
	},
	{
		accessorKey: 'upvotes',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'Likes',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
	},
	{
		accessorKey: 'owner',
		header: ({ column }) =>
			renderComponent(SortableHeader, {
				text: 'Author',
				onclick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
			}),
	},
	// {
	// 	accessorKey: 'state',
	// 	header: 'actions',
	// 	cell: ({ row }) => {
	// 		return renderComponent(DataTableActions, { id: row.original.id });
	// 	},
	// },
];
