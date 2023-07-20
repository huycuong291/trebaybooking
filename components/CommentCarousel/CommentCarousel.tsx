import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import { Image, Grid, Text, Container, Flex } from '@mantine/core';
import { useCommentCarouselStyle } from './CommentCarousel.style';
import Comment from '../Comment';
import { CommentDto } from '@/utils/types/storeStateTypes';
import { IconArrowRight, IconPlus } from '@tabler/icons';
import { openCommentModal } from '@/utils/modals/commentsModal';
import { openCommentNewModal } from '@/utils/modals/commentNewModal';
import userApi from '@/api/hotel';
import { closeAllModals } from '@mantine/modals';
interface CommentCarouselProps {
  comments: CommentDto[];
  rating: number;
  hotel: {
    name: string;
    image: string;
    id: string;
  };
  hotelId: string;
}

export default function CommentCarousel(props: CommentCarouselProps) {
  const { rating } = props;
  const { classes } = useCommentCarouselStyle();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const handleShowAllClick = () => {
    openCommentModal(setIsUpdate, rating, comments);
  };
  useEffect(() => {
    fetchCommentData();
  }, []);
  useEffect(() => {
    fetchCommentData();
    setIsUpdate(false);
    closeAllModals();
  }, [isUpdate]);
  const fetchCommentData = async () => {
    const commentsData = await userApi.getAllCommentOfHotel(props.hotelId);
    setComments(commentsData);
  };
  const handleShowMoreClick = (comment: CommentDto) => {
    openCommentModal(setIsUpdate, rating, comments, comment);
  };

  const handleAddCommentClick = () => {
    openCommentNewModal(setIsUpdate, props.hotel, undefined);
  };
  const data = comments?.length >= 6 ? comments.slice(0, 6) : comments;

  return (
    <>
      {data?.map((comment: CommentDto) => (
        <Grid.Col span={6} key={comment._id} p={'md'}>
          <Comment
            setIsUpdate={setIsUpdate}
            currentComment={comment}
            handleShowMoreClick={() => handleShowMoreClick(comment)}
          />
        </Grid.Col>
      ))}
      <Grid.Col span={12}>
        <Flex justify={'space-between'}>
          <Text
            weight={600}
            className={classes.showMore}
            style={{ display: 'flex', fontSize: 16, alignItems: 'center' }}
            onClick={() => handleAddCommentClick()}>
            <IconPlus size={20} /> Thêm Đánh Giá
          </Text>
          <Text
            weight={600}
            className={classes.showMore}
            style={{ display: 'flex', fontSize: 16, alignItems: 'center' }}
            onClick={handleShowAllClick}>
            Hiển Thị Tất Cả <IconArrowRight size={20} />
          </Text>
        </Flex>
      </Grid.Col>
    </>
  );
}
