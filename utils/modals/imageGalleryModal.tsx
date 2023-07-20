import { openModal } from '@mantine/modals';
import ImageGallery from 'react-image-gallery';

const images = [
  {
    original:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/e25a9b25-fa98-4160-bfd1-039287bf38b6.jpg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/f4f7b242-db33-46fc-9080-c3d6a6fd55ec.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/372e7d6f-7fb9-4668-92f0-25bb9a346814.jpeg?im_w=720'
  },
  {
    original:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720',
    thumbnail:
      'https://a0.muscache.com/im/pictures/miso/Hosting-34113796/original/4756e699-f474-4ca7-8b77-06b12715a6cb.jpeg?im_w=720'
  }
];

export const openImagesCarouselModal = () =>
  openModal({
    children: (
      <ImageGallery items={images} lazyLoad showPlayButton={false} showFullscreenButton={false} />
    ),
    fullScreen: true
  });
