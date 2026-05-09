import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
	title: 'UI/Separator',
	component: Separator,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div>
			<div className='space-y-1'>
				<h4 className='text-sm font-medium leading-none'>FlexPrice Framework</h4>
				<p className='text-sm text-muted-foreground'>Open-source usage-based billing.</p>
			</div>
			<Separator className='my-4' />
			<div className='flex h-5 items-center space-x-4 text-sm'>
				<div>Invoices</div>
				<Separator orientation='vertical' />
				<div>Subscriptions</div>
				<Separator orientation='vertical' />
				<div>Customers</div>
			</div>
		</div>
	),
};
