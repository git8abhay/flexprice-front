import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Checkbox } from './checkbox';

const meta = {
	title: 'UI/Checkbox',
	component: Checkbox,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
	render: (args) => (
		<div className='flex items-center space-x-2'>
			<Checkbox id='terms' {...args} />
			<label htmlFor='terms' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
				Accept terms and conditions
			</label>
		</div>
	),
};

export const InteractiveToggle: Story = {
	...WithLabel,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checkbox = canvas.getByRole('checkbox');
		await expect(checkbox).not.toBeChecked();
		await userEvent.click(checkbox);
		await expect(checkbox).toBeChecked();
	},
};
