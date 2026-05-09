import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Textarea } from './textarea';

const meta = {
	title: 'UI/Textarea',
	component: Textarea,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	argTypes: {
		disabled: { control: 'boolean' },
	},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: { placeholder: 'Enter plan description here...' },
};

export const Disabled: Story = {
	args: { disabled: true, placeholder: 'This field is read-only.' },
};

export const InteractiveTyping: Story = {
	args: { placeholder: 'Start typing...' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const textarea = canvas.getByPlaceholderText('Start typing...');
		await userEvent.type(textarea, 'Updated billing logic.');
		await expect(textarea).toHaveValue('Updated billing logic.');
	},
};
