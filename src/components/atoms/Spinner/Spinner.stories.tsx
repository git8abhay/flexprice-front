import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner'; // Assuming default export based on your earlier Input atom

const meta = {
	title: 'Atoms/Spinner',
	component: Spinner,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
