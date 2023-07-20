import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useToggle } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Stack,
  Badge,
  Center
} from '@mantine/core';
import { IconGoogle } from '@/icons/index';
import userApi from '@/api/user';

export default function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);

  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const router = useRouter();
  const { mode } = router.query;
  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      rePassword: ''
    },

    validate: {
      username: (val) => (val.length > 6 ? null : 'Tên đăng nhập không được nhỏ hơn 6 kí tự'),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email không hợp lệ'),
      password: (val) =>
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(val)
          ? null
          : 'Mật khẩu cần chứa ít nhất 8 kí tự, một chữ in hoa, một chữ thường, một số  ',
      rePassword: (val, form) => (val === form.password ? null : 'Mật khẩu không trùng khớp')
    }
  });

  useEffect(() => {
    mode === 'register' ? toggle('register') : toggle('login');
  }, [mode, toggle]);

  const handleSubmitFormAuthen = async () => {
    if (form.validate()) {
      if (type === 'login') {
        const { username, password } = form.values;
        const res = await userApi.login({ username, password });
        if (res.status === 200) {
          router.push('/');
        }
      } else {
        const { username, email, password } = form.values;
        const res = await userApi.signUp({ username, password, email });
        if (res.status === 200) {
          toggle('login');
          setIsRegisterSuccess(true);
        }
      }
    }
  };

  return (
    <Paper w={'100%'} radius="md" p="xl" withBorder {...props} shadow="sm">
      {/* <Button
        variant="default"
        color="gray"
        fullWidth
        radius="xl"
        leftIcon={<IconGoogle style={{ width: 20 }} />}>
        {type === 'login' ? 'Đăng nhập' : 'Đăng ký'} với google
      </Button>

      <Divider label="Hoặc tiếp tục với email" label  Position="center" my="lg" /> */}
      {isRegisterSuccess && (
        <Center>
          <Badge color="green" size="xl">
            Đăng ký thành công
          </Badge>
        </Center>
      )}
      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Email"
              placeholder="Nhập email của bạn"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
            />
          )}

          <TextInput
            required
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập của bạn"
            value={form.values.username}
            onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
            error={form.errors.username}
          />

          <PasswordInput
            required
            label="Mật khẩu"
            placeholder="Mật khẩu của bạn"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
          />
          {type === 'register' && (
            <PasswordInput
              required
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu của bạn"
              value={form.values.rePassword}
              onChange={(event) => form.setFieldValue('rePassword', event.currentTarget.value)}
              error={form.errors.rePassword}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="sm">
            {type === 'register'
              ? 'Đã có tài khoản? Đăng nhập ngay'
              : 'Chưa có tài khoản? Đăng ký ngay'}
          </Anchor>
          <Button onClick={() => handleSubmitFormAuthen()} type="submit" color="teal">
            {type === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
