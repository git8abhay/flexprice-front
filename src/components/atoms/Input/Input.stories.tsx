// import type { Meta, StoryObj } from '@storybook/react';
// import   Input  from './Input';

// const meta = {
//   title: 'Atoms/Input',
//   component: Input,
//   parameters: {
//     layout: 'centered',
//   },
//   tags: ['autodocs'],
// } satisfies Meta<typeof Input>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// export const Default: Story = {
//   args: {
//     placeholder: 'Enter text here',
//   },
// };

// export const WithLabel: Story = {
//   args: {
//     label: 'Email',
//     placeholder: 'Enter your email',
//     type: 'email',
//   },
// };

// export const WithError: Story = {
//   args: {
//     label: 'Password',
//     type: 'password',
//     error: 'Password must be at least 8 characters',
//     placeholder: 'Enter your password',
//   },
// };

// export const Disabled: Story = {
//   args: {
//     label: 'Username',
//     placeholder: 'Enter your username',
//     disabled: true,
//   },
// };

// export const FullWidth: Story = {
//   args: {
//     label: 'Full Name',
//     placeholder: 'Enter your full name',
//     fullWidth: true,
//   },
//   parameters: {
//     layout: 'padded',
//   },
// };

// export const WithValue: Story = {
//   args: {
//     label: 'Name',
//     value: 'John Doe',
//     placeholder: 'Enter your name',
//   },
// };

import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta = {
	title: 'Atoms/Input',
	component: Input,
	parameters: {
		layout: 'padded', // Better for full-width inputs
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['text', 'number', 'formatted-number', 'integer'],
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg'],
		},
		disabled: { control: 'boolean' },
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text here',
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Email',
		description: 'We will not share your email.',
		placeholder: 'Enter your email',
		type: 'email',
	},
};

export const WithError: Story = {
	args: {
		label: 'Password',
		type: 'password',
		error: 'Password must be at least 8 characters',
		placeholder: 'Enter your password',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Username',
		placeholder: 'Enter your username',
		disabled: true,
	},
};

export const FormattedNumber: Story = {
	args: {
		label: 'Price',
		variant: 'formatted-number',
		placeholder: '10,000.00',
		inputPrefix: '$',
	},
};
