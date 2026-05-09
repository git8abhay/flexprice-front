import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { Switch } from './switch';

const meta = {
	title: 'UI/Switch',
	component: Switch,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InteractiveToggle: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const switchEl = canvas.getByRole('switch');
		await expect(switchEl).not.toBeChecked();
		await userEvent.click(switchEl);
		await expect(switchEl).toBeChecked();
	},
};
