import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { fn } from '@storybook/test';
import { Button } from './button';

const meta = {
	title: 'UI/Button',
	component: Button,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: { onClick: fn() }, // Logs clicks in the actions panel
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon'],
		},
		disabled: { control: 'boolean' },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Primary Button' } };

export const Destructive: Story = {
	args: { variant: 'destructive', children: 'Delete Customer' },
};

export const Outline: Story = {
	args: { variant: 'outline', children: 'Cancel' },
};

// Required Interaction Test
export const InteractiveClick: Story = {
	args: { children: 'Submit Payment' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /Submit Payment/i });
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalled();
	},
};
