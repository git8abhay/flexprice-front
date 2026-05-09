import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';

const meta = {
	title: 'UI/Label',
	component: Label,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { children: 'Customer Email Address' },
};

export const Required: Story = {
	args: {
		children: (
			<>
				<span className='text-red-500 mr-1'>*</span>Plan Name
			</>
		),
	},
};
