import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';

const meta = {
	title: 'UI/Select',
	component: Select,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Select>
			<SelectTrigger className='w-[180px]'>
				<SelectValue placeholder='Select a currency' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Currencies</SelectLabel>
					<SelectItem value='usd'>USD ($)</SelectItem>
					<SelectItem value='eur'>EUR (€)</SelectItem>
					<SelectItem value='inr'>INR (₹)</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	),
};
