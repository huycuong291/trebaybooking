import React, { useEffect } from 'react';
import { Divider, Group, Image, Stack, Text, Title, Button, TextInput } from '@mantine/core';
import { useSelector } from 'react-redux';
import { getGuestInfo, getHotelPaymentInfo, selectBookedDate, selectGuest } from '@redux/selectors';
import { useBookingInforStyles } from './BookingInfo.style';
import { openModal } from '@mantine/modals';
import Calendar from '../Calendar';
import GuestSelectBoxComponent from '@/components/GuestSelectBox';
import { useForm } from '@mantine/form';
import { useAppDispatch } from '@redux/store';
import { paymentActions } from '@redux/slices';

export default function BookingInfoComponent() {
  const dispatch = useAppDispatch();
  const { classes } = useBookingInforStyles();
  const dates = useSelector(selectBookedDate);
  const guest = useSelector(selectGuest);
  const hotel = useSelector(getHotelPaymentInfo);
  const bookerInfo = useSelector(getGuestInfo);
  const [checkinDate, checkoutDate] = dates;
  const guestInfo = useForm({
    initialValues: bookerInfo,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
      name: (value) => (value?.length ? null : 'Không được để trống tên'),
      phoneNum: (value) => (value?.length ? null : 'Không được để trống sdt')
    }
  });

  useEffect(() => {
    if (guestInfo?.isValid()) {
      dispatch(paymentActions.setBookerInfo(guestInfo.values));
    }
  }, [guestInfo?.values]);

  return (
    <Stack>
      <Title order={3}>Thông tin đặt chỗ</Title>
      <Group noWrap>
        <Image src={hotel?.image || ''} alt="booked-hotel-image" width={130} radius="md" />
        <Stack spacing={5}>
          <Text size="lg">{hotel?.name}</Text>
          <Text color="dimmed">
            Phòng:{' '}
            {hotel?.rooms.map(
              (room, index) => room.roomNo + (index + 1 < hotel?.rooms.length ? ', ' : '')
            )}
          </Text>
          <Text color="dimmed">Địa chỉ: {hotel?.address} </Text>
        </Stack>
      </Group>
      <Stack>
        <Title order={5}>Ngày</Title>
        <Group position="apart">
          <Text>
            Ngày {checkinDate?.toLocaleDateString()} - Ngày {checkoutDate?.toLocaleDateString()}
          </Text>
          <Button
            variant="subtle"
            color="green"
            onClick={() => {
              openModal({
                title: 'Chỉnh sửa ngày nhận phòng/ trả phòng',
                children: <Calendar />,
                size: 'xl'
              });
            }}>
            Chỉnh sửa
          </Button>
        </Group>
      </Stack>
      <Stack>
        <Title order={5}>Khách</Title>
        <Group position="apart">
          <Text>
            {guest?.elder > 0
              ? guest?.children > 0
                ? `${guest?.elder} Người lớn - ${guest?.children} Trẻ em`
                : `${guest?.elder} Người lớn`
              : `${guest?.children} Trẻ em`}
          </Text>
          <Button
            variant="subtle"
            color="green"
            onClick={() => {
              openModal({
                title: 'Chỉnh sửa số lượng người',
                children: <GuestSelectBoxComponent />,
                size: 'sm'
              });
            }}>
            Chỉnh sửa
          </Button>
        </Group>
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Họ và tên</Title>
        <TextInput classNames={{ input: classes.textInput }} {...guestInfo.getInputProps('name')} />
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Số điện thoại đặt chỗ</Title>
        <TextInput
          classNames={{ input: classes.textInput }}
          {...guestInfo.getInputProps('phoneNum')}
        />
      </Stack>
      <Stack spacing={5}>
        <Title order={5}>Email</Title>
        <TextInput
          classNames={{ input: classes.textInput }}
          {...guestInfo.getInputProps('email')}
        />
      </Stack>
      <Divider my="auto" />
      <Title order={3}>Chính sách hủy</Title>
      <Text>
        Miễn phí hủy phòng trước 2:00 chiều trong ngày {checkinDate?.toLocaleDateString()}. Sau khi
        hủy phòng trước 2:00 chiều trong ngày {checkinDate?.toLocaleDateString()} sẽ được hoàn đầy
        đủ tiền cọc. Sau thời gian trên sẽ không hoàn lại tiền cọc
      </Text>
    </Stack>
  );
}
