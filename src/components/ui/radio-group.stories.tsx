import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta = {
	title: 'UI/RadioGroup',
	component: RadioGroup,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<RadioGroup defaultValue='monthly'>
			<div className='flex items-center space-x-2'>
				<RadioGroupItem value='monthly' id='r1' />
				<Label htmlFor='r1'>Monthly Billing</Label>
			</div>
			<div className='flex items-center space-x-2'>
				<RadioGroupItem value='annually' id='r2' />
				<Label htmlFor='r2'>Annual Billing</Label>
			</div>
		</RadioGroup>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const annualOption = canvas.getByLabelText('Annual Billing');
		await userEvent.click(annualOption);
		await expect(annualOption).toBeChecked();
	},
};
