import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
	title: 'UI/Badge',
	component: Badge,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'secondary', 'destructive', 'outline'],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = { args: { children: 'Active' } };
export const Draft: Story = { args: { variant: 'secondary', children: 'Draft' } };
export const PastDue: Story = { args: { variant: 'destructive', children: 'Past Due' } };
