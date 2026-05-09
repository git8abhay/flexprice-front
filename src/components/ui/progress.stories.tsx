import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';

const meta = {
	title: 'UI/Progress',
	component: Progress,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		value: { control: { type: 'range', min: 0, max: 100 } },
	},
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { value: 33 },
};

export const Complete: Story = {
	args: { value: 100 },
};
