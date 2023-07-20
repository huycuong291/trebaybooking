import { createStyles } from '@mantine/core';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '@/constants/theme';

export const useHotelRoomStyle = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700
  },

  item: {
    borderRadius: theme.radius.md,
    padding: 10,
    border: `1px solid ${SECONDARY_COLOR.SECONDARY_GREY}`,
    transition: 'box-shadow 150ms ease, transform 100ms ease',
    cursor: 'pointer',
    borderLeft: `8px solid ${PRIMARY_COLOR.PRIMARY_DARK_GREEN}`,

    '&:hover': {
      boxShadow: `${theme.shadows.md} !important`,
      transform: 'scale(1.05)'
    }
  },

  roomDisabled: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    pointerEvents: 'none',
    zIndex: 2
  },

  roomSelected: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: PRIMARY_COLOR.PRIMARY_LEAST_GREEN,
    zIndex: 3
  }
}));
