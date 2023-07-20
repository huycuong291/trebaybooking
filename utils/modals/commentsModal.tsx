import { openModal } from '@mantine/modals';
import { CommentDto } from '../types';
import CommentsModal from '@/components/CommentsModal';

export const openCommentModal = (
  setIsUpdate: (isUpdate: boolean) => void,
  rating: number,
  comments: CommentDto[],
  commment?: CommentDto
) => {
  return openModal({
    children: (
      <CommentsModal
        comments={comments}
        comment={commment}
        rating={rating}
        setIsUpdate={setIsUpdate}
      />
    ),
    size: 'auto'
  });
};
