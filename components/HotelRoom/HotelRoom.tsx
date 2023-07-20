import React from 'react';
import {
  UnstyledButton,
  Text,
  Group,
  Paper,
  Badge,
  Card,
  Divider,
  Button,
  Space
} from '@mantine/core';
import { IconBed } from '@tabler/icons';

import { useHotelRoomStyle } from './HotelRoom.style';
import { RoomProps } from '@/utils/types';
import { useAppDispatch } from '@redux/store';
import { roomActions } from '@redux/slices';
import { useSelector } from 'react-redux';
import { getSelectedRooms } from '@redux/selectors';
import { PRIMARY_COLOR } from '@/constants/theme';
import { formatMoney } from '@/utils/formatter';

export default function HotelRoom(props: RoomProps) {
  const { classes, theme, cx } = useHotelRoomStyle();
  const dispatch = useAppDispatch();
  const { setRoom, unSetRoom } = roomActions;
  const { id, numberOfBed, hourFeePolicy, hotelID, roomNo, dayPrice } = props;
  const selectedRooms = useSelector(getSelectedRooms);
  const isSelected = !!selectedRooms.find((room) => room.id === id);

  const getColor = () => {
    switch (numberOfBed) {
      case 1:
        return theme.colors.green[6];
      case 2:
        return theme.colors.yellow[6];
      case 3:
        return theme.colors.orange[6];
      default:
        return theme.colors.gray[6];
    }
  };

  const onClick = () => {
    !isSelected ? dispatch(setRoom(props)) : dispatch(unSetRoom(props));
  };

  return (
    <Paper
      className={cx(classes.item, {
        [classes.roomSelected]: isSelected
      })}
      shadow="sm"
      onClick={onClick}>
      <Group>
        <Text>
          <Text span size="sm">
            Phòng
          </Text>{' '}
          <Text span color={PRIMARY_COLOR.PRIMARY_DARK_GREEN} weight={600}>
            {roomNo}
          </Text>
        </Text>
        <Badge size="md" color="green" p="sm">
          <Text>
            <Text weight={700} size={15} span>
              {numberOfBed}
            </Text>{' '}
            giường
          </Text>
        </Badge>
      </Group>
      <Divider my="md" />
      <Group position="apart">
        <Text color="dimmed">Giá: </Text>
        <Text color={PRIMARY_COLOR.PRIMARY_DARK_GREEN} weight={600}>
          {dayPrice && formatMoney(dayPrice)}/đêm
        </Text>
      </Group>
      <Space h="md" />
      <Button radius={30} color="green" fullWidth size="xs">
        {isSelected ? 'Hủy chọn' : 'Chọn'}
      </Button>
    </Paper>
  );
}
