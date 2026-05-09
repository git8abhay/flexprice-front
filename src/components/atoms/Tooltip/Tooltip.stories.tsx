import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './Tooltip';

const meta = {
	title: 'Atoms/Tooltip',
	component: Tooltip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		content: 'View customer details',
		// We wrap a simple button as the trigger for the tooltip
		children: <button className='px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50'>Hover me</button>,
	},
};
