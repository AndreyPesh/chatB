import { ConversationService } from '../conversation.service';

export type listConversationsData = Awaited<
  ReturnType<ConversationService['getAllConversationByUserId']>
>;
