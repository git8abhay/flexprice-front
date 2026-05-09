import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useFilterStore } from '@/store/useFilterStore'; // Apka banaya hua naya store!

const meta = {
	title: 'Molecules/Table/Virtualized',
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// 1. Generate 10,000 Mock Rows
const generateMockInvoices = (count: number) => {
	return Array.from({ length: count }, (_, i) => ({
		id: `INV-${10000 + i}`,
		customer: `Acme Corp ${i + 1}`,
		amount: `$${(Math.random() * 1000).toFixed(2)}`,
		status: Math.random() > 0.5 ? 'Paid' : 'Past Due',
	}));
};

const MOCK_DATA = generateMockInvoices(10000);

const VirtualTableDemo = () => {
	// 2. Consume the Zustand Store
	const { filters, setFilter } = useFilterStore();
	const currentStatusFilter = filters['invoices-table']?.['status'] || '';

	// 3. Filter the Data
	const filteredData = MOCK_DATA.filter((row) => (currentStatusFilter ? row.status === currentStatusFilter : true));

	// 4. Setup Virtualization
	const parentRef = useRef<HTMLDivElement>(null);
	const rowVirtualizer = useVirtualizer({
		count: filteredData.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 48, // approximate row height in pixels
		overscan: 5, // render 5 items outside the visible viewport
	});

	return (
		<div className='w-full max-w-4xl space-y-4 font-sans'>
			{/* FILTER CONTROLS (Checking the Store) */}
			<div className='flex items-center space-x-2'>
				<span className='text-sm font-semibold text-gray-700'>Filter Status:</span>
				<button
					onClick={() => setFilter('invoices-table', 'status', '')}
					className={`px-3 py-1 text-sm border rounded-md ${!currentStatusFilter ? 'bg-black text-white' : 'bg-white text-black'}`}>
					All (10,000)
				</button>
				<button
					onClick={() => setFilter('invoices-table', 'status', 'Paid')}
					className={`px-3 py-1 text-sm border rounded-md ${currentStatusFilter === 'Paid' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-black'}`}>
					Paid Only
				</button>
				<button
					onClick={() => setFilter('invoices-table', 'status', 'Past Due')}
					className={`px-3 py-1 text-sm border rounded-md ${currentStatusFilter === 'Past Due' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black'}`}>
					Past Due Only
				</button>
			</div>

			{/* THE VIRTUALIZED TABLE */}
			<div className='border rounded-md shadow-sm'>
				{/* Table Header */}
				<div className='flex bg-gray-50 px-4 py-3 border-b text-sm font-semibold text-gray-600'>
					<div className='w-1/4'>Invoice ID</div>
					<div className='w-1/2'>Customer</div>
					<div className='w-1/4 text-right'>Amount</div>
					<div className='w-1/4 text-right'>Status</div>
				</div>

				{/* Scrollable Body */}
				<div ref={parentRef} className='h-[400px] overflow-auto relative'>
					<div
						style={{
							height: `${rowVirtualizer.getTotalSize()}px`,
							width: '100%',
							position: 'relative',
						}}>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const item = filteredData[virtualRow.index];
							return (
								<div
									key={virtualRow.key}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: `${virtualRow.size}px`,
										transform: `translateY(${virtualRow.start}px)`,
									}}
									className='flex px-4 py-3 border-b text-sm items-center hover:bg-gray-50 bg-white'>
									<div className='w-1/4 font-mono text-gray-500'>{item.id}</div>
									<div className='w-1/2 font-medium'>{item.customer}</div>
									<div className='w-1/4 text-right'>{item.amount}</div>
									<div className='w-1/4 text-right'>
										<span
											className={`px-2 py-1 rounded-full text-xs ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
											{item.status}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export const MassiveDataHandling: Story = {
	render: () => <VirtualTableDemo />,
};
