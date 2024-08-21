import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class AttachmentPresenter {
  static toHTTP(attachment: Attachment) {
    return {
      id: attachment.getId(),
      url: attachment.getUrl(),
      tile: attachment.getTitle(),
    };
  }
}
