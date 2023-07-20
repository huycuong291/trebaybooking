import React, { useEffect, createRef } from 'react';
import { Center, Container, Flex, Grid, ScrollArea, Space, Text } from '@mantine/core';
import { useCommentsModalStyle } from './CommentsModal.style';
import { CommentDto } from '@/utils/types';

import Comment from '@/components/Comment';
import { IconStar } from '@tabler/icons';

interface Props {
  setIsUpdate: (isUpdate: boolean) => void;
  rating: number;
  comment?: CommentDto;
  comments: CommentDto[];
}
function checkChildComments(comment: any) {
  // Extract user ID and phone number from the parent comment
  const parentUserID = comment.userID === '000000000000000000000000' ? 'false' : comment.userID._id;
  const parentPhoneNumber =
    comment.phoneNumber === '000000000000000000000000' ? 'false' : comment.phoneNumber;

  const checkReplyComments = (replyComment: any) => {
    if (replyComment.userID === parentUserID || replyComment.phoneNumber === parentPhoneNumber) {
      return true;
    }

    if (replyComment.replyComment && replyComment.replyComment.length > 0) {
      const childCheck = checkReplyComments(replyComment.replyComment[0]);

      if (childCheck) {
        return true;
      }
    }

    return false;
  };

  if (!comment?.replyComment || comment?.replyComment?.length === 0) {
    return false;
  }

  return checkReplyComments(comment?.replyComment[0]);
}

export default function CommentsModal(props: Props) {
  const { comment, comments } = props;
  const { classes } = useCommentsModalStyle();

  // Create a ref for each comment
  interface CommentRefs {
    [key: string]: React.RefObject<HTMLDivElement>;
  }

  const commentRefs = comments.reduce((acc: CommentRefs, value) => {
    acc[value._id] = createRef();
    return acc;
  }, {});

  // Scroll to the provided comment when the component mounts
  useEffect(() => {
    if (comment && commentRefs[comment._id]) {
      commentRefs[comment._id].current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comment]);

  return (
    <Container>
      <Flex>
        <Grid>
          <Grid.Col span={12}>
            <Flex justify={'start'} align={'center'}>
              <Text fw={'bold'} className={classes.ratingInComment}>
                <Center>
                  <IconStar size={'1.25rem'} fill="#000" />
                  <Space w="sm" /> {props.rating}
                </Center>
              </Text>
              <Space w="sm" />
              <Text fw={'bold'} className={classes.ratingInCommentCount}>
                · {comments.length} đánh giá
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
        <ScrollArea style={{ height: 550 }}>
          {comments.map((commentItem) => {
            return (
              <Container key={commentItem._id} p={'md'} ref={commentRefs[commentItem._id]}>
                <Comment
                  setIsUpdate={props.setIsUpdate}
                  isInModal={true}
                  currentComment={commentItem}
                  canReply={!checkChildComments(commentItem)}
                />
              </Container>
            );
          })}
        </ScrollArea>
      </Flex>
    </Container>
  );
}
