import React, { useEffect, useState } from 'react';
import {
  Center,
  Container,
  Rating,
  Text,
  Image,
  Paper,
  Flex,
  TextInput,
  Textarea,
  Space,
  Button
} from '@mantine/core';
import { useCommentsNewModalStyle } from './CommentsNewModal.style';
import { CommentDto } from '@/utils/types';
import Comment from '@/components/Comment';

import hotel from '@/api/hotel';
import userApi from '@/api/user';
interface Props {
  setIsUpdate: (isUpdate: boolean) => void;
  hotel?: {
    name: string;
    image: string;
    id: string;
  };
  comment?: CommentDto;
}

export default function CommentsNewModal(props: Props) {
  const classes = useCommentsNewModalStyle();
  const [userId, setUserId] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const getUserId = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const user = await userApi.getUserInfor(accessToken || '');
      return user;
    };

    const setUserIdToState = async () => {
      const user = await getUserId();
      if (user) {
        setUserId(user._id);
      }
    };

    setUserIdToState();
  }, []);
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
  };

  const handleAddComment = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Số điện thoại k đúng định dạng');
    } else {
      setPhoneError('');
      const data = {
        accommodationID: props.hotel?.id || '',
        date: new Date().toISOString(),
        content: comment,
        userID: userId || '',
        phoneNumber: phoneNumber || '',
        parentID: props.comment?._id || '',
        starRating: rating,
        level: props.comment?.level ? props.comment?.level + 1 : 1,
        type: 'hotel'
      };
      const mess = await hotel.addCommnetToHotel(data);
      console.log(mess);
      props.setIsUpdate(true);
    }
  };
  return (
    <Container>
      <Flex direction={'column'} justify={'center'} align={'center'}>
        {props.hotel && (
          <>
            <Image width={'20rem'} src={props.hotel.image} alt={props.hotel.name} />
            <Text>{props.hotel.name}</Text>
            <Rating fractions={2} size={'xl'} value={rating} onChange={handleRatingChange} />
          </>
        )}
        {props.comment && (
          <Comment setIsUpdate={props.setIsUpdate} currentComment={props.comment} />
        )}
        <Space h={'lg'}></Space>

        <Textarea
          placeholder="Đánh giá của bạn về khách sạn!"
          label="Đánh giá của bạn"
          w={'35rem'}
          value={comment}
          onChange={(e) => handleCommentChange(e)}
        />

        <Space h={'md'}></Space>

        {!userId && (
          <TextInput
            placeholder="Số điện thoại của bạn"
            label="Số điện thoại"
            required
            type="number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            error={phoneError}
          />
        )}
        <Space h={'lg'}></Space>
        <Button onClick={handleAddComment}>Thêm Đánh Giá</Button>
      </Flex>
    </Container>
  );
}
