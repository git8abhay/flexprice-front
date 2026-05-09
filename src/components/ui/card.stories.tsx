import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button'; // Composing with the button you already documented!

const meta = {
	title: 'UI/Card',
	component: Card,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className='w-[350px]'>
			<CardHeader>
				<CardTitle>Create Plan</CardTitle>
				<CardDescription>Deploy your new pricing plan in one click.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className='text-sm text-gray-500'>Plan details and forms would go here.</p>
			</CardContent>
			<CardFooter className='flex justify-between'>
				<Button variant='outline'>Cancel</Button>
				<Button>Deploy Plan</Button>
			</CardFooter>
		</Card>
	),
};
